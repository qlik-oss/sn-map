/**
 * Math functions for map
 */
module MathUtils {
  /**
   * Calculates the scaled size or width
   */
  export function calculateSize(
    sizeValue: number,
    range: number[],
    valueMinMax: number[],
    n: number
  ): { relSize: number; size: number } {
    if (isNaN(sizeValue) || sizeValue == null) {
      return { relSize: NaN, size: NaN };
    }
    const v = MathUtils.clamp(sizeValue, valueMinMax[0], valueMinMax[1]);
    const delta = valueMinMax[1] - valueMinMax[0];
    const relSize = delta === 0 ? n / 2 : (n * (v - valueMinMax[0])) / delta;
    const size = Math.round((relSize / n) * (range[1] - range[0]) + range[0]);
    return {
      relSize: Math.floor(relSize),
      size: size,
    };
  }

  export function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Validates then evaluates a mathematical expression (if valid).
   *
   * @throws Throws an error if the expression is not valid of if it failed to evaluate.
   */
  export function evaluate(exp: string, variables: { [name: string]: number } = {}): any {
    let toEvaluate = Object.keys(variables)
      .map((v) => `${v}=${variables[v]}`)
      .join();
    if (toEvaluate.length > 0) {
      toEvaluate = `var ${toEvaluate};`;
    }

    // Everyting that is not a digit, whitespace, or any of the other allowed symbols, check if it is a var or a property of Math.
    toEvaluate += exp.replace(/(?:==|>=|<=|\+\+|--|!=|[a-z][\w]*|[^\d\s+\-()\/*,?:.%|&\^<>!]+)/gi, (q) => {
      if (/==|<=|>=|!=/.test(q) || variables.hasOwnProperty(q)) {
        return q;
      }
      if (Math.hasOwnProperty(q)) {
        return `Math.${q}`;
      }
      throw new Error(exp);
    });

    try {
      // eslint-disable-next-line no-eval
      return eval(toEvaluate);
    } catch {}

    throw new Error(exp);
  }
}

export default MathUtils;

/**
 * Math functions for map
 */
module MathUtils {
  /**
   * Generates an array of coordinates describing an arc from p0 to p1 bending left.
   * Bends left with curviness=0 nothing and curviness=100 max.
   * Probably bends other way in non WGS84 coordinate system
   */
  export function makeLineArc(p1: [number, number], p2: [number, number], curviness: number, islatlong: boolean) {
    const x1 = p1[0];
    let y1 = p1[1];
    const x2 = p2[0];
    let y2 = p2[1];

    if (islatlong) {
      // check wrapping, take shortest distance, coord axes swapped
      if (y2 - y1 > 180) {
        y1 += 360;
        p1 = [x1, y1];
      } else if (y1 - y2 > 180) {
        y2 += 360;
        p2 = [x2, y2];
      }
    }

    if (!curviness || curviness < 2) {
      return [p1, p2];
    }

    // dist between points
    const q = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

    if (q < 0.00001) {
      return [p1, p2];
    }

    // curvf is between [3.8 ... 0.7] (no curve to max curve)
    curviness = curviness / 99;
    const curvf = 4 * Math.pow(Math.E, -1.8 * curviness); // Better scaling of the curve value

    // controls how much it bends
    const r = curvf * q;

    const x3 = (x1 + x2) / 2;
    const y3 = (y1 + y2) / 2;

    // circle center point
    const x0 = x3 + (Math.sqrt(r * r - (q * q) / 4) * (y1 - y2)) / q;
    const y0 = y3 + (Math.sqrt(r * r - (q * q) / 4) * (x2 - x1)) / q;

    const a1 = Math.atan2(y1 - y0, x1 - x0);
    const a2 = Math.atan2(y2 - y0, x2 - x0);

    let da = a2 - a1;

    if (da > Math.PI) {
      da -= 2 * Math.PI;
    }

    if (da < -Math.PI) {
      da += 2 * Math.PI;
    }

    // step approx 5 deg, controls smoothness
    const n = 1 + Math.abs(Math.round(da / 0.09));
    const step = da / n;

    const coords = [[x1, y1]];

    for (let i = 1; i < n; i++) {
      const a = a1 + step * i;
      const x = x0 + r * Math.cos(a);
      const y = y0 + r * Math.sin(a);
      coords.push([x, y]);
    }

    coords.push([x2, y2]);
    return coords;
  }

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

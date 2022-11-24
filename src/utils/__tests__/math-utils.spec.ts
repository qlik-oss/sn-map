import MathUtils from '../math-utils';

describe('math-utils', () => {
  describe('calculateSize', () => {
    it('should calculate size', () => {
      let size = 50;
      let range = [0, 50];
      let valueMinMax = [0, 100];
      let quantify = Math.max(1, Math.min(range[1] - range[0], 100));

      expect(MathUtils.calculateSize(size, range, valueMinMax, quantify).size).toEqual(25);
      size = 100;
      expect(MathUtils.calculateSize(size, range, valueMinMax, quantify).size).toEqual(50);
      size = 0;
      expect(MathUtils.calculateSize(size, range, valueMinMax, quantify).size).toEqual(0);

      size = 50;
      range = [10, 50];
      quantify = Math.max(1, Math.min(range[1] - range[0], 100));
      expect(MathUtils.calculateSize(size, range, valueMinMax, quantify).size).toEqual(30);
      size = 25;
      expect(MathUtils.calculateSize(size, range, valueMinMax, quantify).size).toEqual(20);

      valueMinMax = [30, 90];
      size = 60;
      expect(MathUtils.calculateSize(size, range, valueMinMax, quantify).size).toEqual(30);
      size = 90;
      expect(MathUtils.calculateSize(size, range, valueMinMax, quantify).size).toEqual(50);
      size = 30;
      expect(MathUtils.calculateSize(size, range, valueMinMax, quantify).size).toEqual(10);

      valueMinMax = [40, 50];
      size = 35;
      expect(MathUtils.calculateSize(size, range, valueMinMax, quantify).size).toEqual(10);
      size = 80;
      expect(MathUtils.calculateSize(size, range, valueMinMax, quantify).size).toEqual(50);

      valueMinMax = [10, 10];
      size = 20;
      expect(MathUtils.calculateSize(size, range, valueMinMax, quantify).size).toEqual(30);

      size = 10;
      range = [10, 50];
      valueMinMax = [0, 20];
      quantify = Math.max(1, Math.min(range[1] - range[0], 100));
      expect(MathUtils.calculateSize(size, range, valueMinMax, quantify).size).toEqual(30);
      size = 15;
      expect(MathUtils.calculateSize(size, range, valueMinMax, quantify).size).toEqual(40);
      size = 20;
      expect(MathUtils.calculateSize(size, range, valueMinMax, quantify).size).toEqual(50);
      size = 0;
      expect(MathUtils.calculateSize(size, range, valueMinMax, quantify).size).toEqual(10);
    });
  });

  describe('clamp', () => {
    it('should clamp values', () => {
      expect(MathUtils.clamp(1, 1, 1)).toEqual(1);
      expect(MathUtils.clamp(-1, 0, 1)).toEqual(0);
      expect(MathUtils.clamp(0, -1, 1)).toEqual(0);
      expect(MathUtils.clamp(10, 0, 8)).toEqual(8);
    });
  });

  describe('evaluate', () => {
    it('should work with variables if set in argments', () => {
      expect(MathUtils.evaluate('a * b', { a: 1, b: -3 })).toEqual(-3);
    });

    it('should handle arithmetic expressions', () => {
      expect(MathUtils.evaluate('2 + 3')).toEqual(5);
      expect(MathUtils.evaluate('-1 + 3')).toEqual(2);
      expect(MathUtils.evaluate('81 % 13')).toEqual(3);
      expect(MathUtils.evaluate('1.1 + PI')).toBeCloseTo(1.1 + Math.PI, 0.000001);
      expect(MathUtils.evaluate('(13 * 5 - 3 + 0) / 8')).toEqual(7.75);
      expect(MathUtils.evaluate('.2 + 3.')).toEqual(3.2);
    });

    it('should handle bitwise operations', () => {
      expect(MathUtils.evaluate('3 & 1')).toEqual(1);
      expect(MathUtils.evaluate('PI | 0')).toEqual(3);
      expect(MathUtils.evaluate('2 | 1')).toEqual(3);

      expect(MathUtils.evaluate('1 ^ 1')).toEqual(0);
      expect(MathUtils.evaluate('0 ^ 1')).toEqual(1);

      expect(MathUtils.evaluate('128 >> 3')).toEqual(16);
      expect(MathUtils.evaluate('12<<2')).toEqual(48);
    });

    it('should handle logic operations', () => {
      expect(MathUtils.evaluate('0 && 1')).toEqual(0);
      expect(MathUtils.evaluate('-1 && 13')).toEqual(13);

      expect(MathUtils.evaluate('0 || 15')).toEqual(15);
      expect(MathUtils.evaluate('14 || 15')).toEqual(14);

      expect(MathUtils.evaluate('!0')).toEqual(true);
      expect(MathUtils.evaluate('!1')).toEqual(false);
    });

    it('should handle comparisons', () => {
      expect(MathUtils.evaluate('0 != 1')).toEqual(true);
      expect(MathUtils.evaluate('-13 == 13 * -1')).toEqual(true);

      expect(MathUtils.evaluate('0 < 15')).toEqual(true);
      expect(MathUtils.evaluate('141 > 15')).toEqual(true);

      expect(MathUtils.evaluate('0<=0')).toEqual(true);
      expect(MathUtils.evaluate('0>=-10')).toEqual(true);
    });

    it('should handle mixed expressions', () => {
      expect(MathUtils.evaluate('log10(LOG10E) ** 2')).toBeCloseTo(0.1312, 0.00001);
      expect(MathUtils.evaluate('(1 >= 2 || 13 <= 20) ? 12 : 1.1 == 1.2 ? 13 : 12')).toEqual(12);

      expect(MathUtils.evaluate('1 < 2 ? 3 : 5')).toEqual(3);
      expect(MathUtils.evaluate('1 > 2 ? 3 : 5')).toEqual(5);
    });

    it('should throw when attempting to access other things / break out', () => {
      type VarObj = { [name: string]: number };
      const expectError = (exp: string, msg?: string | VarObj, v?: VarObj) => {
        if (typeof msg !== 'string') {
          v = msg;
        }
        expect(() => MathUtils.evaluate(exp, v)).toThrow(exp);
      };

      expectError('console.log(1)', 'Not allowed to access any object other than Math properties.');
      expectError('a + 1', 'Not allowed to variables not speficied in args.');

      expectError('[+!+[]]+[+[]]', 'Should not allow obfuscated JS');

      expectError('Math.constructor.constructor("console.log(1)")()');
      expectError('Function("console.log(1)")()');
      expectError('setTimeout("console.log(1)")');
      expectError('setinterval("console.log(1)")');

      expectError('\u1234', 'Should not allow escaped unicode');
      expectError('"', 'Should not allow single quotation marks');
      expectError('"', 'Should not allow quotation marks');
      expectError('\\');
      expectError('%22');
      expectError('{');
      expectError('}');
      expectError('=');
      expectError('``');
      expectError('console.log`1`');
      expectError('() => 1');

      expectError('a=1', 'Should not allow assignment', { a: 1 });
      expectError('a++', { a: 1 });
      expectError('++a', { a: 1 });
      expectError('a--', { a: 1 });
      expectError('--a', { a: 1 });
      expectError('a()', { a: 1 });

      expectError('debugger');

      expectError('&', 'Should throw due to eval error');
    });
  });
});

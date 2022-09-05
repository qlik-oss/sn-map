module Utils {
  export function getPathToResources(properties: MapProperties, rootPath: string) {
    switch (properties.visualization) {
      case 'map':
        return `${rootPath}@nebula.js/sn-map/dist`;
      case 'sn-map':
      default:
        return `${rootPath}extensions/sn-map`;
    }
  }

  /**
   * Returns the string bracketed - "Dim Name" -> "[Dim Name]".
   * If the supplied string starts with "[" or "=" the supplied string is returned without change.
   * @param str String to bracket
   */
  export function bracketStringIfNeeded(str: string): string {
    if (str.length > 0 && str.charAt(0) !== '=' && str.charAt(0) !== '[') {
      return `[${str}]`;
    }

    return str;
  }

  export function getChar(value: number): string {
    //               0   o    O   i    I   l
    const banned = [48, 111, 79, 105, 73, 108];
    let val = value;

    let charCode;
    if (val > 9) {
      charCode = 65 + val - 10;
      if (charCode > 90) {
        charCode += 6;
      }
    } else {
      val = `${val}`.charCodeAt(0);
    }

    if (banned.indexOf(charCode as number) > -1) {
      return getChar(val + 1);
    } else {
      return String.fromCharCode(charCode as number);
    }
  }

  export function base62(value: number): string {
    const chr = getChar(value % 62);
    const y = Math.floor(value / 62);
    return y > 0 ? `${base62(y)}${chr}` : `${chr}`;
  }

  export function generateId() {
    const s = base62(Math.round(Math.random() * (1e13 - 1e11) + 1e11));
    return s.replace(/\W/g, '');
  }
}

export default Utils;

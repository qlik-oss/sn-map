/**
 * Creates a Bing quadkey from the given tile x, y, z.
 */
function toQuadKey(x: number, y: number, z: number): string {
  let quadKey = '';
  const tilesAtZ = Math.pow(2, z);
  for (let i = 1; i < z + 1; i++) {
    const tileFactor = Math.pow(2, i) / tilesAtZ;
    const idxY = Math.ceil((y + 1) * tileFactor) - 1;
    const idxX = Math.ceil((x + 1) * tileFactor) - 1;
    quadKey += ((idxY & 1) * 2 + (idxX & 1)).toString(10);
  }
  return quadKey;
}

module GeodataUtils {
  /**
   * Parse url for webmap
   * @param url Tile url
   * @param x
   * @param y
   * @param z Zoom level
   * @param skipIfOutside Allows the function to skip the tile if it is outside normal TMS bounds (not between 0 and 2**z)
   *
   * @throws Error if the URL contains an invalid expression.
   */
  export function parseUrl(url: string, x: number, y: number, z: number, skipIfOutside?: boolean): string | null {
    url = url.replace(/(\${)/gi, '{');

    // Support for the array / subdomain syntax: e.g. {[a,b,c,d]}
    // NOTE: Can't handle nested array patterns!
    const arrayRegex = /{\[[^\]]+\]}/;
    for (let match = arrayRegex.exec(url); match != null && match.length > 0; match = arrayRegex.exec(url)) {
      const array = match[0].replace(/\s+/g, '').slice(2, -2); // remove spaces and [{ }]
      const elems = array.split(',');
      url = url.replace(match[0], elems[Math.abs(x + y + z) % elems.length]);
    }

    // Bing quadkeys: {quadkey}
    url = url.replace(/{quadkey}/gi, toQuadKey(x, y, z));

    const variables: { [key: string]: number } = {
      x: x,
      y: y,
      z: z,
      level: z,
    };
    url = url.replace(/{([^}]*)}/g, (_, exp: string) => {
      return JSON.stringify(variables[exp]);
    });

    // // Skip tile if simple expression (only x,y,z) and tile is outside (if allowed by param).
    const maxTiles = Math.pow(2, z);
    if (skipIfOutside && (z < 0 || y < 0 || y >= maxTiles || x < 0 || x >= maxTiles)) {
      return null;
    }

    return url;
  }
}

export default GeodataUtils;

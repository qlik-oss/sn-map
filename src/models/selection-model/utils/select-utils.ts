import Utils from './utils';

class SelectUtils {
  static isPolygon(feature: idevio.map.Feature) {
    return feature instanceof idevio.map.PolygonFeature && !(feature instanceof idevio.map.LineStringFeature);
  }

  static isLine(feature: idevio.map.Feature) {
    return feature instanceof idevio.map.LineStringFeature && !(feature instanceof idevio.map.PolygonFeature);
  }

  static isPoint(feature: idevio.map.Feature) {
    return feature instanceof idevio.map.PointFeature;
  }

  /**
   * Returns true if the point (x, y) is located inside the polygon, false otherwise. The
   * polygon is defined by a number of points in the order they are connected. E.g.
   * [[0,0], [3,0], [1.5, 3]] would define a triangle. Note that the start point does not have
   * to be included at the end as an end point.
   */
  static pointInPolygon(x: number, y: number, polygon: Coordinate[]) {
    let inPolygon: boolean = false;

    // Ray-casting.
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      if (
        polygon[i][1] > y !== polygon[j][1] > y &&
        x < ((polygon[j][0] - polygon[i][0]) * (y - polygon[i][1])) / (polygon[j][1] - polygon[i][1]) + polygon[i][0]
      ) {
        inPolygon = !inPolygon;
      }
    }

    return inPolygon;
  }

  /**
   * Returns true of the first and last Cordinate are the same.
   * @param lassoPolygon an array of Coordinate
   */
  static isLassoClosed(lassoPolygon: Coordinate[]) {
    const xClosed = lassoPolygon[0][0] === lassoPolygon[lassoPolygon.length - 1][0];
    const yClosed = lassoPolygon[0][1] === lassoPolygon[lassoPolygon.length - 1][1];
    return xClosed && yClosed;
  }

  /**
   * Returns true if the two line segments ab and cd intersect, false otherwise.
   *
   * @param a Coordinate [x,y];
   * @param b Coordinate [x,y];
   * @param c Coordinate [x,y];
   * @param d Coordinate [x,y];
   */
  static linesIntersect(a: Coordinate, b: Coordinate, c: Coordinate, d: Coordinate) {
    const cmp = [c[0] - a[0], c[1] - a[1]];
    const r = [b[0] - a[0], b[1] - a[1]];
    const s = [d[0] - c[0], d[1] - c[1]];

    // Calculate cross products.
    const cmpxr = cmp[0] * r[1] - cmp[1] * r[0];
    const cmpxs = cmp[0] * s[1] - cmp[1] * s[0];
    const rxs = r[0] * s[1] - r[1] * s[0];

    if (cmpxr === 0) {
      // Lines are collinear and intersect if they have any overlap.
      return c[0] - a[0] < 0 !== c[0] - b[0] < 0 || c[1] - a[1] < 0 !== c[1] - b[1] < 0;
    } else if (rxs === 0) {
      // Lines are parallel.
      return false;
    }

    const rxsr = 1 / rxs;
    const t = cmpxs * rxsr;
    const u = cmpxr * rxsr;

    return t >= 0 && t <= 1 && u >= 0 && u <= 1;
  }

  static distanceBetweenPoints(a: Coordinate, b: Coordinate) {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
  }

  /**
   * Function to check if any point on line is within radius of a circle
   * @param   x1          line start point x
   * @param   y1          line start point y
   * @param   x2          line end point x
   * @param   y2          line end point y
   * @param   x           point x
   * @param   y           point y
   * @return  boolean     true if any point of line is inside circle
   */
  static lineCircleIntersect(x1: number, y1: number, x2: number, y2: number, x: number, y: number, r: number) {
    return this.pointToLineDistance(x1, y1, x2, y2, x, y) < r;
  }

  /**
   * Function to get the shortest distance between a line and a point
   * @param   x1          line start point x
   * @param   y1          line start point y
   * @param   x2          line end point x
   * @param   y2          line end point y
   * @param   x           point x
   * @param   y           point y
   * @return  distance    closest distance from a point to a line.
   */
  static pointToLineDistance(x1: number, y1: number, x2: number, y2: number, x: number, y: number) {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    // in case of 0 length line
    if (lenSq !== 0) {
      param = dot / lenSq;
    }

    let xx;
    let yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;

    return Math.sqrt(dx * dx + dy * dy);
  }

  static getLayerFromFeature(feature: idevio.map.Feature, mapModel: MapModelInterFace) {
    const layerModels = mapModel.layers.models;
    const layerIndex = Utils.getLayerIndex(feature, layerModels);
    const layer = layerIndex !== null ? layerModels[layerIndex] : null;
    return layer;
  }
}

export default SelectUtils;

import SelectionTool from './SelectionTool';
import SelectUtils from '../utils/select-utils';

type CircleCallback = (features: idevio.map.Feature[]) => any;

const gatherFeaturesFromShape = (mapModel: MapModelInterFace, c: Coordinate, r: number, rectangle: Rectangle) => {
  const map = mapModel.map;
  const features = map
    .getFeaturesWithin(rectangle.min[0], rectangle.min[1], rectangle.max[0], rectangle.max[1])
    .filter((feature) => {
      if (SelectUtils.isPolygon(feature)) {
        const coordinates = feature.getCoordinates() as Coordinate[][];
        // Checks if any points are inside the circle
        const polygons: Coordinate[][] = [];
        for (let i = 0; i < coordinates.length; i++) {
          polygons[i] = [];
          for (let j = 0; j < coordinates[i].length; j++) {
            const point = map.geoToDisplay(coordinates[i][j]);
            if (SelectUtils.distanceBetweenPoints(c, point) < r) {
              return true;
            }

            polygons[i].push(point);
          }
        }

        // Check if circle center point is inside polygon
        for (let k = 0; k < polygons.length; k++) {
          if (SelectUtils.pointInPolygon(c[0], c[1], polygons[k])) {
            return true;
          }
        }
      } else if (SelectUtils.isLine(feature)) {
        // Line
        const coordinates = feature.getCoordinates() as Coordinate[];
        // Subtracting offset from startEvent coordinate since features are not offset
        const cx = c[0];
        const cy = c[1];

        for (let l = 0; l < coordinates.length; l++) {
          const ax = map.geoToDisplay(coordinates[l])[0];
          const ay = map.geoToDisplay(coordinates[l])[1];
          const bx = map.geoToDisplay(coordinates[Math.min(l + 1, coordinates.length - 1)])[0];
          const by = map.geoToDisplay(coordinates[Math.min(l + 1, coordinates.length - 1)])[1];
          if (SelectUtils.lineCircleIntersect(ax, ay, bx, by, cx, cy, r)) {
            return true;
          }
        }
      } else if (SelectUtils.isPoint(feature)) {
        const coordinate = map.geoToDisplay(feature.getCoordinates() as Coordinate);
        if (SelectUtils.distanceBetweenPoints(c, coordinate) < r) {
          return true;
        }
      }

      return false;
    });

  return features;
};

/**
 * A circle drawing tool
 */
class Circle extends SelectionTool {
  private static readonly FEET_IN_METER: number = 3.28084;
  private static readonly FEET_IN_MILE: number = 5280;

  private radius: number;

  private selectionCallback: CircleCallback;

  // Set in super constructor
  startX!: number;
  startY!: number;

  constructor(mapModel: MapModelInterFace, selectionCallback: CircleCallback) {
    super(mapModel);
    this.radius = 0;
    this.selectionCallback = selectionCallback;
  }

  start() {}

  stop() {}

  doneDrawing() {
    if (this.isActive) {
      const x = this.canvas?.offsetLeft;
      const y = this.canvas?.offsetTop;
      const cx = this.startX - x;
      const cy = this.startY - y;
      this.rectangle.max[0] = cx + this.radius;
      this.rectangle.max[1] = cy + this.radius;
      this.rectangle.min[0] = cx - this.radius;
      this.rectangle.min[1] = cy - this.radius;
      const features = gatherFeaturesFromShape(this.mapModel, [cx, cy], this.radius, this.rectangle);
      console.log('features===', features);
      this.selectionCallback(features ?? []);
    }
  }

  draw(newX: number, newY: number) {
    if (this.canvas) {
      const x = this.canvas.offsetLeft;
      const y = this.canvas.offsetTop;

      const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
      const lx = this.startX - x;
      const ly = this.startY - y;
      const tx = newX - x;
      const ty = newY - y;
      const radius = Math.sqrt(Math.pow(lx - tx, 2) + Math.pow(ly - ty, 2));

      ctx.clearRect(0, 0, this.canvas.width || 0, this.canvas.height || 0);
      ctx.beginPath();
      ctx.strokeStyle = 'dimgray';
      ctx.arc(lx, ly, radius, 0, 2 * Math.PI, false);
      ctx.stroke();

      let dist = Math.round(this.mapModel.map.getDistanceInMeters([lx, ly], [tx, ty]));
      let distString = dist.toFixed(0);
      let suffix = 'm';
      if (this.mapModel.settings.useImperialUnits) {
        dist = dist * Circle.FEET_IN_METER;
        suffix = 'ft';
        if (dist > Circle.FEET_IN_MILE) {
          dist /= Circle.FEET_IN_MILE;
          suffix = 'mi';
        }
        distString = dist.toFixed(dist < 10 ? 1 : 0);
      } else if (dist > 1000) {
        dist /= 1000;
        suffix = 'km';
        distString = dist.toFixed(dist < 10 ? 1 : 0);
      }
      this.radius = SelectUtils.distanceBetweenPoints([this.startX, this.startY], [newX, newY]);
      const fontPrefix = '';
      const sizeString = distString + suffix;
      ctx.fillStyle = 'white';
      ctx.font = fontPrefix + '11pt sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1.5;
      ctx.strokeText(sizeString, lx, ly);
      ctx.fillText(sizeString, lx, ly);
    }
  }
}

export default Circle;

import SelectUtils from '../utils/select-utils';
import SelectionTool from './SelectionTool';

type LassoCallback = (features: idevio.map.Feature[]) => any;

const gatherFeaturesFromShape = (mapModel: MapModelInterFace, lassoPolygon: Coordinate[], rectangle: Rectangle) => {
  if (!mapModel.layers.hasFeatures(false)) {
    return;
  }
  const isClosed = SelectUtils.isLassoClosed(lassoPolygon);
  const map = mapModel.map;
  const featuresInRectangle = map.getFeaturesWithin(
    rectangle.min[0],
    rectangle.min[1],
    rectangle.max[0],
    rectangle.max[1]
  );
  console.log('featuresInReact===', featuresInRectangle);
  const features = featuresInRectangle.filter((feature) => {
    console.log('SelectUtils.isPolygon(feature)===', SelectUtils.isPolygon(feature));
    if (SelectUtils.isPolygon(feature)) {
      const coordinates = feature.getCoordinates() as Coordinate[][];
      const polygons: Coordinate[][] = [];
      // Check if any of the polygons points are inside the lasso
      if (isClosed) {
        for (let i = 0; i < coordinates.length; i++) {
          polygons[i] = [];
          for (let j = 0; j < coordinates[i].length; j++) {
            polygons[i].push(map.geoToDisplay(coordinates[i][j]));
            if (SelectUtils.pointInPolygon(polygons[i][j][0], polygons[i][j][1], lassoPolygon)) {
              return true;
            }
          }
        }
      }
      // lasso line segment intersect feature polygon line segment
      for (let k = 0; k < lassoPolygon.length; k++) {
        for (let l = 0; l < coordinates.length; l++) {
          const p1 = map.displayToGeo(lassoPolygon[k]);
          const p2 = map.displayToGeo(lassoPolygon[Math.min(k + 1, lassoPolygon.length - 1)]);
          for (let m = 0; m < coordinates[l].length; m++) {
            const p3 = coordinates[l][m];
            const p4 = coordinates[l][Math.min(m + 1, coordinates[l].length - 1)];
            if (SelectUtils.linesIntersect(p1, p2, p3, p4)) {
              return true;
            }
          }
        }
      }
    } else if (SelectUtils.isLine(feature)) {
      /* LINE LAYER NOT YET ADDED */
      const coordinates = feature.getCoordinates() as Coordinate[];
      for (let i = 1; i < coordinates.length; i++) {
        const p1 = map.geoToDisplay(coordinates[i - 1]);
        const p2 = map.geoToDisplay(coordinates[i]);
        for (let j = 1; j < lassoPolygon.length; j += 1) {
          const p3 = lassoPolygon[j - 1];
          const p4 = lassoPolygon[j];
          if (SelectUtils.linesIntersect(p1, p2, p3, p4)) {
            return true;
          }
        }
        if (SelectUtils.pointInPolygon(p1[0], p1[1], lassoPolygon)) {
          return true;
        }
      }
    } else if (SelectUtils.isPoint(feature)) {
      const coordinate = map.geoToDisplay(feature.getCoordinates() as Coordinate);
      if (isClosed && SelectUtils.pointInPolygon(coordinate[0], coordinate[1], lassoPolygon)) {
        return true;
      }
    }
    return false;
  });
  return features;
  //   this.processSelection(features);
};

/**
 * A lasso drawing tool.
 */
class Lasso extends SelectionTool {
  private selectionCallback: LassoCallback;
  private pointsDrawn: Coordinate[] = [];
  private isPolygonClosed: boolean = false;

  // Set in super constructor
  startX!: number;
  startY!: number;

  constructor(mapModel: MapModelInterFace, selectionCallback: LassoCallback) {
    super(mapModel);
    this.selectionCallback = selectionCallback;
  }

  private offsetRectangle(rec: Rectangle) {
    const x = this.canvas.offsetLeft;
    const y = this.canvas.offsetTop;

    const offsetRect: Rectangle = {
      min: [rec.min[0] - x, rec.min[1] - y],
      max: [rec.max[0] - x, rec.max[1] - y],
    };

    return offsetRect;
  }

  start() {
    this.pointsDrawn = [];
  }

  stop() {
    this.pointsDrawn = [];
  }

  /**
   * Called when releasing the Lasso (mouseup, mouseout, etc.)
   * @param event
   */
  doneDrawing() {
    if (this.isActive) {
      if (this.isPolygonClosed) {
        this.pointsDrawn.push(this.pointsDrawn[0]);
      }
      const features = gatherFeaturesFromShape(this.mapModel, this.pointsDrawn, this.offsetRectangle(this.rectangle));
      this.selectionCallback(features ?? []);
    }
  }

  updateRectangle(x: number, y: number) {
    this.rectangle.max[0] = x > this.rectangle.max[0] ? x : this.rectangle.max[0];
    this.rectangle.max[1] = y > this.rectangle.max[1] ? y : this.rectangle.max[1];
    this.rectangle.min[0] = x < this.rectangle.min[0] ? x : this.rectangle.min[0];
    this.rectangle.min[1] = y < this.rectangle.min[1] ? y : this.rectangle.min[1];
  }
  /**
   * Draws the lasso on the canvas.
   * @param newX current position X
   * @param newY current position Y
   */
  draw(newX: number, newY: number) {
    if (this.canvas) {
      const x = this.canvas.offsetLeft;
      const y = this.canvas.offsetTop;
      const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
      const lx = this.startX - x;
      const ly = this.startY - y;
      const tx = newX - x;
      const ty = newY - y;
      this.pointsDrawn.push([tx, ty]);
      this.updateRectangle(newX, newY);

      console.log('this.canvas.width===', this.canvas.width);
      ctx.clearRect(0, 0, this.canvas.width || 0, this.canvas.width || 0);
      ctx.beginPath();
      ctx.strokeStyle = 'black';
      ctx.arc(lx, ly, 8, 0, 2 * Math.PI, false);
      ctx.fillStyle = '#00bb00';
      ctx.fill();
      ctx.strokeStyle = '#00bb00';
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(lx, ly);
      for (let i = 0; i < this.pointsDrawn.length; i++) {
        ctx.lineTo(this.pointsDrawn[i][0], this.pointsDrawn[i][1]);
      }
      if (this.pointsDrawn[0]) {
        const dist = Math.sqrt(Math.pow(this.pointsDrawn[0][0] - tx, 2) + Math.pow(this.pointsDrawn[0][1] - ty, 2));
        if (dist < 100) {
          this.dashedLine(ctx, tx, ty, lx, ly, 3);
          this.isPolygonClosed = true;
        } else {
          this.isPolygonClosed = false;
        }
      }
      ctx.strokeStyle = 'dimgray';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  /**
   * Draws a dashed line between two points
   * @param ctx The context to draw on.
   * @param x1 Start pos X
   * @param y1 Start pos Y
   * @param x2 End pos X
   * @param y2 End pos Y
   * @param dashLen Length of dashes
   */
  private dashedLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, dashLen: number) {
    if (typeof dashLen === 'undefined') {
      dashLen = 2;
    }

    ctx.moveTo(x1, y1);
    const dX = x2 - x1;
    const dY = y2 - y1;
    const dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
    const dashX = dX / dashes;
    const dashY = dY / dashes;

    let q = 0;
    while (q++ < dashes) {
      x1 += dashX;
      y1 += dashY;
      ctx[q % 2 === 0 ? 'moveTo' : 'lineTo'](x1, y1);
    }

    ctx[q % 2 === 0 ? 'moveTo' : 'lineTo'](x2, y2);
  }
}

export default Lasso;

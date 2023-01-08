import { SelectionToolIDs } from '../utils/const/selection-tools';

/**
 * A lasso drawing tool.
 */
abstract class SelectionTool {
  private static readonly CANVAS_ID: string = SelectionToolIDs.CANVAS;

  protected canvas!: HTMLCanvasElement; // Is created when tool is activated.

  protected mapModel: MapModelInterFace;

  protected div: HTMLElement;
  protected rectangle: Rectangle;

  protected startX: number | undefined;
  protected startY: number | undefined;

  public isActive: boolean;

  /**
   * Prep for drawing
   */
  abstract start(): void;

  /**
   * Stop drawing
   */
  abstract stop(): void;

  /**
   * Called when releasing the Lasso (mouseup, mouseout, etc.)
   */
  abstract doneDrawing(): void;

  /**
   * Draw on canvas.
   * @param x coordinate
   * @param y coordinate
   */
  abstract draw(x: number, y: number): void;

  /**
   * Constructor
   * @param div The element which to draw the lasso tool on.
   * @param selectionCallback A callback with a list of Coordinate as param. If coordinates is a closed polygon first and last coordinate are the same.
   */
  constructor(mapModel: MapModelInterFace) {
    this.mapModel = mapModel;
    this.div = mapModel.webMapElement;
    this.isActive = false;
    this.startY = undefined;
    this.startX = undefined;
    this.rectangle = { min: [0, 0], max: [0, 0] };
  }

  /**
   * Activates the lasso tool.
   * Sets everything up.
   */
  activate(x: number, y: number): void {
    this.canvas = this.createCanvas();
    this.rectangle = {
      min: [x, y],
      max: [x, y],
    };
    if (this.startX === undefined) {
      this.startX = x;
    }
    if (this.startY === undefined) {
      this.startY = y;
    }

    this.isActive = true;
    this.start();
  }

  /**
   * Deactivates the lasso tool.
   * Tears everything down.
   */
  deactivate() {
    this.isActive = false;
    document.getElementById(SelectionTool.CANVAS_ID)?.remove();
    delete this.startX;
    delete this.startY;
    this.stop();
  }

  release() {
    this.doneDrawing();
    this.deactivate();
  }

  /**
   * Called when moustbutton is pressed and mouse is moved.
   */
  public move(x: number, y: number) {
    this.draw(x, y);
  }

  /**
   * Creates the canvas. Removes any previous
   */
  private createCanvas() {
    // Ensure only one CANVAS_ID exist.
    document.getElementById(SelectionTool.CANVAS_ID)?.remove();

    // Create separate canvas to draw on.
    const canvas = document.createElement('canvas');
    const div = this.div;

    canvas.id = SelectionTool.CANVAS_ID;
    canvas.width = div.clientWidth;
    canvas.height = div.clientHeight;
    canvas.style.zIndex = '10000';
    canvas.style.position = 'absolute';
    canvas.style.border = '0px';
    canvas.style.top = '0px';
    canvas.style.left = '0px';
    canvas.style.pointerEvents = 'none';

    div.append(canvas);
    return canvas;
  }
}

export default SelectionTool;

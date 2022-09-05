import { getViewBounds } from '../utils/view-bounds';
import InteractionListener from '../models/tools/interaction-listener';
import Utils from '../utils/utils';
import GeneralUtils from '../../../utils/general';

/**
 * Class used to help determine if autozooming should occur.
 */
class AutoZoomService {
  firstTime: boolean; // Auto-zoom if this is the first time called. (App opened)
  currentBounds: Rectangle | null;
  previousBounds: Rectangle | null;

  constructor(bounds: Rectangle | null = null) {
    this.currentBounds = this.getBoundsSettings(bounds);
    this.previousBounds = this.getBoundsSettings(bounds);
    this.firstTime = true;
  }

  async zoom(layerModels: GaLayersModelInterface[], map: idevio.map.WebMap) {
    const { triggeredZoom, bounds } = this.triggeredZoom(layerModels, map);
    if (triggeredZoom) {
      return this.zoomToBounds(map, true, bounds);
    }
  }

  /**
   * @param async If true it will set the bounds in a setTimeout call.
   * @param bounds Zoom to these bounds instead of layer bounds.
   * @param noAnim Don't animate (default = false).
   * @returns true if bounds were set.
   */
  async zoomToBounds(map: idevio.map.WebMap, async?: boolean, bounds?: Rectangle | null, noAnim: boolean = false) {
    if (!bounds) {
      return Utils.waitForEvent(map, 'idle');
    }

    const promise = GeneralUtils.createPromise();
    const zoom = async () => {
      new InteractionListener(map);
      if (noAnim) {
        // If not animating we need a map repaint here to make sure that everything is loaded.
        map.repaint();
        await Utils.waitForEvent(map, 'idle');
      }
      promise.resolve();
      map.viewGeoBounds(bounds!, noAnim);
    };

    async ? setTimeout(zoom, 0) : zoom();

    return promise;
  }

  /**
   * Returns true if an auto-zoom should occur.
   * @param bounds Rectangle | null - used to determine if a auto-zoom should be triggered
   */
  triggeredZoom(layerModels: GaLayersModelInterface[], map: idevio.map.WebMap) {
    const layers = Object.values(layerModels);
    const bounds = getViewBounds(map, layers);
    let triggeredZoom = false;
    this.currentBounds = this.getBoundsSettings(bounds);

    if (this.firstTime) {
      this.firstTime = false;
      this.previousBounds = this.getBoundsSettings(bounds);
      triggeredZoom = true;
      return { triggeredZoom, bounds };
    }

    const boundsChanged = this.hasBoundsChanged();
    if (boundsChanged) {
      triggeredZoom = true;
    }

    // Set previous object before returning.
    this.previousBounds = this.getBoundsSettings(bounds);

    return { triggeredZoom, bounds };
  }

  /**
   * Returns true if bounds have changed enough to mandate a new auto-zoom.
   */
  hasBoundsChanged() {
    if (this.previousBounds && this.currentBounds) {
      if (this.isDiffTooBig(this.currentBounds.min[0], this.previousBounds.min[0])) {
        return true;
      }
      if (this.isDiffTooBig(this.currentBounds.min[1], this.previousBounds.min[1])) {
        return true;
      }
      if (this.isDiffTooBig(this.currentBounds.max[0], this.previousBounds.max[0])) {
        return true;
      }
      if (this.isDiffTooBig(this.currentBounds.max[1], this.previousBounds.max[1])) {
        return true;
      }
    } else if (!this.previousBounds && this.currentBounds) {
      return true;
    }

    return false;
  }

  /**
   * Compares two numbers - returns true if diff greater than 1e-6
   * 1e-6 seemed like a good diff for determining if a meaningful change has occured
   * @param x Number
   * @param y Number
   */
  private isDiffTooBig(x: number, y: number): boolean {
    if (Math.abs(x - y) > 1e-6) {
      return true;
    }
    return false;
  }

  /**
   * Returns a copy of bounds (null if bounds == null)
   * @param bounds
   */
  private getBoundsSettings(bounds: Rectangle | null): Rectangle | null {
    if (bounds !== null) {
      return { min: bounds.min, max: bounds.max };
    } else {
      return null;
    }
  }
}

export default AutoZoomService;

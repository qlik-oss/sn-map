import Utils from '../../../../../utils/general';
import Tool from '../common/tool';

/**
 * Listens for an *idle* event following a *viewchanged* event, once.
 * Use this to determine e.g. when zooming has been done.
 */
class InteractionListener extends Tool {
  private viewchanged: boolean = false;
  private promise: PromiseInterface;

  constructor(map: idevio.map.WebMap) {
    super({});
    this.promise = Utils.createPromise();
    this.connectTo(map);
  }

  _connecting() {
    this._addListener('viewchanged', () => (this.viewchanged = true));
    this._addListener('idle', () => {
      if (this.viewchanged) {
        this.promise.resolve();
        this.disconnect();
      }
    });
  }
}

export default InteractionListener;

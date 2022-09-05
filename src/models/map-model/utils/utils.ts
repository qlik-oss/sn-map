import Utils from '../../../utils/general';

module MapModelUtils {
  export async function waitForEvent(map: idevio.map.WebMap, eventType: string) {
    const promise = Utils.createPromise();
    const listener = map.addListener(eventType, (event) => {
      event.source.removeListener(listener);
      promise.resolve();
    });
    return promise;
  }
}
export default MapModelUtils;

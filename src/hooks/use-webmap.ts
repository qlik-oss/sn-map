import { useState, useEffect } from '@nebula.js/stardust';
import loadLocal from '../static/Wm5Local';

type Options = { configuration?: { serverUrl?: string; serverKey?: string } };
type UseWebmapProps = { isLoading: boolean; idevio?: any; error?: string };

const win = window as any;
const isWmLoaded = () => win.idevio?.Connection?.status === 'OK';
const isWmLoading = () => win.idevio?.Connection?.status === 'LOADING';
const isWmFailed = () => win.idevio?.Connection?.status === 'FAILED';

const UseWebmap = (options?: Options): UseWebmapProps => {
  const host = options?.configuration?.serverUrl;
  const key = options?.configuration?.serverKey;

  const [state, setState] = useState({
    isLoading: isWmLoading() || win.idevio?.Connection?.status == null,
    idevio: win.idevio,
    error: isWmFailed() ? win.idevio?.Connection?.message ?? 'Failed to load map script' : undefined,
  });

  const setFailed = (errMessage?: string) => {
    setState({
      isLoading: false,
      idevio: undefined,
      error: errMessage ?? 'Failed to load map script',
    });
  };

  const setLoaded = () => {
    setState({
      isLoading: false,
      idevio: win.idevio,
      error: undefined,
    });
  };

  const loadScript = (script: HTMLScriptElement | null, src: string, local: boolean) => {
    script = document.createElement('script');
    if (local) {
      loadLocal(win.idevio);
      return script;
    } else {
      script.async = true;
      script.src = src;
      // Load local script on error
      script.onerror = () => {
        script = loadScript(script, '', true);
      };
    }
    document.body.appendChild(script);
    win.idevio.Connection.status = 'LOADING';
    return script;
  };

  useEffect(() => {
    if (isWmLoaded()) {
      setLoaded();
    } else {
      // either loading, failed, or never tried
      // set up idevio object to track status / run our callback on script load
      win.idevio = win.idevio ?? {};
      win.idevio.Connection = win.idevio.Connection ?? {};
      win.idevio.Connection.delayedInit = win.idevio.Connection.delayedInit ?? [];
      // Load script if no one is loading it already, or try again if it failed and the url is different
      const src = `${host}/ravegeo/webmap5/script/webmap.nocache.js?key=${key}&opt=tools,geojson,widgets,iconfactory`;
      let script: HTMLScriptElement | null = document.querySelector('script[src*="webmap.nocache.js"]');
      if (!script || (isWmFailed() && script.src !== src)) {
        const loadLocal = !host;
        script = loadScript(script, src, loadLocal);
      }

      const delayedInit = win.idevio.Connection.delayedInit as [() => void];
      const loader = () => {
        // We need put ourselves at the end of the array to make sure that we init after all maps have been added.
        delayedInit.push(() => setLoaded());
      };
      if (delayedInit.indexOf(loader) === -1) {
        delayedInit.push(loader);
      }
      const originalOnWmError = win.onIdevioWebMapError as () => void | undefined;
      win.onIdevioWebMapError = () => {
        // Load local script
        script = loadScript(script, '', true);
        if (originalOnWmError) {
          originalOnWmError();
        }
      };
      // Script event handler to update status in state
      // Note: Even if the script already exists we still need to add
      // event handlers to update the state for *this* hook instance.
      const setStateFromEvent = (_event: Event) => {
        setFailed();
      };
      script.addEventListener('error', setStateFromEvent);
      // Remove event listeners on cleanup
      return () => {
        if (script) {
          script.removeEventListener('error', setStateFromEvent);
        }
      };
    }
  }, [state.idevio]);
  return state;
};

export default UseWebmap;

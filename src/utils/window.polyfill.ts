/**
 * window.requestIdleCallback()
 * version 0.0.0
 * Browser Compatibility:
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback#browser_compatibility
 */
if (!window.requestIdleCallback) {
  window.requestIdleCallback = function (
      callback: IdleRequestCallback,
      options?: IdleRequestOptions
  ): number {
      const opts = options || {};
      const relaxation = 1;
      const timeout = opts.timeout || relaxation;
      const start = performance.now();

      // Cast the return value of setTimeout to `number`
      return setTimeout(() => {
          callback({
              get didTimeout(): boolean {
                  return opts.timeout
                      ? false
                      : (performance.now() - start) - relaxation > timeout;
              },
              timeRemaining(): number {
                  return Math.max(0, relaxation + (performance.now() - start));
              },
          });
      }, relaxation) as unknown as number;
  };
}

/**
* window.cancelIdleCallback()
* version 0.0.0
* Browser Compatibility:
* https://developer.mozilla.org/en-US/docs/Web/API/Window/cancelIdleCallback#browser_compatibility
*/
if (!window.cancelIdleCallback) {
  window.cancelIdleCallback = function (id: number): void {
      clearTimeout(id);
  };
}

/**
* window.requestAnimationFrame()
* version 0.0.0
* Browser Compatibility:
* https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame#browser_compatibility
*/
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = function (
      callback: FrameRequestCallback
  ): number {
      return window.setTimeout(() => {
          callback(performance.now());
      }, 1000 / 60);
  };
}

/**
* window.cancelAnimationFrame()
* version 0.0.0
* Browser Compatibility:
* https://developer.mozilla.org/en-US/docs/Web/API/Window/cancelAnimationFrame#browser_compatibility
*/
if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = function (id: number): void {
      clearTimeout(id);
  };
}
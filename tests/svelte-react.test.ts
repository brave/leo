const fs = require('fs')
const path = require('path')
const vm = require('vm')
const ts = require('typescript')
const React = require('react')

function loadSvelteReact() {
  const sourcePath = path.resolve(
    __dirname,
    '../src/components/svelte-react.ts'
  )
  const source = fs.readFileSync(sourcePath, 'utf-8')
  const { outputText } = ts.transpileModule(source, {
    fileName: sourcePath,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true
    }
  })

  const mod = { exports: {} }
  const fn = vm.runInThisContext(
    `(function(exports, require, module, __filename, __dirname) { ${outputText}\n})`,
    { filename: sourcePath }
  )
  fn(mod.exports, require, mod, sourcePath, path.dirname(sourcePath))
  return mod.exports.default
}

const SvelteWebComponentToReact = loadSvelteReact()

/**
 * Minimal hook harness that simulates React's commit phases:
 * - Renders the forwardRef component
 * - Invokes the returned element's `ref` callback on mount
 * - Runs `useLayoutEffect` callbacks synchronously (layout phase)
 * - Runs `useEffect` callbacks only when `flushPassiveEffects()` is called (passive phase)
 */
function createHarness(Component) {
  const renderFn = Component.render

  const hooks = []
  let hookIndex = 0
  let pendingLayoutEffects = []
  let pendingPassiveEffects = []
  let needsRerender = false
  let lastProps = null
  let lastForwardedRef = null
  let currentRefCallback = null

  const depsMatch = (a, b) =>
    Boolean(
      a && b && a.length === b.length && a.every((v, i) => Object.is(v, b[i]))
    )

  const dispatcher = {
    useRef(initialValue) {
      const i = hookIndex++
      if (i >= hooks.length) {
        hooks.push({ current: initialValue })
      }
      return hooks[i]
    },
    useState(initialValue) {
      const i = hookIndex++
      if (i >= hooks.length) {
        const slot = {
          value:
            typeof initialValue === 'function' ? initialValue() : initialValue,
          setState(updater) {
            const next =
              typeof updater === 'function' ? updater(slot.value) : updater
            if (!Object.is(next, slot.value)) {
              slot.value = next
              needsRerender = true
            }
          }
        }
        hooks.push(slot)
      }
      const slot = hooks[i]
      return [slot.value, slot.setState]
    },
    useCallback(cb, deps) {
      const i = hookIndex++
      if (i >= hooks.length || !depsMatch(hooks[i].deps, deps)) {
        hooks[i] = { cb, deps }
      }
      return hooks[i].cb
    },
    useLayoutEffect(create, deps) {
      const i = hookIndex++
      const prev = hooks[i]
      if (!prev || !depsMatch(prev.deps, deps)) {
        hooks[i] = { create, deps, cleanup: prev?.cleanup }
        pendingLayoutEffects.push(() => {
          if (hooks[i].cleanup) hooks[i].cleanup()
          hooks[i].cleanup = create()
        })
      }
    },
    useEffect(create, deps) {
      const i = hookIndex++
      const prev = hooks[i]
      if (!prev || !depsMatch(prev.deps, deps)) {
        hooks[i] = { create, deps, cleanup: prev?.cleanup }
        pendingPassiveEffects.push(() => {
          if (hooks[i].cleanup) hooks[i].cleanup()
          hooks[i].cleanup = create()
        })
      }
    }
  }

  const internals =
    React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE ||
    React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED

  function runWithDispatcher(fn) {
    const prev =
      'H' in internals ? internals.H : internals.ReactCurrentDispatcher.current
    if ('H' in internals) internals.H = dispatcher
    else internals.ReactCurrentDispatcher.current = dispatcher
    try {
      return fn()
    } finally {
      if ('H' in internals) internals.H = prev
      else internals.ReactCurrentDispatcher.current = prev
    }
  }

  function flushLayoutEffects() {
    while (pendingLayoutEffects.length > 0) {
      const effects = pendingLayoutEffects.splice(0)
      for (const eff of effects) eff()
    }
  }

  function flushPassiveEffects() {
    while (pendingPassiveEffects.length > 0 || needsRerender) {
      const effects = pendingPassiveEffects.splice(0)
      for (const eff of effects) eff()
      if (needsRerender) {
        needsRerender = false
        commitRender(lastProps, undefined, lastForwardedRef)
      }
    }
  }

  function commitRender(props, elToSetRef, forwardedRef = null) {
    lastProps = props
    lastForwardedRef = forwardedRef
    hookIndex = 0
    const vnode = runWithDispatcher(() => renderFn(props, forwardedRef))
    const nextRefCallback = vnode.props?.ref

    if (elToSetRef !== undefined) {
      currentRefCallback = nextRefCallback
      if (currentRefCallback) currentRefCallback(elToSetRef)
    } else if (nextRefCallback !== currentRefCallback) {
      currentRefCallback = nextRefCallback
    }

    flushLayoutEffects()
    return vnode
  }

  return {
    mount(el, props, forwardedRef = null) {
      commitRender(props, el, forwardedRef)
      flushPassiveEffects()
    },
    mountLayoutOnly(el, props, forwardedRef = null) {
      commitRender(props, el, forwardedRef)
    },
    rerenderLayoutOnly(props, forwardedRef = null) {
      commitRender(props, undefined, forwardedRef)
    },
    rerender(props, forwardedRef = null) {
      commitRender(props, undefined, forwardedRef)
      flushPassiveEffects()
    },
    unmount() {
      if (currentRefCallback) {
        currentRefCallback(null)
      }
      for (const h of hooks) {
        if (h && typeof h.cleanup === 'function') {
          h.cleanup()
          h.cleanup = undefined
        }
      }
      flushPassiveEffects()
    }
  }
}

class FakeElement extends EventTarget {}

describe('SvelteWebComponentToReact', () => {
  const WrappedElement = SvelteWebComponentToReact('leo-test-el', FakeElement)

  it('swaps event listeners in the layout phase alongside props so a click before passive effects flush does not run a stale handler', () => {
    const harness = createHarness(WrappedElement)
    const el = new FakeElement()
    const calls = []

    // Initial render: amount = 0, button is disabled
    harness.mount(el, {
      amount: 0,
      isDisabled: true,
      onClick: () => calls.push(0)
    })
    expect(el.isDisabled).toBe(true)

    // Re-render: amount = 5, button becomes enabled.
    // Stop after the layout phase (before passive useEffects flush).
    harness.rerenderLayoutOnly({
      amount: 5,
      isDisabled: false,
      onClick: () => calls.push(5)
    })

    // Props were updated in useLayoutEffect:
    expect(el.isDisabled).toBe(false)
    expect(el.amount).toBe(5)

    // A click arriving right after commit (before passive effects flush)
    // must invoke the new listener (5), not the stale listener (0).
    el.dispatchEvent(new Event('click'))
    expect(calls).toEqual([5])
  })

  it('attaches event listeners during the initial layout commit without waiting for passive effects', () => {
    const harness = createHarness(WrappedElement)
    const el = new FakeElement()
    const onClick = jest.fn()

    harness.mountLayoutOnly(el, { onClick })

    el.dispatchEvent(new Event('click'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('removes an event listener when its on* prop is removed', () => {
    const harness = createHarness(WrappedElement)
    const el = new FakeElement()
    const onClick = jest.fn()

    harness.mount(el, { onClick })
    el.dispatchEvent(new Event('click'))
    expect(onClick).toHaveBeenCalledTimes(1)

    // Re-render without onClick
    harness.rerender({})
    el.dispatchEvent(new Event('click'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('cleans up event listeners on the element when unmounted', () => {
    const harness = createHarness(WrappedElement)
    const el = new FakeElement()
    const onClick = jest.fn()
    const removeSpy = jest.spyOn(el, 'removeEventListener')

    harness.mount(el, { onClick })
    harness.unmount()

    expect(removeSpy).toHaveBeenCalledWith('click', onClick)
  })
})

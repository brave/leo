<script lang="ts">
  import type {
    Middleware,
    MiddlewareData,
    Placement,
    Strategy
  } from '@floating-ui/dom'
  import {
    computePosition,
    flip as flipMiddleWare,
    shift as shiftMiddleware,
    offset as offsetMiddleware,
    autoUpdate as createAutoUpdater
  } from '@floating-ui/dom'
  /** The default placement of the floating element
   * https://floating-ui.com/docs/tutorial#placements */
  export let placement: Placement = 'top'

  /** The fallback placements of the floating element in case initial doesn't fit
   * https://floating-ui.com/docs/flip#fallbackplacements */
  export let fallbackPlacements: Placement[] = undefined

  /** The CSS position property to use for floating element
   * https://floating-ui.com/docs/computeposition#strategy */
  export let positionStrategy: Strategy = 'absolute'

  /** Whether the element should flip to the opposite placement if it doesn't fit
   * https://floating-ui.com/docs/flip */
  export let flip: boolean = true

  /** The shift padding to apply to the floating element. See
   * https://floating-ui.com/docs/shift for more details. */
  export let shift: number | undefined = 2

  /** The gap between the target and the floating element:
   * https://floating-ui.com/docs/offset */
  export let offset: number = 2

  /** Additional middleware to apply. */
  export let middleware: Middleware[] = []

  /** The target element to float near */
  export let target: HTMLElement

  /** Auto update the placement of the dropdown:
   * https://floating-ui.com/docs/autoUpdate
   */
  export let autoUpdate: boolean = false

  /** Called when the position of the floating element has been recomputed */
  export let onComputedPosition: (computed: {
    x: number
    y: number
    middlewareData: MiddlewareData
    placement: Placement
  }) => void = undefined

  export let onMouseEnter: (e: MouseEvent) => void = undefined
  export let onMouseLeave: (e: MouseEvent) => void = undefined

  /**
   * When set, the floating element is promoted into the top layer via the
   * Popover API when |visible| is true, escaping an ancestor's
   * `contain`/`container-type` (which breaks `position: fixed` too).
   */
  export let popover: 'manual' | undefined = undefined

  export let visible: boolean = true

  let floating: HTMLElement

  const supportsPopover =
    typeof HTMLElement !== 'undefined' && 'showPopover' in HTMLElement.prototype

  $: usePopover = Boolean(popover) && supportsPopover

  // position: fixed is required for the top-layer escape to work.
  $: effectiveStrategy = usePopover ? 'fixed' : positionStrategy

  function getMiddlewares(
    flip: boolean,
    shift: number | undefined,
    offset: number,
    additional: Middleware[]
  ) {
    const result: Middleware[] = []
    if (offset) {
      result.push(offsetMiddleware(offset))
    }
    if (flip) {
      result.push(flipMiddleWare({ fallbackPlacements }))
    }
    if (shift !== undefined) {
      result.push(shiftMiddleware({ padding: shift }))
    }
    result.push(...additional)
    return result
  }

  // We need this check because the middleware sometimes generates an
  // x or y value of undefined, 1, or less. This causes the arrow on
  // the floating element to be positioned in the corner incorrectly.
  function hasInvalidArrowPosition(event?: { x?: number; y?: number }) {
    if (!event) return true

    const { x, y } = event
    return (!x && !y) || x <= 1 || y <= 1
  }

  /** Maps floating-ui placement to a CSS transform-origin near the trigger. */
  function transformOriginForPlacement(placement: Placement): string {
    const origins: Record<Placement, string> = {
      top: 'bottom center',
      'top-start': 'bottom left',
      'top-end': 'bottom right',
      bottom: 'top center',
      'bottom-start': 'top left',
      'bottom-end': 'top right',
      left: 'right center',
      'left-start': 'right top',
      'left-end': 'right bottom',
      right: 'left center',
      'right-start': 'left top',
      'right-end': 'left bottom'
    }
    return origins[placement] ?? 'top left'
  }

  function updatePosition(...args: any[]) {
    if (!floating || !target) return

    computePosition(target, floating, {
      placement: placement,
      strategy: effectiveStrategy,
      middleware: getMiddlewares(flip, shift, offset, middleware)
    }).then(({ x, y, placement, middlewareData }) => {
      if (floating) {
        Object.assign(floating.style, {
          left: `${x}px`,
          top: `${y}px`,
          '--leo-floating-transform-origin':
            transformOriginForPlacement(placement)
        })
      }

      if (hasInvalidArrowPosition(middlewareData.arrow)) {
        delete middlewareData.arrow
      }

      onComputedPosition?.({
        x,
        y,
        middlewareData,
        placement
      })
    })
  }

  let cleanup: Function

  $: {
    cleanup?.()

    if (autoUpdate && target && floating) {
      cleanup = createAutoUpdater(target, floating, updatePosition)
    } else {
      updatePosition(target, floating, flip, shift, offset, middleware, effectiveStrategy)
    }
  }

  function showFloating() {
    if (!floating) return

    if (usePopover) {
      if (!floating.matches(':popover-open')) {
        try {
          floating.showPopover({ source: target })
        } catch {
          // Already open, or not showable right now.
        }
      }
    } else {
      // Set synchronously (rather than relying solely on the template's
      // `hidden` binding) so updatePosition() below measures accurate,
      // already-laid-out dimensions. The template binding still exists so
      // Svelte's dead-CSS check keeps .leo-floating[hidden] in the bundle.
      floating.hidden = false
    }

    // Re-measure now that display:none has been removed.
    updatePosition()
  }

  function hideFloating() {
    if (!floating) return

    if (usePopover) {
      if (floating.matches(':popover-open')) {
        try {
          floating.hidePopover()
        } catch {
          // Already hidden/removed - nothing to do.
        }
      }
    } else {
      floating.hidden = true
    }
  }

  $: if (floating) {
    if (visible) showFloating()
    else hideFloating()
  }
</script>

<div
  on:mouseenter={onMouseEnter}
  on:mouseleave={onMouseLeave}
  bind:this={floating}
  class="leo-floating"
  class:visible
  popover={usePopover ? 'manual' : undefined}
  hidden={!usePopover && !visible ? true : undefined}
  style:position={effectiveStrategy}
>
  <slot />
</div>

<style lang="scss">
  .leo-floating {
    z-index: 999;
    width: max-content;
    transform-origin: var(--leo-floating-transform-origin, center);

    opacity: 0;
    transform: scale(var(--leo-floating-scale-from, 0.96));
    pointer-events: none;
    transition:
      opacity var(--leo-duration-m) var(--leo-easing-out),
      transform var(--leo-duration-m) var(--leo-easing-out);

    &.visible {
      opacity: 1;
      transform: scale(1);
      pointer-events: auto;
    }

    @media (prefers-reduced-motion: reduce) {
      transform: none;
      transition: opacity var(--leo-duration-s) var(--leo-easing-out);

      &.visible {
        transform: none;
      }
    }
  }

  // Starting value for the fade-in's first paint after display:none is
  // removed (either path below) - otherwise the transition can be skipped.
  @starting-style {
    .leo-floating.visible {
      opacity: 0;
      transform: scale(var(--leo-floating-scale-from, 0.96));
    }
  }

  // Popover (top-layer) deferred-hide path.
  .leo-floating[popover] {
    inset: unset;
    margin: 0;
    border: none;
    padding: 0;
    overflow: visible;
    background: none;
    color: inherit;
    transition:
      overlay var(--leo-duration-m) allow-discrete,
      display var(--leo-duration-m) allow-discrete;
  }

  // Plain hidden-attribute deferred-hide path (no top layer involved).
  .leo-floating[hidden] {
    transition: display var(--leo-duration-m) allow-discrete;
  }
</style>

<script lang="ts">
  import type { Middleware, Placement, Strategy } from '@floating-ui/dom'
  import {
    computePosition,
    flip as flipMiddleWare,
    shift as shiftMiddleware,
    offset as offsetMiddleware,
    autoUpdate as createAutoUpdater
  } from '@floating-ui/dom'
  import { createEventDispatcher } from 'svelte'

  /** The default placement of the floating element
   * https://floating-ui.com/docs/tutorial#placements */
  export let placement: Placement = 'top'

  /** The fallback placements of the floating element in case initial doesn't fit
   * https://floating-ui.com/docs/flip#fallbackplacements */
   export let fallbackPlacements: Placement[] = undefined;

   /** The CSS position property to use for floating element
   * https://floating-ui.com/docs/computeposition#strategy */
   export let positionStrategy: Strategy = 'absolute';

  /** Whether the element should flip to the opposite placement if it doesn't fit
   * https://floating-ui.com/docs/flip */
  export let flip: boolean = true

  /** The shift padding to apply to the floating element. See
   * https://floating-ui.com/docs/shift for more details. */
  export let shift: number | undefined = 8

  /** The gap between the target and the floating element:
   * https://floating-ui.com/docs/offset */
  export let offset: number = 8

  /** Additional middleware to apply. */
  export let middleware: Middleware[] = []

  /** The target element to float near */
  export let target: HTMLElement

  /** Auto update the placement of the dropdown:
   * https://floating-ui.com/docs/autoUpdate
   */
  export let autoUpdate: boolean = false

  let dispatch = createEventDispatcher()

  let floating: HTMLElement

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

  function updatePosition(...args: any[]) {
    if (!floating || !target) return

    computePosition(target, floating, {
      placement: placement,
      strategy: positionStrategy,
      middleware: getMiddlewares(flip, shift, offset, middleware)
    }).then(({ x, y, placement, middlewareData }) => {
      if (floating) {
        Object.assign(floating.style, {
          left: `${x}px`,
          top: `${y}px`
        })
      }

      if (hasInvalidArrowPosition(middlewareData.arrow)) {
        delete middlewareData.arrow
      }

      dispatch('computedposition', {
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
      updatePosition(target, floating, flip, shift, offset, middleware)
    }
  }
</script>

<div on:mouseenter on:mouseleave bind:this={floating} class="leo-floating" style:position={positionStrategy}>
  <slot />
</div>

<style lang="scss">
  .leo-floating {
    z-index: 999;
    width: max-content;
  }
</style>

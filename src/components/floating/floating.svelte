<script lang="ts">
  import type { Middleware, Placement } from '@floating-ui/dom'
  import {
    computePosition,
    flip as flipMiddleWare,
    shift as shiftMiddleware,
    offset as offsetMiddleware,
    autoUpdate as createAutoUpdater
  } from '@floating-ui/dom'
  import { createEventDispatcher } from 'svelte'

  /** The default placement of the tooltip
   * https://floating-ui.com/docs/tutorial#placements */
  export let placement: Placement = 'top'

  /** Whether the element should flip to the opposite placement if it doesn't fit
   * https://floating-ui.com/docs/flip */
  export let flip: boolean = true

  /** The shift padding to apply to the tooltip. See
   * https://floating-ui.com/docs/shift for more details. */
  export let shift: number | undefined = 8

  /** The gap between the target and the tooltip:
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
      result.push(flipMiddleWare())
    }
    if (shift !== undefined) {
      result.push(shiftMiddleware({ padding: shift }))
    }
    result.push(...additional)
    return result
  }

  function updatePosition(...args: any[]) {
    if (!floating || !target) return

    computePosition(target, floating, {
      placement: placement,
      middleware: getMiddlewares(flip, shift, offset, middleware)
    }).then(({ x, y, placement, middlewareData }) => {
      if (floating) {
        Object.assign(floating.style, {
          left: `${x}px`,
          top: `${y}px`
        })
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

<div on:mouseenter on:mouseleave bind:this={floating} class="leo-floating">
  <slot />
</div>

<style lang="scss">
  .leo-floating {
    position: absolute;
    z-index: 999;
    width: fit-content;
  }
</style>

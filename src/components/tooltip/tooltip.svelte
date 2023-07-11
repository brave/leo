<script lang="ts" context="module">
  export const modes = ['hero', 'info', 'default', 'mini'] as const
  export type Mode = (typeof modes)[number]
</script>

<script lang="ts">
  import type { Middleware, Placement } from '@floating-ui/dom'
  import {
    computePosition,
    flip as flipMiddleWare,
    shift as shiftMiddleware,
    offset as offsetMiddleware,
    arrow as arrowMiddleware
  } from '@floating-ui/dom'
  import { createEventDispatcher } from 'svelte'
  import { fade } from 'svelte/transition'

  export let text: string = undefined

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

  /** The mode of the tooltip. */
  export let mode: Mode = 'mini'

  /* Whether the tooltip is currently visible */
  export let visible: boolean | undefined = undefined

  // Note: This is separate from the |visible| flag because we want to handle
  // controlled and uncontrolled states for this component.
  $: visibleInternal = visible ?? false 

  const dispatch = createEventDispatcher()

  let tooltip: HTMLElement
  let arrow: HTMLElement
  let trigger: HTMLElement

  function getMiddlewares(
    flip: boolean,
    shift: number | undefined,
    offset: number,
    additional: Middleware[],
    arrow: HTMLElement,
    visible: boolean /* included so this is recalculated when it changes */
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
    result.push(arrowMiddleware({ element: arrow }))
    result.push(...additional)
    return result
  }

  $: computePosition(trigger, tooltip, {
    placement: placement,
    middleware: getMiddlewares(flip, shift, offset, middleware, arrow, visible)
  }).then(({ x, y, placement, middlewareData }) => {
    Object.assign(tooltip.style, {
      left: `${x}px`,
      top: `${y}px`
    })

    const { x: arrowX, y: arrowY } = middlewareData.arrow

    const staticSide = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right'
    }[placement.split('-')[0]]

    Object.assign(arrow.style, {
      left: arrowX != null ? `${arrowX}px` : '',
      top: arrowY != null ? `${arrowY}px` : '',
      right: '',
      bottom: '',
      [staticSide]: '-4px'
    })
  })

  function setVisible(newVisible: boolean) {
    if (newVisible === visible) return

    if (visible === undefined) visibleInternal = newVisible
    dispatch('visibilitychange', { visible: newVisible })
  }
</script>

<div
  class="leo-tooltip"
  on:mouseenter={() => setVisible(true)}
  on:mouseleave={() => setVisible(false)}
  on:focusin={() => setVisible(true)}
  on:focusout={() => setVisible(false)}
>
  {#key visibleInternal}
    <div
      class="tooltip"
      class:hero={mode === 'hero'}
      class:info={mode === 'info'}
      class:mini={mode === 'mini'}
      transition:fade={{ duration: 60 }}
      hidden={!visibleInternal}
      bind:this={tooltip}
    >
      <slot name="text">
        {text}
      </slot>
      <div class="arrow" bind:this={arrow} />
    </div>
  {/key}

  <div class="trigger" bind:this={trigger}>
    <slot />
  </div>
</div>

<style lang="scss">
  .leo-tooltip {
    --background: var(
      --leo-tooltip-background,
      var(--leo-color-container-background)
    );
    --text: var(--leo-tooltip-text-color, var(--leo-color-text-primary));
    --shadow: var(--leo-tooltip-shadow, var(--leo-effect-elevation-03));
    --padding: var(--leo-tooltip-padding, var(--leo-spacing-2xl));
    --radius: var(--leo-radius-m);

    position: relative;
    z-index: 0;
    width: fit-content;
  }

  .leo-tooltip .tooltip {
    background: var(--background);
    color: var(--text);
    box-shadow: var(--shadow);
    padding: var(--padding);
    border-radius: var(--radius);

    position: absolute;
    width: max-content;

    font: var(--leo-font-primary-default-regular);
  }

  .leo-tooltip .tooltip .arrow {
    position: absolute;
    background: var(--background);
    width: 8px;
    height: 8px;
    transform: rotate(45deg);
    z-index: -1;
  }

  .leo-tooltip .tooltip.hero {
    --background: var(--leo-gradient-hero);
    --text: var(--leo-color-container-background);
  }

  .leo-tooltip .tooltip.info {
    --background: var(--leo-color-button-background);
    --text: var(--leo-color-container-background);
  }

  .leo-tooltip .tooltip.mini {
    --background: var(--leo-color-gray-10);
    --text: var(--leo-color-text-primary);
    --padding: var(--leo-spacing-s) 6px;
    --shadow: var(--leo-effect-elevation-01);
    --radius: 2px;

    font: var(--leo-font-primary-x-small-regular);
  }

  .leo-tooltip .trigger {
    width: fit-content;
  }
</style>

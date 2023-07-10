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
    offset as offsetMiddleware
  } from '@floating-ui/dom'

  export let text: string = undefined

  // The default placement of the tooltip:
  // https://floating-ui.com/docs/tutorial#placements
  export let placement: Placement = 'top'

  // Whether the element should flip to the opposite placement if it doesn't fit
  // https://floating-ui.com/docs/flip
  export let flip: boolean = true

  // The shift padding to apply to the tooltip. See
  // https://floating-ui.com/docs/shift for more details.
  export let shift: number | undefined = 8

  // The gap between the target and the tooltip:
  // https://floating-ui.com/docs/offset
  export let offset: number = 8

  // Additional middleware to apply.
  export let middleware: Middleware[] = []

  export let mode: Mode = 'info'

  let tooltip: HTMLElement
  let trigger: HTMLElement

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

  $: computePosition(trigger, tooltip, {
    placement: placement,
    middleware: getMiddlewares(flip, shift, offset, middleware)
  }).then(({ x, y }) => {
    Object.assign(tooltip.style, {
      left: `${x}px`,
      top: `${y}px`
    })
  })
</script>

<div
  class="leo-tooltip"
  class:hero={mode === 'hero'}
  class:info={mode === 'info'}
  class:mini={mode === 'mini'}
  bind:this={tooltip}
>
  <slot name="text">
    {text}
  </slot>
</div>

<div class="trigger" bind:this={trigger}>
  <slot />
</div>

<style lang="scss">
  .leo-tooltip {
    --background: var(
      --leo-tooltip-background,
      var(--leo-color-container-background)
    );
    --text: var(--leo-tooltip-text-color, var(--leo-color-text-primary));
    --shadow: var(--leo-tooltip-shadow, var(--leo-effect-elevation-03));
    --padding: var(--leo-tooltip-padding, var(--leo-spacing-24));
    --radius: var(--leo-spacing-8);

    background: var(--background);
    color: var(--text);
    box-shadow: var(--shadow);
    padding: var(--padding);
    border-radius: var(--radius);

    position: absolute;

    width: fit-content;
  }

  .leo-tooltip.hero {
    --background: var(--leo-gradient-hero);
    --text: var(--leo-color-container-background);
  }

  .leo-tooltip.info {
    --background: var(--leo-color-interaction-button-primary-background);
    --text: var(--leo-color-container-background);
  }

  .leo-tooltip.mini {
  }

  .trigger {
    width: fit-content;
  }
</style>

<script lang="ts" context="module">
  export const modes = ['hero', 'info', 'default', 'mini'] as const
  export type Mode = (typeof modes)[number]
</script>

<script lang="ts">
  import type { MiddlewareData, Placement } from '@floating-ui/dom'
  import { arrow as arrowMiddleware } from '@floating-ui/dom'
  import { createEventDispatcher } from 'svelte'
  import { fade } from 'svelte/transition'
  import Floating from '../floating/floating.svelte'

  export let text: string = undefined

  export let placement: Placement = 'top'
  export let flip: boolean = true
  export let shift: number | undefined = 8
  export let offset: number = 8
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

  function positionArrow(
    e: CustomEvent<{ middlewareData: MiddlewareData; placement: Placement }>
  ) {
    const { x: arrowX, y: arrowY } = e.detail.middlewareData.arrow

    const staticSide = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right'
    }[e.detail.placement.split('-')[0]]

    if (!arrow) return

    Object.assign(arrow.style, {
      left: arrowX != null ? `${arrowX}px` : '',
      top: arrowY != null ? `${arrowY}px` : '',
      right: '',
      bottom: '',
      [staticSide]: '-4px'
    })
  }

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
    <Floating
      target={trigger}
      {flip}
      {offset}
      {placement}
      {shift}
      autoUpdate
      middleware={[arrowMiddleware({ padding: 0, element: arrow })]}
      on:computedposition={positionArrow}
    >
      <div
        class="tooltip"
        class:hero={mode === 'hero'}
        class:info={mode === 'info'}
        class:mini={mode === 'mini'}
        class:default={mode === 'default' || !mode}
        transition:fade={{ duration: 60 }}
        hidden={!visibleInternal}
        bind:this={tooltip}
      >
        <slot name="text">
          {text}
        </slot>
        <div
          class="arrow"
          hidden={mode === 'default' || mode === 'mini'}
          bind:this={arrow}
        />
      </div>
    </Floating>
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
    --border-color: transparent;
    --border-width: 0px;
  }

  .leo-tooltip .tooltip {
    background: var(--background);
    color: var(--text);
    box-shadow: var(--shadow);
    padding: var(--padding);
    border-radius: var(--radius);
    border: var(--border-width) solid var(--border-color);
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
    @theme dark {
      --background: var(--leo-color-gray-20);
    }

    --text: var(--leo-color-text-primary);
    --padding: var(--leo-spacing-s) 6px;
    --shadow: var(--leo-effect-elevation-01);
    --radius: 2px;

    font: var(--leo-font-primary-x-small-regular);
  }

  .leo-tooltip .tooltip.default {
    --border-color: var(--leo-color-divider-subtle);
    --border-width: 1px;
  }

  .leo-tooltip .trigger {
    width: fit-content;
  }
</style>

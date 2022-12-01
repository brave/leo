<svelte:options tag="leo-toggle" />

<script context="module" lang="ts">
  export const sizes = ['small', 'medium'] as const
  export type Sizes = typeof sizes[number]

  const DRAG_AMOUNT_TO_CHANGE = 10
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let on: boolean = false
  export let disabled: boolean = false
  export let size: Sizes = 'medium'

  let thumb: HTMLElement

  let dragStartX: number | undefined
  let dragOffsetX: number = 0

  const dispatch = createEventDispatcher()
  const toggle = (newValue?: boolean) => {
    if (newValue === undefined) newValue = !on
    on = newValue
    dispatch('toggle', { on })
  }
</script>

<button
  class={`leo-toggle size-${size}`}
  on:mousedown={(e) => {
    if (disabled) return

    dragStartX = e.clientX
  }}
  {disabled}
  role="switch"
  aria-checked={on}
  part="track"
>
  <div
    bind:this={thumb}
    class="thumb"
    class:dragging={!!dragOffsetX}
    part="thumb"
    aria-hidden="true"
    style="--drag-offset: {dragOffsetX}px"
  >
    <slot name="on-icon" />
  </div>
</button>

<svelte:window
  on:mouseup={() => {
    // If we didn't receive a mouse down, there's nothing to do.
    if (dragStartX === undefined) return

    // If we didn't drag just toggle the state.
    if (dragOffsetX === 0) {
      toggle()
    } else {
      if (dragOffsetX > DRAG_AMOUNT_TO_CHANGE && !on) toggle(true)
      if (dragOffsetX < -DRAG_AMOUNT_TO_CHANGE && on) toggle(false)
    }

    // Reset the dragging attributes.
    dragStartX = undefined
    dragOffsetX = 0
  }}
  on:mousemove={(e) => {
    if (dragStartX === undefined) return
    dragOffsetX = e.clientX - dragStartX
  }}
/>

<style lang="scss">
  .leo-toggle {
    --width: var(--leo-toggle-width, 56px);
    --height: var(--leo-toggle-height, 32px);
    --padding: var(--leo-toggle-padding, 2px);
    --on-color: var(
      --leo-toggle-on-color,
      var(--color-interaction-button-primary-background)
    );
    --on-color-hover: var(--leo-toggle-on-color-hover, var(--color-primary-60));
    --off-color: var(--leo-toggle-off-color, var(--color-gray-30));
    --off-color-hover: var(--leo-toggle-off-color-hover, var(--color-gray-40));
    --thumb-color: var(--leo-toggle-thumb-color, var(--color-white));

    &.size-small {
      --width: 40px;
      --height: 24px;
    }

    @theme (dark) {
      --on-color-hover: var(
        --leo-toggle-on-color-hover,
        var(--color-primary-40)
      );
    }

    all: unset;
    background: var(--off-color);
    width: var(--width);
    height: var(--height);
    border-radius: var(--radius-full);
    padding: var(--padding);
    transition: background-color 0.2s ease-in-out;
    flex-shrink: 0;

    &:disabled {
      opacity: 0.5;
    }

    &:focus-visible:not(:disabled) {
      box-shadow: 0px 0px 0px 1.5px rgba(255, 255, 255, 0.5),
        0px 0px 4px 2px #423eee;
    }

    &:hover:not(:disabled) {
      background-color: var(--off-color-hover);

      &[aria-checked='true'] {
        background-color: var(--on-color-hover);
      }
    }

    & .thumb {
      height: 100%;
      aspect-ratio: 1/1;
      background: white;
      border-radius: var(--radius-full);
      transition: transform 0.2s ease-in-out, color 0.2s ease-in-out;
      --off-thumb-offset: 0px;
      --on-thumb-offset: calc(var(--width) - var(--height) + 0.25px);
      --thumb-offset: var(--off-thumb-offset);
      --drag-offset: 0;
      --thumb-position: max(
        min(
          var(--on-thumb-offset),
          calc(var(--thumb-offset) + var(--drag-offset))
        ),
        var(--off-thumb-offset)
      );

      transform: translate(var(--thumb-position), 0);

      &.dragging {
        transition: transform 0s ease-in-out, color 0.2s ease-in-out;
      }

      display: flex;
      align-items: center;
      justify-content: center;

      box-shadow: var(--effect-elevation-02);

      :global([slot$='-icon']) {
        transition: opacity 0.2s ease-in-out;
      }

      :global([slot='on-icon']) {
        opacity: 0;
      }
    }

    &[aria-checked='true'] {
      background: var(--on-color);

      .thumb {
        --thumb-offset: var(--on-thumb-offset);
        color: var(--on-color);

        :global([slot='on-icon']) {
          opacity: 1;
        }
      }
    }
  }
</style>

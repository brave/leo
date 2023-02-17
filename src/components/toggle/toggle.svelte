<svelte:options tag="leo-toggle" />

<script context="module" lang="ts">
  export const sizes = ['small', 'medium'] as const
  export type Sizes = (typeof sizes)[number]

  const DRAG_AMOUNT_TO_CHANGE = 10
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let on: boolean = false
  export let disabled: boolean = false
  export let size: Sizes = 'medium'

  let thumb: HTMLElement

  let handledClick = false
  let dragStartX: number | undefined
  let dragOffsetX: number = 0

  const dispatch = createEventDispatcher()
  const toggle = (newValue?: boolean) => {
    if (newValue === undefined) newValue = !on
    on = newValue
    dispatch('toggle', { on })
  }
</script>

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

<label class={`leo-toggle size-${size}`}>
  <button
    on:mousedown={(e) => {
      if (disabled) return

      handledClick = true
      dragStartX = e.clientX
    }}
    on:click={(e) => {
      if (handledClick || disabled) {
        handledClick = false
        return
      }

      toggle()
    }}
    {disabled}
    role="switch"
    aria-checked={on}
  >
    <div
      bind:this={thumb}
      class="thumb"
      class:dragging={!!dragOffsetX}
      aria-hidden="true"
      style:--drag-offset="{dragOffsetX}px"
    >
      <div class="on-icon">
        <slot name="on-icon">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.6461 4.00015C14.2516 3.69959 13.6882 3.77573 13.3876 4.17021L7.47971 11.9243L4.53279 8.9774C4.18211 8.62672 3.61356 8.62672 3.26288 8.9774C2.91221 9.32807 2.91221 9.89663 3.26288 10.2473L6.93634 13.9208C7.11956 14.104 7.37301 14.1991 7.63155 14.1817C7.89009 14.1643 8.12851 14.0361 8.28555 13.83L14.8161 5.25861C15.1167 4.86413 15.0406 4.3007 14.6461 4.00015Z"
              fill="currentColor"
            />
          </svg>
        </slot>
      </div>
    </div>
  </button>
  <slot />
</label>

<style lang="scss">
  .leo-toggle {
    --width: var(--leo-toggle-width, 56px);
    --height: var(--leo-toggle-height, 32px);
    --padding: var(--leo-toggle-padding, 2px);
    --on-color: var(
      --leo-toggle-on-color,
      var(--leo-color-interaction-button-primary-background)
    );
    --on-color-hover: var(
      --leo-toggle-on-color-hover,
      var(--leo-color-primary-60)
    );
    --off-color: var(--leo-toggle-off-color, var(--leo-color-gray-30));
    --off-color-hover: var(
      --leo-toggle-off-color-hover,
      var(--leo-color-gray-40)
    );
    --thumb-color: var(--leo-toggle-thumb-color, var(--leo-color-white));
    --thumb-disabled-color: var(--leo-toggle-thumb-disabled-color, white);
    --label-gap: var(--leo-toggle-label-gap, var(--leo-spacing-4));
    --label-flex-direction: var(--leo-toggle-label-flex-direction, row);

    &.size-small {
      --width: 40px;
      --height: 24px;
    }

    @theme (dark) {
      --on-color-hover: var(
        --leo-toggle-on-color-hover,
        var(--leo-color-primary-40)
      );
      --thumb-disabled-color: var(--leo-toggle-thumb-disabled-color, black);
    }

    display: flex;
    align-items: center;
    flex-direction: var(--label-flex-direction);
    gap: var(--label-gap);
  }

  .leo-toggle button {
    all: unset;
    background: var(--off-color);
    width: var(--width);
    height: var(--height);
    border-radius: var(--leo-radius-full);
    padding: var(--padding);
    transition: background-color 0.2s ease-in-out;
    flex-shrink: 0;

    &:disabled {
      opacity: 0.5;

      > .thumb {
        background: var(--thumb-disabled-color);
      }
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

      height: 100%;
      aspect-ratio: 1/1;
      background: white;
      border-radius: var(--leo-radius-full);
      transition: transform 0.2s ease-in-out, color 0.2s ease-in-out;

      transform: translate(var(--thumb-position), 0);

      &.dragging {
        transition: transform 0s ease-in-out, color 0.2s ease-in-out;
      }

      display: flex;
      align-items: center;
      justify-content: center;

      box-shadow: var(--leo-effect-elevation-02);

      .on-icon {
        transition: opacity 0.2s ease-in-out;
        display: flex;
        opacity: 0;
      }
    }

    &[aria-checked='true'] {
      background: var(--on-color);

      .thumb {
        --thumb-offset: var(--on-thumb-offset);
        color: var(--on-color);

        .on-icon {
          opacity: 1;
        }
      }
    }
  }
</style>

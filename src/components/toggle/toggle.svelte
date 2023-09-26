<script context="module" lang="ts">
  export const sizes = ['small', 'medium'] as const
  export type Sizes = (typeof sizes)[number]

  const DRAG_AMOUNT_TO_CHANGE = 10
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let checked: boolean = false
  export let disabled: boolean = false
  export let size: Sizes = 'medium'

  let thumb: HTMLElement

  let handledClick = false
  let dragStartX: number | undefined
  let dragOffsetX: number = 0

  const dispatch = createEventDispatcher()
  const onChange = (newValue?: boolean) => {
    if (newValue === undefined) newValue = !checked
    checked = newValue
    dispatch('change', { checked })
  }
</script>

<svelte:window
  on:mouseup={() => {
    // If we didn't receive a mouse down, there's nothing to do.
    if (dragStartX === undefined) return

    // If we didn't drag just toggle the state.
    if (dragOffsetX === 0) {
      onChange()
    } else {
      if (dragOffsetX > DRAG_AMOUNT_TO_CHANGE && !checked) onChange(true)
      if (dragOffsetX < -DRAG_AMOUNT_TO_CHANGE && checked) onChange(false)
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

<label class={`nala-toggle size-${size}`}>
  <button
    on:mousedown={(e) => {
      if (disabled) return

      handledClick = true
      dragStartX = e.clientX
    }}
    on:click|stopPropagation={(e) => {
      if (handledClick || disabled) {
        handledClick = false
        return
      }

      onChange()
    }}
    {disabled}
    role="switch"
    aria-checked={checked}
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
  <slot {checked} />
</label>

<style lang="scss">
  :host {
    display: inline-block;
  }

  .nala-toggle {
    --width: var(--nl-toggle-width, 56px);
    --height: var(--nl-toggle-height, 32px);
    --padding: var(--nl-toggle-padding, 2px);
    --checked-color: var(
      --nl-toggle-checked-color,
      var(--nl-color-button-background)
    );
    --checked-color-hover: var(
      --nl-toggle-checked-color-hover,
      var(--nl-color-primary-60)
    );
    --unchecked-color: var(
      --nl-toggle-unchecked-color,
      var(--nl-color-gray-30)
    );
    --unchecked-color-hover: var(
      --nl-toggle-unchecked-color-hover,
      var(--nl-color-gray-40)
    );
    --thumb-color: var(--nl-toggle-thumb-color, var(--nl-color-white));
    --thumb-disabled-color: var(--nl-toggle-thumb-disabled-color, white);
    --label-gap: var(--nl-toggle-label-gap, var(--nl-spacing-s));
    --label-flex-direction: var(--nl-toggle-label-flex-direction, row);

    &.size-small {
      --width: 40px;
      --height: 24px;
    }

    @theme (dark) {
      --checked-color-hover: var(
        --nl-toggle-checked-color-hover,
        var(--nl-color-primary-40)
      );
      --thumb-disabled-color: var(--nl-toggle-thumb-disabled-color, black);
    }

    display: flex;
    align-items: center;
    flex-direction: var(--label-flex-direction);
    gap: var(--label-gap);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .nala-toggle button {
    all: unset;
    background: var(--unchecked-color);
    width: var(--width);
    height: var(--height);
    border-radius: var(--nl-radius-full);
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
      background-color: var(--unchecked-color-hover);

      &[aria-checked='true'] {
        background-color: var(--checked-color-hover);
      }
    }

    & .thumb {
      --unchecked-thumb-offset: 0px;
      --checked-thumb-offset: calc(var(--width) - var(--height) + 0.25px);
      --thumb-offset: var(--unchecked-thumb-offset);
      --drag-offset: 0;
      --thumb-position: max(
        min(
          var(--checked-thumb-offset),
          calc(var(--thumb-offset) + var(--drag-offset))
        ),
        var(--unchecked-thumb-offset)
      );

      height: 100%;
      aspect-ratio: 1/1;
      background: white;
      border-radius: var(--nl-radius-full);
      transition: transform 0.2s ease-in-out, color 0.2s ease-in-out;

      transform: translate(var(--thumb-position), 0);

      &.dragging {
        transition: transform 0s ease-in-out, color 0.2s ease-in-out;
      }

      display: flex;
      align-items: center;
      justify-content: center;

      box-shadow: var(--nl-effect-elevation-02);

      .on-icon {
        transition: opacity 0.2s ease-in-out;
        display: flex;
        opacity: 0;
      }
    }

    &[aria-checked='true'] {
      background: var(--checked-color);

      .thumb {
        --thumb-offset: var(--checked-thumb-offset);
        color: var(--checked-color);

        .on-icon {
          opacity: 1;
        }
      }
    }
  }
</style>

<script context="module" lang="ts">
  export const sizes = ['small', 'medium'] as const
  export type Sizes = (typeof sizes)[number]

  const DRAG_AMOUNT_TO_CHANGE = 10
</script>

<script lang="ts">
  export let checked: boolean = false
  export let disabled: boolean = false
  export let size: Sizes = 'medium'
  export let onChange: (detail: { checked: boolean }) => void = undefined

  let thumb: HTMLElement

  let handledClick = false
  let dragStartX: number | undefined
  let dragOffsetX: number = 0

  const change = (newValue?: boolean) => {
    if (newValue === undefined) newValue = !checked
    checked = newValue
    onChange?.({ checked: newValue })
  }

  function finishDrag() {
    // If we didn't receive a mouse down, there's nothing to do.
    if (dragStartX === undefined) return

    // If we didn't drag just toggle the state.
    if (dragOffsetX === 0) {
      change()
    } else {
      if (dragOffsetX > DRAG_AMOUNT_TO_CHANGE && !checked) change(true)
      if (dragOffsetX < -DRAG_AMOUNT_TO_CHANGE && checked) change(false)
    }

    // Reset the dragging attributes.
    dragStartX = undefined
    dragOffsetX = 0
  }
</script>

<svelte:window
  on:mouseup={finishDrag}
  on:mousemove={(e) => {
    if (dragStartX === undefined) return
    dragOffsetX = e.clientX - dragStartX

    if (document.documentElement.dir === 'rtl') dragOffsetX = -dragOffsetX

    // The mouse was released but we didn't get a mouseup event
    if (e.buttons === 0) {
      finishDrag()
    }
  }}
/>

<label class={`leo-toggle size-${size}`}>
  <button
    on:mousedown={(e) => {
      if (disabled || e.button !== 0) return

      handledClick = true
      dragStartX = e.clientX
    }}
    on:click|stopPropagation={(e) => {
      if (handledClick || disabled) {
        handledClick = false
        return
      }

      change()
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
        <slot name="on-icon" />
      </div>
    </div>
  </button>
  <slot {checked} />
</label>

<style lang="scss">
  :global(:root) {
    --leo-direction: 1;
  }

  :global(:root[dir='rtl']) {
    --leo-direction: -1;
  }

  :host {
    display: inline-block;
  }

  .leo-toggle {
    --foreground-color: black;

    --duration: var(--leo-toggle-transition-duration, 0.12s);
    @media (prefers-reduced-motion) {
      --duration: 0;
    }

    --icon-size: var(--leo-icon-size, 20px);
    --width: var(--leo-toggle-width, 52px);
    --height: var(--leo-toggle-height, 32px);
    --padding: var(--leo-toggle-padding, var(--leo-spacing-s));
    --checked-color: var(
      --leo-toggle-checked-color,
      var(--leo-color-schemes-primary)
    );
    --unchecked-color: var(
      --leo-toggle-unchecked-color,
      var(--leo-color-schemes-outline-variant)
    );
    --thumb-color: var(
      --leo-toggle-thumb-color,
      var(--leo-color-schemes-on-primary)
    );
    --thumb-disabled-color: var(--leo-toggle-thumb-disabled-color, white);
    --label-gap: var(--leo-toggle-label-gap, var(--leo-spacing-s));
    --label-flex-direction: var(--leo-toggle-label-flex-direction, row);

    &.size-small {
      --width: 40px;
      --height: 24px;
      --icon-size: var(--leo-icon-size, 12px);
    }

    @theme (dark) {
      --foreground-color: white;
    }

    display: flex;
    align-items: center;
    flex-direction: var(--label-flex-direction);
    gap: var(--label-gap);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .leo-toggle button {
    --leo-icon-size: var(--icon-size);

    all: unset;
    background: var(--unchecked-color);
    width: calc(var(--width) - 2 * var(--padding));
    height: calc(var(--height) - 2 * var(--padding));
    border-radius: var(--leo-radius-full);
    padding: var(--padding);
    transition: background-color var(--duration) ease-in-out, box-shadow var(--duration) ease-in-out;
    flex-shrink: 0;

    &:disabled {
      opacity: 0.5;

      > .thumb {
        background: var(--thumb-disabled-color);
      }
    }

    &:focus-visible {
      box-shadow: var(--leo-effect-focus-state-offset);
    }

    &:hover:not(:disabled) {
      --hover-bg: var(--unchecked-color);

      &[aria-checked='true'] {
        --hover-bg: var(--checked-color);
      }

      background: color-mix(
        in srgb,
        var(--hover-bg) 80%,
        var(--foreground-color)
      );
    }

    &[aria-checked="false"] .thumb {
      --thumb-color: var(--leo-color-white);
    }

    & .thumb {
      --unchecked-thumb-offset: 0px;
      --checked-thumb-offset: calc(var(--width) - var(--height));
      --thumb-offset: var(--unchecked-thumb-offset);
      --drag-offset: 0;
      --thumb-position: calc(
        max(
            min(
              var(--checked-thumb-offset),
              calc(var(--thumb-offset) + var(--drag-offset))
            ),
            var(--unchecked-thumb-offset)
          ) * var(--leo-direction)
      );

      height: 100%;
      aspect-ratio: 1/1;
      background: var(--thumb-color);
      border-radius: var(--leo-radius-full);
      transition:
        transform var(--duration) ease-in-out,
        color var(--duration) ease-in-out,
        opacity var(--duration) ease-in-out;

      transform: translate(var(--thumb-position), 0);

      &.dragging {
        transition:
          transform 0s ease-in-out,
          color var(--duration) ease-in-out;
      }

      display: flex;
      align-items: center;
      justify-content: center;

      .on-icon {
        transition: opacity var(--duration) ease-in-out;
        display: flex;
        opacity: 0;
      }
    }

    &[aria-checked='true'] {
      background: var(--checked-color);

      .thumb {
        --thumb-offset: var(--checked-thumb-offset);
        color: var(--checked-color);
        --thumb-disabled-color: var(--leo-toggle-thumb-disabled-color, white);

        .on-icon {
          opacity: 1;
        }
      }
    }
  }
</style>

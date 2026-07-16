<script lang="ts" context="module">
  import { preloadIcon } from '../icon/icon.svelte'

  export let sizes = ['small', 'normal'] as const
  export type Sizes = (typeof sizes)[number]

  preloadIcon('radio-checked')
  preloadIcon('radio-unchecked')
</script>

<script lang="ts">
  import { onMount } from 'svelte'
  import Icon from '../icon/icon.svelte'
  import type { ChangeEventHandler } from 'svelte/elements'

  export let currentValue: string | number | any
  export let value: string | number | any
  export let name: string
  export let size: Sizes = 'normal'
  export let isDisabled = false

  export let onChange: (detail: { value: string | number | any }) => void = () => {}

  const tagName = 'leo-radiobutton'

  // Skip the enter animation on first paint (same pattern as checkbox).
  let animate = false
  onMount(() => {
    const handle = requestAnimationFrame(() => (animate = true))
    return () => cancelAnimationFrame(handle)
  })

  const changed: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (isDisabled || !e.currentTarget?.checked) return

    // If we're in a custom element, make sure we update all the
    // other elements in our group, to make the behavior the same
    // as the built in radio.
    const maybeElement = (e.currentTarget.getRootNode() as ShadowRoot)?.host
    if (maybeElement && maybeElement.tagName === tagName.toUpperCase()) {
      // Note: We query the rootNode containing the element so we work
      // even when our element is contained inside another shadowRoot.
      const elements = (
        maybeElement.getRootNode() as Document | ShadowRoot
      ).querySelectorAll(`${tagName}[name=${name}]`) as any as {
        currentValue: typeof value
      }[]
      for (const el of elements) el.currentValue = value
    }

    currentValue = value
    onChange?.({ value })
  }
</script>

<label
  class="leo-radiobutton"
  class:small={size === 'small'}
  class:disabled={isDisabled}
  class:isChecked={currentValue === value}
  class:animate
>
  <div class="check">
    <input
      type="radio"
      {name}
      checked={currentValue === value}
      on:change={changed}
    />
    <div class="check-mark checked">
      <Icon name="radio-checked" />
    </div>
    <div class="check-mark unchecked">
      <Icon name="radio-unchecked" />
    </div>
  </div>
  <slot>{value}</slot>
</label>

<style lang="scss">
  :host {
    display: inline-block;
  }

  :host > label {
    width: 100%;
  }

  .leo-radiobutton {
    --focus-border-radius: var(--leo-radiobutton-focus-border-radius, 2px);
    --label-gap: var(--leo-radiobutton-label-gap, var(--leo-spacing-m));
    --flex-direction: var(--leo-radiobutton-flex-direction, row);
    --checked-color: var(
      --leo-radiobutton-checked-color,
      var(--leo-color-icon-interactive)
    );
    --checked-color-hover: var(
      --leo-radiobutton-checked-color-hover,
      var(--leo-color-primary-70)
    );
    --unchecked-color: var(
      --leo-radiobutton-unchecked-color,
      var(--leo-color-icon-default)
    );
    --unchecked-color-hover: var(
      --leo-radiobutton-unchecked-color-hover,
      var(--leo-color-neutral-70)
    );
    --disabled-color: var(
      --leo-radiobutton-disabled-color,
      var(--leo-color-text-disabled)
    );
    --font: var(--leo-radiobutton-font, var(--leo-font-default-regular));
    --radiobutton-size: var(--leo-radiobutton-radiobutton-size, 20px);
    --motion-duration: var(--leo-duration-s, 120ms);
    --motion-easing: var(--leo-easing-out, cubic-bezier(0.23, 1, 0.32, 1));

    display: flex;
    flex-direction: var(--flex-direction);
    align-items: center;
    gap: var(--label-gap);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    font: var(--font);

    &.disabled {
      cursor: not-allowed;
    }

    // Note: We need both of these because WebKit doesn't support the :has
    // selector inside a shadowRoot.
    &.isChecked,
    &:has(input:checked) {
      & .check {
        color: var(--checked-color);

        & .checked {
          opacity: 1;
          transform: scale(1);
        }

        & .unchecked {
          opacity: 0;
          transform: scale(0.85);
        }
      }
    }
  }

  .leo-radiobutton.small {
    --radiobutton-size: var(--leo-radiobutton-radiobutton-size, 16px);
  }

  .leo-radiobutton.disabled {
    color: var(--disabled-color);
  }

  .leo-radiobutton.disabled .check {
    color: var(--disabled-color) !important;
  }

  .leo-radiobutton .check {
    --leo-icon-size: var(--radiobutton-size);

    flex-shrink: 0;

    position: relative;
    width: var(--radiobutton-size);
    height: var(--radiobutton-size);

    transition: box-shadow var(--motion-duration) var(--motion-easing);
    border-radius: var(--leo-radius-full);

    color: var(--unchecked-color);

    > input {
      opacity: 0;
    }

    > div {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }

    & .checked {
      opacity: 0;
      transform: scale(0.85);
    }

    & .unchecked {
      opacity: 1;
      transform: scale(1);
    }

    &:has(input:focus-visible) {
      box-shadow: var(--leo-effect-focus-state);
    }
  }

  .leo-radiobutton.animate .check .check-mark {
    transition:
      opacity var(--motion-duration) var(--motion-easing),
      transform var(--motion-duration) var(--motion-easing);

    @media (prefers-reduced-motion: reduce) {
      transition: opacity var(--motion-duration) var(--motion-easing);
      transform: none !important;
    }
  }

  @media (hover: hover) {
    .leo-radiobutton:hover .check {
      color: var(--unchecked-color-hover);

      &:has(input:checked) {
        color: var(--checked-color-hover);
      }
    }
  }
</style>

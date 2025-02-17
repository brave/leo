<script lang="ts" context="module">
  import { preloadIcon } from '../icon/icon.svelte'

  export let sizes = ['small', 'normal'] as const
  export type Sizes = (typeof sizes)[number]

  const transition = { duration: 120 }

  preloadIcon('radio-checked')
  preloadIcon('radio-unchecked')
</script>

<script lang="ts">
  import { fade, scale } from 'svelte/transition'
  import Icon from '../icon/icon.svelte'
  import type { ChangeEventHandler } from 'svelte/elements'

  export let currentValue: string | number | any
  export let value: string | number | any
  export let name: string
  export let size: Sizes = 'normal'
  export let isDisabled = false

  export let onChange: (detail: { value: string | number | any }) => void = () => {}

  const tagName = 'leo-radiobutton'

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
>
  <div class="check">
    <input
      type="radio"
      {name}
      checked={currentValue === value}
      on:change={changed}
    />
    {#if currentValue === value && currentValue}
      <div transition:scale={transition}>
        <Icon name="radio-checked" />
      </div>
    {:else}
      <div out:fade={transition}>
        <Icon name="radio-unchecked" />
      </div>
    {/if}
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

    transition: box-shadow 0.12s ease-in-out;
    border-radius: var(--leo-radius-full);

    color: var(--unchecked-color);

    &:has(input:checked) {
      color: var(--checked-color);
    }

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

    &:has(input:focus-visible) {
      box-shadow: var(--leo-effect-focus-state);
    }
  }

  .leo-radiobutton:hover .check {
    color: var(--unchecked-color-hover);

    &:has(input:checked) {
      color: var(--checked-color-hover);
    }
  }
</style>

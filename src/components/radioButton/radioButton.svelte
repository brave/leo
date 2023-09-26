<script lang="ts" context="module">
  import { preloadIcon } from '../icon/icon.svelte'

  export let sizes = ['small', 'normal'] as const
  export type Sizes = (typeof sizes)[number]

  const transition = { duration: 120 }

  preloadIcon('radio-checked')
  preloadIcon('radio-unchecked')
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { fade, scale } from 'svelte/transition'
  import Icon from '../icon/icon.svelte'

  export let currentValue: string | number | any
  export let value: string | number | any
  export let name: string
  export let size: Sizes = 'normal'
  export let isDisabled = false

  const tagName = 'nala-radiobutton'
  const dispatch = createEventDispatcher()

  function changed(e) {
    if (isDisabled || !e.target.checked) return

    // If we're in a custom element, make sure we update all the
    // other elements in our group, to make the behavior the same
    // as the built in radio.
    const maybeElement = e.target.getRootNode()?.host
    if (maybeElement && maybeElement.tagName === tagName.toUpperCase()) {
      // Note: We query the rootNode containing the element so we work
      // even when our element is contained inside another shadowRoot.
      const elements = maybeElement
        .getRootNode()
        .querySelectorAll(`${tagName}[name=${name}]`)
      for (const el of elements) el.currentValue = value
    }

    currentValue = value
    dispatch('change', { value })
  }
</script>

<label
  class="nala-radiobutton"
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

  .nala-radiobutton {
    --focus-border-radius: var(--nl-radiobutton-focus-border-radius, 2px);
    --label-gap: var(--nl-radiobutton-label-gap, var(--nl-spacing-m));
    --flex-direction: var(--nl-radiobutton-flex-direction, row);
    --checked-color: var(
      --nl-radiobutton-checked-color,
      var(--nl-color-icon-interactive)
    );
    --checked-color-hover: var(
      --nl-radiobutton-checked-color-hover,
      var(--nl-color-primary-50)
    );
    --unchecked-color: var(
      --nl-radiobutton-unchecked-color,
      var(--nl-color-icon-default)
    );
    --unchecked-color-hover: var(
      --nl-radiobutton-unchecked-color-hover,
      var(--nl-color-gray-50)
    );
    --disabled-color: var(
      --nl-radiobutton-disabled-color,
      var(--nl-color-text-disabled)
    );
    --font: var(--nl-radiobutton-font, var(--nl-font-primary-default-regular));
    --radiobutton-size: var(--nl-radiobutton-radiobutton-size, 20px);

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

  .nala-radiobutton.small {
    --radiobutton-size: var(--nl-radiobutton-radiobutton-size, 16px);
  }

  .nala-radiobutton.disabled {
    color: var(--disabled-color);
  }

  .nala-radiobutton.disabled .check {
    color: var(--disabled-color) !important;
  }

  .nala-radiobutton .check {
    --nl-icon-size: var(--radiobutton-size);

    position: relative;
    width: var(--radiobutton-size);
    height: var(--radiobutton-size);

    transition: box-shadow 0.12s ease-in-out;
    border-radius: var(--nl-radius-full);

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
      box-shadow: 0px 0px 0px 1.5px rgba(255, 255, 255, 0.5),
        0px 0px 4px 2px #423eee;
    }
  }

  .nala-radiobutton:hover .check {
    color: var(--unchecked-color-hover);

    &:has(input:checked) {
      color: var(--checked-color-hover);
    }
  }
</style>

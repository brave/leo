<script lang="ts" context="module">
  export let sizes = ['small', 'normal'] as const
  export type Sizes = (typeof sizes)[number]

  const transition = { duration: 120 }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { fade } from 'svelte/transition'
  import Icon from '../icon/icon.svelte'

  export let currentValue: string | number | any
  export let value: string | number | any
  export let name: string
  export let size: Sizes = 'normal'
  export let isDisabled = false

  const tagName = 'leo-radiobutton'
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
    dispatch('changed', { value })
  }
</script>

<label
  class="leo-radioButton"
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
      <div transition:fade={transition}>
        <Icon name="radio-checked" />
      </div>
    {:else}
      <div transition:fade={transition}>
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

  .leo-radioButton {
    --focus-border-radius: var(--leo-checkbox-focus-border-radius, 2px);
    --label-gap: var(--leo-checkbox-label-gap, var(--leo-spacing-8));
    --checked-color: var(
      --leo-checkbox-checked-color,
      var(--leo-color-icon-interactive)
    );
    --checked-color-hover: var(
      --leo-checkbox-checked-color-hover,
      var(--leo-color-primary-50)
    );
    --unchecked-color: var(
      --leo-checkbox-unchecked-color,
      var(--leo-color-icon-default)
    );
    --unchecked-color-hover: var(
      --leo-checkbox-unchecked-color-hover,
      var(--leo-color-gray-50)
    );
    --disabled-color: var(
      --leo-checkbox-disabled-color,
      var(--leo-color-text-disabled)
    );
    --font: var(--leo-checkbox-font, var(--leo-font-primary-default-regular));
    --checkbox-size: var(--leo-radiobutton-checkbox-size, 20px);

    display: flex;
    flex-direction: row;
    gap: var(--leo-spacing-4);
  }

  .leo-radioButton.small {
    --checkbox-size: var(--leo-radiobutton-checkbox-size, 16px);
  }

  .leo-radioButton.disabled {
    color: var(--disabled-color);
  }

  .leo-radioButton.disabled .check {
    color: var(--disabled-color) !important;
  }

  .leo-radioButton .check {
    position: relative;
    width: var(--checkbox-size);
    height: var(--checkbox-size);
    --leo-icon-size: var(--checkbox-size);

    color: var(--checked-color);

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
  }
</style>

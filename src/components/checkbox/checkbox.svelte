<script lang="ts" context="module">
  export const sizes = ['small', 'normal'] as const
  export type Sizes = (typeof sizes)[number]

  const fadeTransition = { duration: 120 }
</script>

<script lang="ts">
  import { fade } from 'svelte/transition'

  import Icon from '../icon/icon.svelte'

  export let checked: boolean
  export let isDisabled = false
  export let size: Sizes = 'normal'
</script>

<label
  class="leo-checkbox"
  class:small={size === 'small'}
  class:normal={size !== 'small'}
  class:disabled={isDisabled}
>
  <div class="check">
    <input disabled={isDisabled} type="checkbox" bind:checked />
    {#if checked}
      <div transition:fade={fadeTransition}>
        <Icon name="checkbox-checked" />
      </div>
    {:else}
      <div transition:fade={fadeTransition}>
        <Icon name="checkbox-unchecked" />
      </div>
    {/if}
  </div>
  <slot />
</label>

<style lang="scss">
  :host {
    display: inline-block;
  }

  .leo-checkbox {
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

    display: flex;
    align-items: center;
    flex-direction: row;
    gap: var(--label-gap);
    font: var(--font);
    cursor: pointer;
  }

  .leo-checkbox.disabled {
    color: var(--disabled-color);
  }

  .normal {
    --checkbox-size: var(--leo-checkbox-size, 20px);
  }

  .small {
    --checkbox-size: var(--leo-checkbox-size, 16px);
  }

  .leo-checkbox input {
    opacity: 0;
  }

  .leo-checkbox .check {
    --leo-icon-size: var(--checkbox-size);
    position: relative;
    width: var(--checkbox-size);
    height: var(--checkbox-size);

    color: var(--unchecked-color);

    div {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }

    &:has(input:checked) {
      color: var(--checked-color);
    }

    &:has(input:focus-visible) {
      box-shadow: 0px 0px 0px 1.5px rgba(255, 255, 255, 0.5),
        0px 0px 4px 2px #423eee;
      border-radius: var(--focus-border-radius);
    }
  }

  .leo-checkbox.disabled .check {
    color: var(--disabled-color) !important;
  }

  .leo-checkbox:hover .check {
    color: var(--unchecked-color-hover);

    &:has(input:checked) {
      color: var(--checked-color-hover);
    }
  }
</style>

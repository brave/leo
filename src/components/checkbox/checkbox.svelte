<script lang="ts" context="module">
  import { preloadIcon } from '../icon/icon.svelte'

  export const sizes = ['small', 'normal'] as const
  export type Sizes = (typeof sizes)[number]

  // Preload the SVGs we need for the component.
  preloadIcon('checkbox-checked')
  preloadIcon('checkbox-unchecked')
</script>

<script lang="ts">
  import Icon from '../icon/icon.svelte'

  export let checked: boolean
  export let isDisabled = false
  export let size: Sizes = 'normal'

  export let onChange: (detail: { checked: boolean }) => void = undefined
</script>

<label
  class="leo-checkbox"
  class:small={size === 'small'}
  class:normal={size !== 'small'}
  class:disabled={isDisabled}
>
  <div class="check">
    <input
      disabled={isDisabled}
      type="checkbox"
      bind:checked
      on:change={(e) => onChange?.({ checked: e.currentTarget.checked })}
    />
    <div class="check-mark checked">
      <Icon name="checkbox-checked" />
    </div>
    <div class="check-mark unchecked">
      <Icon name="checkbox-unchecked" />
    </div>
  </div>
  <slot />
</label>

<style lang="scss">
  :host {
    display: inline-block;
  }

  :host .leo-checkbox {
    width: 100%;
  }

  .leo-checkbox {
    --focus-border-radius: var(--leo-checkbox-focus-border-radius, 2px);
    --label-gap: var(--leo-checkbox-label-gap, var(--leo-spacing-m));
    --flex-direction: var(--leo-checkbox-flex-direction, row);
    --checked-color: var(
      --leo-checkbox-checked-color,
      var(--leo-color-icon-interactive)
    );
    --checked-color-hover: var(
      --leo-checkbox-checked-color-hover,
      var(--leo-color-primary-70)
    );
    --unchecked-color: var(
      --leo-checkbox-unchecked-color,
      var(--leo-color-icon-default)
    );
    --unchecked-color-hover: var(
      --leo-checkbox-unchecked-color-hover,
      var(--leo-color-neutral-70)
    );
    --disabled-color: var(
      --leo-checkbox-disabled-color,
      var(--leo-color-text-disabled)
    );
    --font: var(--leo-checkbox-font, var(--leo-font-default-regular));

    display: flex;
    align-items: center;
    flex-direction: var(--flex-direction);
    gap: var(--label-gap);
    font: var(--font);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    &.disabled {
      cursor: not-allowed;
    }
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

    & .check-mark {
      transition: opacity 120ms ease-in-out;
    }

    & .checked {
      opacity: 0;
    }

    & .unchecked {
      opacity: 1;
    }

    &:has(input:checked) {
      color: var(--checked-color);

      & .checked {
        opacity: 1;
      }

      & .unchecked {
        opacity: 0;
      }
    }

    &:has(input:focus-visible) {
      box-shadow:
        0px 0px 0px 1.5px rgba(255, 255, 255, 0.5),
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

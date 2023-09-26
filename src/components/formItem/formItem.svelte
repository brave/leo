<script lang="ts" context="module">
  import type { ArgType } from '@storybook/addons'
  export let sizes = ['small', 'normal', 'large'] as const
  export type Size = (typeof sizes)[number]

  export let modes = ['filled', 'outline'] as const
  export type Mode = (typeof modes)[number]

  export let cssProperties: { [key: `--nl-control-${string}`]: ArgType<any> } =
    {
      '--nl-control-label-direction': {
        description:
          'Controls how the label and control flow together. Accepts a <flex-direction>',
        control: 'select',
        options: ['column', 'column-reverse', 'row', 'row-reverse']
      },
      '--nl-control-radius': {
        description: 'The border radius of the control',
        type: 'string'
      },
      '--nl-control-padding': {
        description: 'The padding of the control',
        type: 'string'
      },
      '--nl-control-font': {
        description: 'The font used by the control',
        type: 'string'
      },
      '--nl-control-icon-size': {
        description: 'The icon size used by the control',
        type: 'string'
      },
      '--nl-control-icon-color': {
        description: 'The icon color used by the control',
        control: 'color'
      },
      '--nl-control-label-gap': {
        description: 'The gap between the label and the control',
        type: 'string'
      }
    }
</script>

<script lang="ts">
  export let disabled = false
  export let size: Size = 'normal'

  export let required = false
  export let mode: Mode = 'outline'

  export let showFocusOutline: boolean = false
  export let error = false
</script>

<label
  class="nala-form-item"
  class:small={size === 'small'}
  class:large={size === 'large'}
  class:filled={mode === 'filled'}
  class:outline={mode !== 'filled'}
  class:focus={showFocusOutline}
  class:error
  aria-disabled={disabled}
>
  <div class="label-row">
    <slot name="label" />
    {#if required}<span class="required-indicator">*</span>{/if}
  </div>
  <div class="control">
    <div class="container">
      <div>
        <slot name="left-icon" />
      </div>
      <slot />
      <div>
        <slot name="right-icon" />
      </div>
    </div>
    <slot name="after" />
  </div>
</label>

<style lang="scss">
  .nala-form-item {
    --radius: var(--nl-control-radius, var(--nl-spacing-m));
    --padding: var(--nl-control-padding, 9px);
    --font: var(--nl-control-font, var(--nl-font-primary-default-regular));
    --nl-icon-size: var(--nl-control-icon-size, 20px);
    --nl-icon-color: var(--nl-control-icon-color, var(--nl-color-icon-default));
    --gap: var(--nl-control-label-gap, var(--nl-spacing-s));
    --direction: var(--nl-control-label-direction, column);

    --color: var(--nl-color-text-primary);
    --color-hover: var(--color);
    --color-focus: var(--color);

    --background: var(--nl-color-container-background);
    --background-hover: var(--background);
    --background-focus: var(--background);

    --shadow: ;
    --shadow-hover: var(--shadow);
    --shadow-focus: 0px 0px 0px 2px #423eee,
      0px 0px 0px 1px rgba(255, 255, 255, 0.3);

    --border-color: transparent;
    --border-color-hover: transparent;
    --border-color-focus: transparent;
    --border-color-error: var(--nl-color-systemfeedback-error-icon);
    --border-color-error-hover: var(--nl-color-red-50);

    display: flex;
    flex-direction: var(--direction);
    justify-content: stretch;
    font: var(--font);
    gap: var(--gap);

    &:not([aria-disabled='true']) {
      & .container:hover {
        color: var(--color-hover);
        background: var(--background-hover);
        box-shadow: var(--shadow-hover);
        border-color: var(--border-color-hover);
      }

      & .container:has(*:focus-visible),
      &.focus .container {
        color: var(--color-focus);
        background: var(--background-focus);
        box-shadow: var(--shadow-focus);
        border-color: var(--border-color-focus);
      }

      &.error .container:hover:not(:has(*:focus-visible)) {
        border-color: var(--border-color-error-hover);
      }
    }
  }

  .nala-form-item.small {
    --nl-icon-size: 16px;
    --font: var(--nl-control-font, var(--nl-font-primary-small-regular));
    --padding: var(--nl-control-padding, 8px);
    --gap: var(--nl-control-label-gap, 2px);
  }

  .nala-form-item.large {
    --nl-icon-size: 22px;
    --padding: var(--nl-control-padding, 14px 8px);
    --gap: var(--nl-control-label-gap, 12px);
  }

  .nala-form-item.filled {
    --background: var(--nl-color-container-highlight);
    --shadow-hover: var(--nl-effect-elevation-01);
    --border-color: transparent;
    --border-color-hover: var(--nl-color-divider-subtle);
  }

  .nala-form-item.outline {
    --background: var(--light-container-background);
    --background-hover: var();
    --border-color: var(--nl-color-divider-strong);
    --border-color-hover: var(--nl-color-gray-30);
    --shadow-hover: var(--nl-effect-elevation-01);
  }

  .nala-form-item.error {
    --border-color: var(--border-color-error);
  }

  .nala-form-item .control {
    flex: 1;
  }

  .nala-form-item .container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--nl-spacing-m);

    border-radius: var(--radius);
    padding: var(--padding);

    color: var(--color);
    background: var(--background);
    box-shadow: var(--shadow);
    border: 1px solid var(--border-color);

    cursor: pointer;
  }

  .nala-form-item[aria-disabled='true'] .container {
    --background: var(--nl-color-container-disabled);
    color: var(--nl-color-text-disabled);
    cursor: not-allowed;
  }

  .nala-form-item .label-row {
    display: flex;
    flex-direction: row;
    gap: var(--nl-spacing-s);
  }

  .nala-form-item .required-indicator {
    color: var(--nl-color-systemfeedback-error-icon);
  }
</style>

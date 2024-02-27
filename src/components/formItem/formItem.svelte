<script lang="ts" context="module">
  export let sizes = ['small', 'normal', 'large'] as const
  export type Size = (typeof sizes)[number]

  export let modes = ['filled', 'outline'] as const
  export type Mode = (typeof modes)[number]

  export let cssProperties: {
    [key: `--leo-control-${string}`]: {
      description: string
      control?: string
      options?: string[]
      type?: string
    }
  } = {
    '--leo-control-label-direction': {
      description:
        'Controls how the label and control flow together. Accepts a <flex-direction>',
      control: 'select',
      options: ['column', 'column-reverse', 'row', 'row-reverse']
    },
    '--leo-control-radius': {
      description: 'The border radius of the control',
      type: 'string'
    },
    '--leo-control-padding': {
      description: 'The padding of the control',
      type: 'string'
    },
    '--leo-control-font': {
      description: 'The font used by the control',
      type: 'string'
    },
    '--leo-control-icon-size': {
      description: 'The icon size used by the control',
      type: 'string'
    },
    '--leo-control-icon-color': {
      description: 'The icon color used by the control',
      control: 'color'
    },
    '--leo-control-label-gap': {
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

  export let controlElement: HTMLDivElement = undefined
</script>

<label
  class="leo-control"
  class:isSmall={size === 'small'}
  class:isLarge={size === 'large'}
  class:isFilled={mode === 'filled'}
  class:isOutline={mode !== 'filled'}
  class:isFocused={showFocusOutline}
  class:error
  aria-disabled={disabled}
>
  <div class="label-row">
    <slot name="label" />{#if required}<span class="required-indicator">*</span>{/if}
  </div>
  <div class="control" bind:this={controlElement}>
    <div class="container">
      <div class="extra-content">
        <slot name="left-icon" />
      </div>
      <slot />
      <div class="extra-content">
        <slot name="right-icon" />
      </div>
    </div>
    <slot name="after" />
  </div>
</label>

<style lang="scss">
  .leo-control {
    --radius: var(--leo-control-radius, var(--leo-spacing-m));
    --padding: var(--leo-control-padding, 9px);
    --font: var(--leo-control-font, var(--leo-font-default-regular));
    --leo-icon-size: var(--leo-control-icon-size, 20px);
    --leo-icon-color: var(
      --leo-control-icon-color,
      var(--leo-color-icon-default)
    );
    --gap: var(--leo-control-label-gap, var(--leo-spacing-s));
    --direction: var(--leo-control-label-direction, column);

    --color: var(--leo-color-text-primary);
    --color-hover: var(--color);
    --color-focus: var(--color);

    --background: var(--leo-color-container-background);
    --background-hover: var(--background);
    --background-focus: var(--background);

    --shadow: ;
    --shadow-hover: var(--shadow);
    --shadow-focus: 0px 0px 0px 2px #423eee,
      0px 0px 0px 1px rgba(255, 255, 255, 0.3);

    --border-color: transparent;
    --border-color-hover: transparent;
    --border-color-focus: transparent;
    --border-color-error: var(--leo-color-systemfeedback-error-icon);
    --border-color-error-hover: var(--leo-color-red-50);

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
      &.isFocused .container {
        &:not(:has(.extra-content:focus-within)) {
          color: var(--color-focus);
          background: var(--background-focus);
          box-shadow: var(--shadow-focus);
          border-color: var(--border-color-focus);
        }
      }

      &.error .container:hover:not(:has(*:focus-visible)) {
        border-color: var(--border-color-error-hover);
      }
    }
  }

  .leo-control.isSmall {
    --leo-icon-size: 16px;
    --font: var(--leo-control-font, var(--leo-font-small-regular));
    --padding: var(--leo-control-padding, 8px);
    --gap: var(--leo-control-label-gap, 2px);
  }

  .leo-control.isLarge {
    --leo-icon-size: 22px;
    --padding: var(--leo-control-padding, 14px 8px);
    --gap: var(--leo-control-label-gap, 12px);
  }

  .leo-control.isFilled {
    --background: var(--leo-color-container-highlight);
    --shadow-hover: var(--leo-effect-elevation-01);
    --border-color: transparent;
    --border-color-hover: var(--leo-color-divider-subtle);
  }

  .leo-control.isOutline {
    --background: var(--leo-color-container-background);
    --background-hover: var();
    --border-color: var(--leo-color-divider-strong);
    --border-color-hover: var(--leo-color-gray-30);
    --shadow-hover: var(--leo-effect-elevation-01);
  }

  .leo-control.error {
    --border-color: var(--border-color-error);
  }

  .leo-control .control {
    flex: 1;
  }

  .leo-control .container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--leo-spacing-m);

    border-radius: var(--radius);
    padding: var(--padding);

    color: var(--color);
    background: var(--background);
    box-shadow: var(--shadow);
    border: 1px solid var(--border-color);

    cursor: pointer;
  }

  .leo-control[aria-disabled='true'] .container {
    --background: var(--leo-color-container-disabled);
    color: var(--leo-color-text-disabled);
    cursor: not-allowed;
  }

  .leo-control .label-row {
    display: flex;
    flex-direction: row;
    gap: var(--leo-spacing-s);

    &:empty {
      display: none;
    }
  }

  .leo-control .required-indicator {
    color: var(--leo-color-systemfeedback-error-icon);
  }
</style>

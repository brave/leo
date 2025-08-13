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
    '--leo-control-border-color': {
      description: 'The border color of the control',
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
    '--leo-control-color': {
      description:
        'The color of the control, which other colors are derived from',
      control: 'color'
    },
    '--leo-control-text-color': {
      description: 'The color of the text in the control',
      control: 'color'
    },
    '--leo-control-label-gap': {
      description: 'The gap between the label and the control',
      type: 'string'
    },
    '--leo-control-focus-effect': {
      description: 'The focus effect for the control',
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

  // Unfortunately, we can't conditionally render slots in Svelte, so we provide
  // a flag so the consumer can let us know if they're actually setting a label.
  export let renderLabel: boolean

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
  {#if $$slots.label && renderLabel}
    <div class="label-row">
      <slot name="label" />{#if required}<span class="required-indicator">*</span>{/if}
    </div>
  {/if}
  <div class="control" bind:this={controlElement}>
    <div class="container">
      <div class="extra-content">
        <slot name="left-icon" />
      </div>
      <div class="content">
        <slot />
      </div>
      <div class="extra-content">
        <slot name="right-icon" />
      </div>
    </div>
    <slot name="after" />
  </div>
</label>

<style lang="scss">
  .leo-control {
    --foreground: var(--leo-color-text-primary);
    --base: var(--leo-color-container-background);
    --primary: var(--leo-control-color, var(--base));

    --radius: var(--leo-control-radius, var(--leo-radius-m));
    --padding: var(--leo-control-padding, 11px var(--leo-spacing-m));
    --font: var(--leo-control-font, var(--leo-font-default-regular));
    --leo-icon-size: var(--leo-control-icon-size, 20px);
    --leo-icon-color: var(
      --leo-control-icon-color,
      var(--leo-color-icon-default)
    );
    --gap: var(--leo-control-label-gap, var(--leo-spacing-s));
    --direction: var(--leo-control-label-direction, column);

    --color: var(--leo-control-text-color, var(--leo-color-text-primary));
    --color-hover: var(--color);
    --color-focus: var(--color);

    --background: var(--primary);
    --background-hover: var(--background);
    --background-focus: var(--background);

    --shadow: ;
    --shadow-hover: var(--shadow);
    --shadow-focus: var(
      --leo-control-focus-effect,
      var(--leo-effect-focus-state)
    );

    --border-color: var(--leo-control-border-color, transparent);
    --border-color-hover: var(--leo-control-border-color, transparent);
    --border-color-focus: var(--leo-control-border-color, transparent);
    --border-color-error: var(
      --leo-control-border-color,
      var(--leo-color-systemfeedback-error-icon)
    );
    --border-color-error-hover: var(
      --leo-control-border-color,
      var(--leo-color-red-50)
    );

    display: flex;
    flex-direction: var(--direction);
    justify-content: stretch;
    font: var(--font);
    gap: var(--gap);
    transition:
      color 0.2s ease-in-out;

    .content {
      padding: 0 var(--leo-spacing-s);
      margin-inline-end: auto;
    }

    .extra-content:empty {
      display: none;
    }

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

      &.error {
        color: var(--leo-color-systemfeedback-error-icon);
      }

      &.error .container:hover:not(:has(*:focus-visible)) {
        border-color: var(--border-color-error-hover);
      }
    }
  }

  .leo-control.isSmall {
    --leo-icon-size: 16px;
    --font: var(--leo-control-font, var(--leo-font-small-regular));
    --padding: var(--leo-control-padding, var(--leo-spacing-m));
    --gap: var(--leo-control-label-gap, 2px);
  }

  .leo-control.isLarge {
    --leo-icon-size: 22px;
    --padding: var(--leo-control-padding, 14px var(--leo-spacing-l));
    --gap: var(--leo-control-label-gap, 12px);
  }

  .leo-control.isFilled {
    --background: var(--leo-color-container-highlight);
    --shadow-hover: var(--leo-effect-elevation-01);
    --border-color: transparent;
    --border-color-hover: var(--leo-color-divider-subtle);

    @supports (color: color-mix(in srgb, transparent, transparent)) {
      --background: color-mix(in srgb, var(--primary), var(--foreground) 10%);
      --border-color-hover: var(
        --leo-control-border-color,
        color-mix(in srgb, var(--primary), var(--foreground) 20%)
      );
    }
  }

  .leo-control.isOutline {
    --background: var(--primary);
    --border-color: var(
      --leo-control-border-color,
      var(--leo-color-divider-subtle)
    );
    --border-color-hover: var(
      --leo-control-border-color,
      var(--leo-color-neutral-30)
    );
    --shadow-hover: var(--leo-effect-elevation-01);

    @supports (color: color-mix(in srgb, transparent, transparent)) {
      --border-color-hover: var(
        --leo-control-border-color,
        color-mix(in srgb, var(--primary), var(--foreground) 20%)
      );
    }
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
    transition:
      box-shadow 0.2s ease-in-out,
      border-color 0.2s ease-in-out;

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
  }

  .leo-control .required-indicator {
    color: var(--leo-color-systemfeedback-error-icon);
  }
</style>

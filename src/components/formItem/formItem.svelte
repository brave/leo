<script lang="ts" context="module">
  export let sizes = ['small', 'normal', 'large'] as const
  export type Size = (typeof sizes)[number]

  export let modes = ['filled', 'outline'] as const
  export type Mode = (typeof modes)[number]
</script>

<script lang="ts">
  export let disabled = false
  export let size: Size = 'normal'

  export let required = false
  export let mode: Mode = 'outline'

  export let showFocusOutline: boolean = false
</script>

<label
  class="leo-control"
  class:small={size === 'small'}
  class:large={size === 'large'}
  class:filled={mode === 'filled'}
  class:outline={mode !== 'filled'}
  class:focus={showFocusOutline}
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
  .leo-control {
    --radius: var(--leo-control-radius, var(--leo-spacing-8));
    --background: var(
      --leo-control-background,
      var(--leo-color-container-highlight)
    );
    --padding: var(--leo-control-padding, 9px);
    --font: var(--leo-control-font, var(--leo-font-primary-default-regular));
    --leo-icon-size: 20px;
    --leo-icon-color: var(--leo-color-icon-default);
    --gap: var(--leo-control-label-gap, var(--leo-spacing-4));
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
    }
  }

  .leo-control.small {
    --leo-icon-size: 16px;
    --font: var(--leo-control-font, var(--leo-font-primary-small-regular));
    --padding: var(--leo-control-padding, 8px);
    --gap: var(--leo-control-label-gap, 2px);
  }

  .leo-control.large {
    --leo-icon-size: 22px;
    --padding: var(--leo-control-padding, 14px 8px);
    --gap: var(--leo-control-label-gap, 12px);
  }

  .leo-control.filled {
    --background: var(--leo-color-container-highlight);

    --shadow-hover: var(--leo-effect-elevation-01);

    --border-color: transparent;
    --border-color-hover: var(--leo-color-divider-subtle);
  }

  .leo-control.outline {
    --background: var(--light-container-background);
    --background-hover: var();
    --border-color: var(--leo-color-divider-strong);
    --border-color-hover: var(--leo-color-gray-30);
    --shadow-hover: var(--leo-effect-elevation-01);
  }

  .leo-control .control {
    flex: 1;
  }

  .leo-control .container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--leo-spacing-8);

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
    gap: var(--leo-spacing-4);
  }

  .leo-control .required-indicator {
    color: var(--leo-color-systemfeedback-error-icon);
  }
</style>

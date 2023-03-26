<script lang="ts" context="module">
  export const types = ['info', 'warning', 'error', 'success'] as const
  export type AlertType = (typeof types)[number]

  export const modes = ['toast', 'callout'] as const
  export type AlertMode = (typeof modes)[number]

  const defaultIcons: { [P in AlertType]: string } = {
    'info': 'info-filled',
    'error': 'warning-circle-filled',
    'warning': 'warning-triangle-filled',
    'success': 'check-circle-filled'
  }
</script>

<script lang="ts">
  import Icon from '../icon/icon.svelte'

  export let type: AlertType = 'error'
  export let mode: AlertMode = 'toast'

  $: currentType = type ?? 'error'
  $: currentMode = mode ?? 'toast'
</script>

<div
  class="leo-alert"
  class:toast={currentMode === 'toast'}
  class:callout={currentMode === 'callout'}
  style:--default-background={`var(--leo-color-systemfeedback-${currentType}-background)`}
  style:--default-icon-color={`var(--leo-color-systemfeedback-${currentType}-icon)`}
>
  <div class="icon">
    <slot name="icon">
      <Icon name={defaultIcons[currentType]} />
    </slot>
  </div>
  <div class="content">
    <div class="title">
      {#if mode == 'callout'}
        <slot name="title" />
      {/if}
    </div>
    <slot />
  </div>
  <div class="actions">
    <slot name="actions" />
  </div>
</div>

<style lang="scss">
  .leo-alert .actions > *,
  .leo-alert .actions ::slotted(*) {
      display: flex;
      flex-direction: row;
      gap: var(--leo-spacing-16);
  }
  .leo-alert {

    --leo-icon-color: var(--leo-alert-icon-color, var(--default-icon-color));
    background-color: var(
      --leo-alert-background-color,
      var(--default-background)
    );
    display: flex;
    color: var(--leo-color-text-primary);
    padding: var(--leo-spacing-16);
    border-radius: var(--leo-radius-8);
    gap: var(--leo-spacing-16);
    font: var(--leo-font-primary-default-regular);

    & .icon {
      color: var(--leo-icon-color);
    }

    & .title {
      font: var(--leo-font-heading-h4);
    }
  }

  .leo-alert.toast {
    --leo-icon-size: 16px;

    display: flex;
    flex-direction: row;
    align-items: center;
    & .content {
      flex: 1;
    }
  }

  .leo-alert.callout {
    --leo-icon-size: 26px;
    display: grid;
    grid-template-columns: min-content auto;
    grid-template-rows: auto min-content;

    & .content {
      grid-column: 2;
    }

    & .actions {
      grid-column: 2;
    }
  }
</style>

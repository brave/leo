<script lang="ts" context="module">
  export const types = ['info', 'warning', 'error', 'success'] as const
  export type AlertType = (typeof types)[number]

  export const modes = ['simple', 'full'] as const
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
  export let mode: AlertMode = 'simple'
  export let isToast = false

  $: currentType = type ?? 'error'
  $: currentMode = mode ?? 'simple'
</script>

<div
  class="nala-alert {currentType}"
  class:toast={isToast}
  class:simple={currentMode === 'simple'}
  class:full={currentMode === 'full'}
  style:--default-background={`var(--nl-color-systemfeedback-${currentType}-background)`}
  style:--default-icon-color={`var(--nl-color-systemfeedback-${currentType}-icon)`}
>
  <div class="icon">
    <slot name="icon">
      <Icon name={defaultIcons[currentType]} />
    </slot>
  </div>
  <div class="content">
    <div class="title">
      {#if mode == 'full'}
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
  :host {
    display: block;
  }

  :global .nala-alert .actions > *,
  .nala-alert .actions ::slotted(*) {
    display: flex;
    flex-direction: row;
    gap: var(--nl-spacing-xl);
  }
  .nala-alert {
    --nl-icon-color: var(--nl-alert-icon-color, var(--default-icon-color));
    background-color: var(
      --nl-alert-background-color,
      var(--default-background)
    );
    display: flex;
    color: var(--nl-color-text-primary);
    padding: var(--nl-spacing-xl);
    border-radius: var(--nl-radius-m);
    gap: var(--nl-spacing-xl);
    font: var(--nl-font-primary-default-regular);

    & .icon {
      color: var(--nl-icon-color);
    }

    & .title {
      font: var(--nl-font-primary-heading-h4);
    }
  }

  .nala-alert.toast {
    &.error {
      background-color: var(--nl-color-red-20);
    }

    &.warning {
      background: var(--nl-color-yellow-20);
    }

    &.info {
      background: var(--nl-color-blue-20);
    }

    &.success {
      background: var(--nl-color-green-20);
    }
  }

  .nala-alert.simple {
    --nl-icon-size: 16px;

    display: flex;
    flex-direction: row;
    align-items: center;
    & .content {
      flex: 1;
    }
  }

  .nala-alert.full {
    --nl-icon-size: 26px;
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

<script lang="ts" context="module">
  import type { IconName } from '@brave/leo/icons/meta'

  export const types = ['info', 'warning', 'error', 'success', 'notice'] as const
  export type AlertType = (typeof types)[number]

  export const modes = ['simple', 'full'] as const
  export type AlertMode = (typeof modes)[number]

  const defaultIcons: { [P in AlertType]: IconName } = {
    'info': 'info-filled',
    'error': 'warning-circle-filled',
    'warning': 'warning-triangle-filled',
    'success': 'check-circle-filled',
    'notice': 'info-outline'
  }
</script>

<script lang="ts">
  import Icon from '../icon/icon.svelte'

  export let type: AlertType = 'error'
  export let mode: AlertMode = 'simple'
  export let isToast = false
  export let hasActions = $$slots.actions
  export let hasContentAfter = $$slots['content-after']
  export let hasTitle = $$slots.title
  export let hideIcon = false

  $: currentType = type ?? 'error'
  $: currentMode = hasTitle ? 'full' : mode ?? 'simple'
</script>

<div
  class="leo-alert {currentType}"
  class:toast={isToast}
  class:simple={currentMode === 'simple'}
  class:full={currentMode === 'full'}
>
  {#if !hideIcon}
  <div class="icon">
    <slot name="icon">
      <Icon name={defaultIcons[currentType]} />
    </slot>
  </div>
  {/if}
  <div class="content">
    {#if hasTitle && $$slots.title}
      <div class="title">
        <slot name="title" />
      </div>
    {/if}
    <slot />
  </div>
  {#if hasContentAfter && $$slots['content-after']}
    <div class="content-after">
      <slot name="content-after" />
    </div>
  {/if}
  {#if hasActions && $$slots.actions}
    <div class="actions">
      <slot name="actions" />
    </div>
  {/if}
</div>

<style lang="scss">
  :host {
    display: block;
  }

  :global .leo-alert .actions > *,
  .leo-alert .actions ::slotted(*) {
    display: flex;
    flex-direction: row;
    gap: var(--leo-spacing-s);
  }
  .leo-alert {
    --leo-icon-color: var(--leo-alert-icon-color, var(--default-icon-color));
    background-color: var(
      --leo-alert-background-color,
      var(--default-background)
    );
    color: var(--default-text-color, var(--leo-color-text-primary));
    padding: var(--leo-alert-padding, var(--leo-spacing-xl));
    border-radius: var(--leo-radius-m);
    border: var(--leo-alert-border-width, var(--default-border-width)) solid
      var(--leo-alert-border-color, var(--default-border-color));
    gap: var(--leo-spacing-xl) 0;
    font: var(--default-font, var(--leo-font-default-regular));

    display: grid;
    grid-template-columns: min-content 1fr;

    &.notice {
      --default-background: transparent;
      --default-icon-color: var(--leo-color-text-tertiary);
      --default-text-color: var(--leo-alert-text-color, var(--leo-color-text-tertiary));
      --default-border-width: 1px;
      --default-border-color: var(--leo-color-divider-subtle);
      --default-title-font: var(--leo-font-default-semibold);
      --default-font: var(--leo-font-small-regular);
    }
    &.success {
      --default-background: var(--leo-color-systemfeedback-success-background);
      --default-icon-color: var(--leo-color-systemfeedback-success-icon);
      --default-text-color: var(--leo-color-systemfeedback-success-text);
    }
    &.info {
      --default-background: var(--leo-color-systemfeedback-info-background);
      --default-icon-color: var(--leo-color-systemfeedback-info-icon);
      --default-text-color: var(--leo-color-systemfeedback-info-text);
    }
    &.error {
      --default-background: var(--leo-color-systemfeedback-error-background);
      --default-icon-color: var(--leo-color-systemfeedback-error-icon);
      --default-text-color: var(--leo-color-systemfeedback-error-text);
    }
    &.warning {
      --default-background: var(--leo-color-systemfeedback-warning-background);
      --default-icon-color: var(--leo-color-systemfeedback-warning-icon);
      --default-text-color: var(--leo-color-systemfeedback-warning-text);
    }

    &:has(.content-after) {
      grid-template-columns: min-content 1fr auto;
    }

    & .icon {
      --leo-icon-size: var(--leo-icon-m);

      color: var(--leo-icon-color);
      margin-right: var(--leo-spacing-xl);
    }
    &.notice .icon {
      --leo-icon-size: var(--leo-icon-s);
      margin-right: var(--leo-spacing-l);
    }

    & .title {
      font: var(--default-title-font, var(--leo-font-heading-h4));
    }

    & .content {
      grid-column: 2;
      align-content: center;
    }

    & .content-after {
      grid-column: 3;
      margin-left: var(--leo-spacing-xl);
    }

    & .actions {
      grid-column: 2;
    }
  }

  .leo-alert.toast {
    &.error {
      background-color: var(--leo-color-red-20);
    }

    &.warning {
      background: var(--leo-color-yellow-20);
    }

    &.info {
      background: var(--leo-color-blue-20);
    }

    &.success {
      background: var(--leo-color-green-20);
    }
  }

  .leo-alert.full .icon {
    --leo-icon-size: var(--leo-icon-xl);
  }
  .leo-alert.notice.full .icon {
    --leo-icon-size: var(--leo-icon-l);
  }
</style>

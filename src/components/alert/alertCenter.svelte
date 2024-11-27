<script lang="ts" context="module">
  import type { AlertType } from './alert.svelte'
  import { writable } from 'svelte/store'

  /**
   * This is a workaround for TS since we don't know what props Action may have.
   * Additionally, Button has two generic type params, which also seems to
   * contribute to the TS error.
   */
  const ButtonComponent: ComponentType<SvelteComponent> = Button;

  type Action = {
    kind?: ButtonKind
    isDisabled?: boolean,
    isLoading?: boolean,
    component?: ComponentType<SvelteComponent>,
    action: (alert: AlertInfo) => void
  } & ({
    text: string
    icon?: IconName
  } | {
    icon: IconName
    text?: string
  })

  export interface AlertOptions {
    type: AlertType
    content: string
    title?: string
    icon?: IconName
    component?: ComponentType<SvelteComponent>
    actions: Action[]
  }

  let nextId = 0
  class AlertInfo {
    id = ++nextId

    type: AlertType
    content: string
    title?: string
    icon?: IconName
    component?: ComponentType<SvelteComponent>
    actions: Action[] = []

    duration?: number
    canDismiss?: boolean
    #timeout: NodeJS.Timeout

    constructor(options: AlertOptions, duration?: number, canDismiss?: boolean) {
      Object.assign(this, options)
      this.actions = this.actions ?? []

      this.duration = duration
      this.canDismiss = canDismiss
      this.resumeDismiss()
    }

    pauseDismiss() {
      clearTimeout(this.#timeout)
    }

    resumeDismiss() {
      if (!this.duration) return
      this.#timeout = setTimeout(() => this.dismiss(), this.duration)
    }

    dismiss() {
      alerts.update((a) => a.filter((a) => a !== this))
    }

    updateAlert(update: Partial<AlertOptions>) {
      Object.assign(this, update)

      // Trigger a rerender
      alerts.update(a => [...a])
    }
  }

  const alerts = writable<AlertInfo[]>([])

  export const showAlert = (options: AlertOptions, duration = 2000, canDismiss = true) => {
    const info = new AlertInfo(options, duration, canDismiss)
    alerts.update((a) => [...a, info])
    return info
  }

  const transitionOptions = { y: -64, duration: 120 }
</script>

<script lang="ts">
  import Alert from './alert.svelte'
  import Button from '../button/button.svelte'
  import type { ButtonKind } from '../button/props'
  import { fly } from 'svelte/transition'
  import type { ComponentType, SvelteComponent } from 'svelte'
  import type { IconName } from '../../../icons/meta'
  import Icon from '../icon/icon.svelte'

  export let position: `${'top' | 'bottom'}-${'left' | 'right' | 'center'}` =
    'top-center'
  $: style = `${position.includes('right') ? 'right' : 'left'}: ${
    position.includes('center') ? 'calc(50% - (var(--width) / 2))' : '0'
  }; ${position.includes('top') ? 'top' : 'bottom'}: 0`
</script>

<div class="leo-alert-center" {style}>
  {#each $alerts as alert (alert.id)}
    <div
      class="alert-container"
      transition:fly={transitionOptions}
      on:mouseenter={() => alert.pauseDismiss()}
      on:mouseleave={() => alert.resumeDismiss()}
    >
      <svelte:component this={alert.component || Alert} {...alert} hasActions={alert.actions.length > 0} hasContentAfter={alert.canDismiss} isToast>
        <div slot="title">
          {alert.title}
        </div>
        <svelte:fragment slot='content-after'>
          {#if alert.canDismiss}
            <Button kind="plain-faint" fab onClick={() => alert.dismiss()}>
              <Icon name="close" />
            </Button>
          {/if}
        </svelte:fragment>
        {alert.content}
        <div slot="actions">
          {#each alert.actions as action}
            <svelte:component
              this={action.component || ButtonComponent}
              size="small"
              fab={action.icon && !action.text}
              kind={action.kind || 'filled'}
              onClick={() => action.action(alert)}
              {...action}
            >
              {#if action.icon && !action.text}
                <Icon name={action.icon} />
              {:else}
                {action.text}
              {/if}
              <div slot="icon-after" hidden={!action.text || !action.icon}>
                <Icon name={action.icon} />
              </div>
            </svelte:component>
          {/each}
        </div>
      </svelte:component>
    </div>
  {/each}
</div>

<style lang="scss">
  .leo-alert-center {
    --width: var(--leo-alert-center-width, min(540px, 100vw));
    z-index: var(--leo-alert-center-z-index, 1000);
    position: var(--leo-alert-center-position, fixed);
    width: var(--width);

    padding: var(--leo-spacing-m);

    display: flex;
    flex-direction: column;
    gap: var(--leo-spacing-m);
  }
</style>

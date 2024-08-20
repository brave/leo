<script lang="ts" context="module">
  import { writable } from 'svelte/store'
  import type { AlertMode, AlertType } from './alert.svelte'

  const actionDelayProgress = writable(new Map())
  const actionDelayText = writable(new Map())

  type Action = {
    kind?: ButtonKind
    action: (alert: AlertInfo) => void
    delay?: number
    delayCb?: (timeElapsed: number, setText: (text: string) => void) => void
  } & ({
    text: string
    icon?: IconName
  } | {
    icon: IconName
    text?: string
  })

  export interface AlertOptions {
    mode: AlertMode
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

    mode: AlertMode
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

      this.actions.forEach((action) => {
        if (action.delay) {
          actionDelayProgress.update((states) => {
            states.set(action.action, 0)
            return states
          })

          actionDelayText.update((states) => {
            states.set(action.action, action.text)
            return states
          })

          let start: number
          function incrementProgress(timeStamp) {
            if (start === undefined) {
              start = timeStamp
            }

            const elapsed = timeStamp - start
            const progress = (1 / action.delay) * elapsed

            actionDelayProgress.update((states) => {
              states.set(action.action, progress)
              return states
            })

            action.delayCb(elapsed, (text) => {
              actionDelayText.update((states) => {
                states.set(action.action, text)
                return states
              })
            })

            if (elapsed < action.delay) {
              requestAnimationFrame(incrementProgress)
            }
          }
          requestAnimationFrame(incrementProgress)
        }
      })
    }

    pauseDismiss() {
      clearTimeout(this.#timeout)
    }

    resumeDismiss() {
      if (!this.duration || this.actions.length) return
      this.#timeout = setTimeout(() => this.dismiss(), this.duration)
    }

    dismiss() {
      alerts.update((a) => a.filter((a) => a !== this))
    }
  }

  const alerts = writable<AlertInfo[]>([])

  export const showAlert = (options: AlertOptions, duration = 2000, canDismiss = true) => {
    alerts.update((a) => [...a, new AlertInfo(options, duration, canDismiss)])
  }

  const transitionOptions = { y: -64, duration: 120 }
</script>

<script lang="ts">
  import type { ComponentType, SvelteComponent } from 'svelte'
  import { fly } from 'svelte/transition'
  import type { IconName } from '../../../icons/meta'
  import Button from '../button/button.svelte'
  import type { ButtonKind } from '../button/props'
  import Icon from '../icon/icon.svelte'
  import ProgressRing from '../progress/progressRing.svelte'
  import Alert from './alert.svelte'

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
            {@const delayProgress = $actionDelayProgress.get(action.action)}
            {@const isDelayed = delayProgress < 1}
            {@const text =
              (isDelayed && $actionDelayText.get(action.action)) || action.text}
            <Button
              size={alert.mode === "full" ? "medium" : "small"}
              fab={action.icon && !action.text}
              kind={action.kind || 'filled'}
              onClick={() => action.action(alert)}
              isDisabled={action.delay && isDelayed}
            >
              {#if action.icon && !action.text}
                <Icon name={action.icon} />
              {:else}
                {text}
              {/if}
              <div slot="icon-after" hidden={!action.delay && (!action.text || !action.icon)}>
                {#if action.delay && isDelayed}
                  <ProgressRing mode="determinate" progress={delayProgress} />
                {:else if action.icon}
                  <Icon name={action.icon} />
                {/if}
              </div>
            </Button>
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

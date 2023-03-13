<svelte:options tag="leo-alertcentre" />

<script lang="ts" context="module">
  import type { AlertMode, AlertType } from './alert.svelte'
  import { writable } from 'svelte/store'

  type Action = {
    kind?: ButtonKind
    text: string
    action: (alert: AlertInfo) => void
  }

  interface AlertOptions {
    mode: AlertMode
    type: AlertType
    content: string
    title?: string
    icon?: string
    actions: Action[]
  }

  let nextId = 0
  class AlertInfo {
    id = ++nextId

    mode: AlertMode
    type: AlertType
    content: string
    title?: string
    icons?: string
    actions: Action[] = []

    duration?: number
    #timeout: NodeJS.Timeout

    constructor(options: AlertOptions, duration?: number) {
      Object.assign(this, options)
      this.actions = this.actions ?? []

      this.duration = duration
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
  }

  const alerts = writable<AlertInfo[]>([])

  export const showAlert = (options: AlertOptions, duration = 2000) => {
    alerts.update((a) => [...a, new AlertInfo(options, duration)])
  }
</script>

<script lang="ts">
  import portal from '../../actions/portal'
  import Alert from './alert.svelte'
  import Icon from '../icon/icon.svelte'
  import Button from '../button/button.svelte'
  import type { ButtonKind } from '../button/props'
  import { fade } from 'svelte/transition'

  export let position: `${'top' | 'bottom'}-${'left' | 'right' | 'centre'}` =
    'top-centre'
  $: style = `${position.includes('right') ? 'right' : 'left'}: ${
    position.includes('centre') ? 'calc(50% - (var(--width) / 2))' : '0'
  }; ${position.includes('top') ? 'top' : 'bottom'}: 0`
</script>

<div class="leo-alert-centre" {style} use:portal>
  {#each $alerts as alert (alert.id)}
    <div
      class="alert-container"
      transition:fade
      on:mouseenter={() => alert.pauseDismiss()}
      on:mouseleave={() => alert.resumeDismiss()}
    >
      <Alert mode={alert.mode} type={alert.type}>
        <div slot="title">
          {alert.title}
        </div>
        {alert.content}
        <div slot="actions">
          {#each alert.actions as action}
            <Button
              kind={action.kind ?? 'primary'}
              on:click={() => action.action(alert)}>{action.text}</Button
            >
          {/each}
        </div>
      </Alert>
    </div>
  {/each}
</div>

<style lang="scss">
  .leo-alert-centre {
    --width: min(540px, 100vw);
    position: absolute;
    width: var(--width);

    padding: var(--leo-spacing-8);

    display: flex;
    flex-direction: column;
    gap: var(--leo-spacing-8);
  }
</style>

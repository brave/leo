<svelte:options tag="leo-alert-centre" />

<script lang="ts" context="module">
  import type { AlertMode, AlertType } from './alert.svelte'
  import { writable } from 'svelte/store'

  type Action = {
    kind: ButtonKind
    text: string
    action: () => void
  }

  type AlertInfo = {
    mode: AlertMode
    type: AlertType
    content: string
    title?: string
    icon?: string
    actions: Action[]
  }

  const alerts = writable<AlertInfo[]>([])

  export const showAlert = (
    options: Omit<AlertInfo, 'actions'> & { actions?: Action[] },
    duration = 2000
  ) => {
    const info = { actions: [], ...options }
    alerts.update((a) => [...a, info])
    if (duration !== 0)
      setTimeout(
        () => alerts.update((a) => a.filter((a) => a !== info)),
        duration
      )
  }
</script>

<script lang="ts">
  import portal from '../../actions/portal'
  import Alert from './alert.svelte'
  import Icon from '../icon/icon.svelte'
  import Button from '../button/button.svelte'
  import type { ButtonKind } from '../button/props'

  export let position: `${'top' | 'bottom'}-${'left' | 'right' | 'centre'}` =
    'top-centre'
</script>

<div class="leo-alert-centre" use:portal>
  {#each $alerts as alert}
    <div class="alert-container">
      <Alert mode={alert.mode} type={alert.type}>
        <div slot="title">
          {alert.title}
        </div>
        {alert.content}
        <div slot="actions">
          {#each alert.actions as action}
            <Button kind={action.kind} on:click={action.action}
              >{action.text}</Button
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
    position: fixed;
    width: var(--width);

    top: 0;
    left: calc(50% - (var(--width) / 2));

    display: flex;
    flex-direction: column;
    gap: var(--leo-spacing-8);
  }
</style>

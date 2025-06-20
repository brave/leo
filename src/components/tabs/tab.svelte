<script lang="ts">
  import { getContext, onMount } from 'svelte'
  import { writable, type Writable } from 'svelte/store'
  import type { TabSize } from './props'

  const activeTab = getContext<Writable<number>>('activeTab')
  const tabs = getContext<{ add: (tab: any) => number, registerElement: (index: number, element: HTMLElement) => void }>('tabs')
  const size = getContext<TabSize>('size')

  const index = tabs.add(writable(null))

  let buttonEl: HTMLButtonElement
  onMount(() => {
    tabs.registerElement(index, buttonEl)
  })

  $: isActive = $activeTab === index

  function onClick() {
    activeTab.set(index)
  }
</script>

<button
  bind:this={buttonEl}
  class="tab"
  class:active={isActive}
  class:medium={size === 'medium'}
  class:small={size === 'small'}
  role="tab"
  aria-selected={isActive}
  on:click={onClick}
>
  <slot name="icon-before" />
  <slot />
  <slot name="icon-after" />
</button>

<style lang="scss">
    .tab {
        --leo-icon-size: var(--leo-icon-size-m);
        display: flex;
        align-items: center;
        gap: var(--leo-spacing-m);
        padding: var(--leo-spacing-l) var(--leo-spacing-m);
        cursor: pointer;
        border: none;
        background: none;
        color: var(--leo-color-text-secondary);
        font: var(--leo-font-components-button-large);
        position: relative;
        transition: color 0.2s ease-in-out;

        &.active {
            color: var(--leo-color-text-interactive);
            --leo-icon-color: var(--leo-color-icon-interactive);
        }

        &:not(.active):hover {
            color: var(--leo-color-text-interactive);
            --leo-icon-color: var(--leo-color-icon-interactive);
        }

        &.active:hover {
            color: var(--leo-color-blurple-60);
            --leo-icon-color: var(--leo-color-blurple-60);
        }

        &.medium {
            font: var(--leo-font-components-button-default);
            padding: var(--leo-spacing-m) var(--leo-spacing-l);
            --leo-icon-size: var(--leo-icon-size-m);
        }

        &.small {
            font: var(--leo-font-components-button-small);
            padding: var(--leo-spacing-m);
            --leo-icon-size: var(--leo-icon-size-s);
        }
    }
</style> 
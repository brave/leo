<script lang="ts">
  import { setContext } from 'svelte'
  import { writable, type Writable } from 'svelte/store'
  import type { TabSize } from './props'

  export let size: TabSize = 'large'

  const activeTab = writable(0)
  const tabs = writable([])
  const panels = writable([])
  const tabElements = writable<HTMLElement[]>([])

  setContext('activeTab', activeTab)
  setContext('tabs', {
    subscribe: tabs.subscribe,
    add: (tab: Writable<any>) => {
      let index
      tabs.update(items => {
        index = items.length
        if (items.length === 0) {
          activeTab.set(0)
        }
        return [...items, tab]
      })
      return index
    },
    registerElement: (index: number, element: HTMLElement) => {
      tabElements.update(elements => {
        elements[index] = element
        return elements
      })
    },
  })
  setContext('panels', {
    subscribe: panels.subscribe,
    add: (panel: Writable<any>) => {
      let index
      panels.update(items => {
        index = items.length
        return [...items, panel]
      })
      return index
    },
  })
  setContext('size', size)

  let underlineStyle = ''
  $: if ($tabElements[$activeTab]) {
    const element = $tabElements[$activeTab]
    underlineStyle = `left: ${element.offsetLeft}px; width: ${element.offsetWidth}px;`
  }
</script>

<div class="tabs-container" class:medium={size === 'medium'} class:small={size === 'small'}>
  <div class="tabs" role="tablist">
    <slot name="tabs" />
    <div class="underline" style={underlineStyle} />
  </div>
  <div class="tab-panels">
    <slot name="tab-panels" />
  </div>
</div>

<style lang="scss">
  .tabs-container {
    --indicator-color: var(--leo-color-text-interactive);
    --indicator-height: 4px;

    &.medium,
    &.small {
      --indicator-height: 3px;
    }
  }

  .tabs {
    position: relative;
    border-bottom: 1px solid var(--leo-color-divider-subtle);
  }

  .tabs > :global(div) {
      display: flex;
      flex-wrap: nowrap;
      overflow-x: auto;
  }

  .underline {
    position: absolute;
    bottom: -1px;
    height: var(--indicator-height);
    background-color: var(--indicator-color);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 3px 3px 0 0;
  }
</style> 
<script lang="ts">
  import { getContext } from 'svelte'
  import { writable, type Writable } from 'svelte/store'

  const activeTab = getContext<Writable<number>>('activeTab')
  const panels = getContext<{ add: (panel: any) => number }>('panels')

  const index = panels.add(writable(null))

  $: isActive = $activeTab === index
</script>

{#if isActive}
  <div class="tab-panel" role="tabpanel">
    <slot />
  </div>
{/if}

<style lang="scss">
    .tab-panel {
        padding: var(--leo-spacing-l);
    }
</style> 
<script lang="ts">
  import { onMount } from 'svelte'
  import type { TabSize } from './props'

  export let value: string | undefined = undefined
  export let size: TabSize = 'large'

  export let onChange: (detail: { value: string | undefined }) => void =
    undefined

  let tabsContainer: HTMLDivElement

  let underlineWidth: number
  let underlinePosition: number

  function getValue(e: Element) {
    // If the tab element doesn't have a value, fallback to using the text
    // content - this allows writing simplified tabs:
    // i.e. <TabItem>Home</TabItem>
    return e.getAttribute('value') ?? e['value'] ?? e.textContent
  }

  $: tabItems = Array.from(
    (tabsContainer?.querySelector('slot') as HTMLSlotElement)
      ?.assignedElements()
      ?.filter((element) => element.tagName === 'LEO-TABITEM') ??
      tabsContainer?.querySelectorAll('.leo-tab-item') ??
      []
  ) as HTMLElement[]

  function setUnderline(item: HTMLElement) {
    underlineWidth = item.getBoundingClientRect().width
    underlinePosition = item.offsetLeft
  }

  const itemResizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      setUnderline(entry.target as HTMLElement)
    }
  })

  $: {
    for (const tabItem of tabItems) {
      tabItem.setAttribute('role', 'tab')

      if (value === getValue(tabItem)) {
        tabItem.setAttribute('aria-selected', 'true')
        itemResizeObserver.observe(tabItem)
      } else {
        tabItem.setAttribute('aria-selected', 'false')
        itemResizeObserver.unobserve(tabItem)
      }
    }
  }

  function selectItem(e: Event) {
    // Find the tab which was clicked on, if any.
    const item = tabItems.find((item) => e.composedPath().includes(item))

    // If the event was triggered for something which isn't a tab don't fire
    // a change event.
    if (!item) return

    value = getValue(item)

    onChange?.({ value })
  }

  let underline: HTMLDivElement

  onMount(() => {
    underline.addEventListener('transitionstart', () => {
      tabsContainer.classList.add('transitioning')
    })

    underline.addEventListener('transitionend', () => {
      tabsContainer.classList.remove('transitioning')
    })
  })
</script>

<div
  bind:this={tabsContainer}
  class="leo-tabs size-{size}"
  role="tablist"
  tabindex="-1"
  on:keypress={(e) => {
    if (e.code !== 'Enter' && e.code !== 'Space') return
    selectItem(e)
  }}
  on:click={selectItem}
>
  <div
    class="underline"
    style:width={`${underlineWidth}px`}
    style:left={`${underlinePosition}px`}
    bind:this={underline}
  />
  <slot />
</div>

<style lang="scss">
  :host {
    display: flex;
    position: relative;
    width: var(--leo-tabs-width, 100%);

    & .leo-tabs {
        width: 100%;
    }
  }

  .leo-tabs {
    --leo-icon-size: var(--leo-icon-size-m);
    --indicator-color: var(--leo-color-text-interactive);
    --indicator-height: 4px;

    --leo-tab-item-padding: 20px var(--leo-spacing-l);
    --leo-tab-item-icon-gap: var(--leo-spacing-m);
    --leo-tab-item-font: var(--leo-font-components-button-large);

    display: flex;
    position: relative;
    border-bottom: 1px solid var(--leo-color-divider-subtle);

    &.size-medium {
      --indicator-height: 3px;
      --leo-tab-item-padding: var(--leo-spacing-xl) var(--leo-spacing-l);
      --leo-tab-item-font: var(--leo-font-components-button-default);
    }

    &.size-small {
      --leo-icon-size: var(--leo-icon-size-s);
      --indicator-height: 3px;
      --leo-tab-item-padding: var(--leo-spacing-l) var(--leo-spacing-m);
      --leo-tab-item-font: var(--leo-font-components-button-small);
    }

    .underline {
      position: absolute;
      bottom: 0;
      height: var(--indicator-height);
      background-color: var(--indicator-color);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 3px 3px 0 0;
    }

    :where(&) > :global(.leo-tab-item),
    :where(&) > :global(::slotted(leo-tabitem)) {
      --leo-tab-item-icon-color: var(--leo-color-icon-default);
      --leo-tab-item-color: var(--leo-color-text-secondary);
      --leo-tab-item-background: transparent;
    }

    :where(&:not(.transitioning)) > :global(.leo-tab-item:hover),
    :where(&:not(.transitioning)) > :global(::slotted(leo-tabitem:hover)) {
      --leo-tab-item-color: var(--leo-color-text-interactive);
      --leo-tab-item-icon-color: var(--leo-color-icon-interactive);
    }

    :where(&) > :global(.leo-tab-item:focus-visible),
    :where(&) > :global(::slotted(leo-tabitem:focus-visible)) {
      --leo-tab-item-shadow: var(--leo-effect-focus-state);
    }

    :where(&) > :global(.leo-tab-item[aria-selected="true"]),
    :where(&) > :global(::slotted(leo-tabitem[aria-selected="true"])) {
      --leo-tab-item-color: var(--leo-color-text-interactive);
      --leo-tab-item-icon-color: var(--leo-color-icon-interactive);
    }

    :where(&) > :global(.leo-tab-item[aria-selected="true"]:hover),
    :where(&) > :global(::slotted(leo-tabitem[aria-selected="true"]:hover)) {
      --leo-tab-item-color: var(--leo-color-blurple-60);
      --leo-tab-item-icon-color: var(--leo-color-blurple-60);
    }
  }
</style>
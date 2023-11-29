<script lang="ts" context="module">
  export const segmentedControlSizes = ['default', 'small', 'tiny'] as const
  type Size = (typeof segmentedControlSizes)[number]
</script>

<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'

  export let value: string | undefined = undefined
  export let size: Size = 'default'

  let segmentedControl: HTMLDivElement

  let pillWidth: number
  let pillPosition: number

  const dispatch = createEventDispatcher<{
    'change': { value: string | undefined }
  }>()

  function getValue(e: Element) {
    // If the option element doesn't have a value, fallback to using the text
    // content - this allows writing simplified options:
    // i.e. <o>1</o>
    return e.getAttribute('value') ?? e['value'] ?? e.textContent
  }

  $: controlItems = Array.from(
    segmentedControl?.querySelectorAll('.leo-control-item') ?? []
  ) as HTMLElement[]

  $: {
    for (const controlItem of controlItems) {
      controlItem.setAttribute('role', 'option')

      if (value === getValue(controlItem)) {
        controlItem.setAttribute('aria-selected', '')
        pillWidth = controlItem.getBoundingClientRect().width
        console.log(pillWidth)

        pillPosition = controlItem.offsetLeft
      } else controlItem.removeAttribute('aria-selected')
    }
  }

  function selectItem(e: Event) {
    // Find the option which was clicked on, if any.
    const item = controlItems.find((item) => e.composedPath().includes(item))

    // If the event was triggered for something which isn't an option don't fire
    // a change event.
    if (!item) return

    value = getValue(item)

    dispatch('change', { value })
  }

  let pill: HTMLDivElement

  onMount(() => {
    pill.addEventListener('transitionstart', () => {
      segmentedControl.classList.add('transitioning')
    })

    pill.addEventListener('transitionend', () => {
      segmentedControl.classList.remove('transitioning')
    })
  })
</script>

<div
  bind:this={segmentedControl}
  class="leo-segmented-control size-{size}"
  role="listbox"
  tabindex="-1"
  on:keypress={(e) => {
    if (e.code !== 'Enter' && e.code !== 'Space') return
    selectItem(e)
  }}
  on:click={selectItem}
>
  <div
    class="pill"
    style:width={`${pillWidth}px`}
    style:left={`${pillPosition}px`}
    bind:this={pill}
  />
  <slot />
</div>

<style lang="scss">
  .leo-segmented-control {
    --leo-icon-size: var(--leo-icon-m);
    --bg: var(--leo-color-container-highlight);
    --control-padding: var(--leo-spacing-s);
    --leo-control-item-padding: var(--leo-spacing-xl);
    --leo-control-item-icon-gap: var(--leo-spacing-m);
    --gap: var(--leo-spacing-s);
    --control-height: 48px;

    display: flex;
    max-width: max-content;
    align-items: center;
    position: relative;

    background: var(--leo-segmented-control-bg, var(--bg));
    padding: var(--control-padding);
    gap: var(--leo-segmented-control-gap, var(--gap));
    height: var(--leo-segmented-control-height, var(--control-height));
    border-radius: var(--leo-segmented-control-height, var(--control-height));

    &.size-small {
      --leo-icon-size: var(--leo-icon-s);
      --control-height: 40px;
      --leo-control-item-padding: var(--leo-spacing-l);
    }

    &.size-tiny {
      --leo-icon-size: var(--leo-icon-xs);
      --control-padding: var(--leo-spacing-xs);
      --gap: var(--leo-spacing-xs);
      --control-height: 28px;
      --leo-control-item-padding: var(--leo-spacing-m);
    }

    .pill {
      background: var(--leo-color-container-background);
      position: absolute;
      height: calc(100% - (var(--control-padding) * 2));
      min-width: var(--control-height);
      border-radius: calc(var(--control-height) - var(--control-padding));
      transition:
        width 0.2s cubic-bezier(0.22, 1, 0.36, 1),
        left 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    }

    :where(&) > :global .leo-control-item {
      --leo-icon-color: var(--leo-color-icon-default);
      --leo-control-item-color: var(--leo-color-text-secondary);
      --leo-control-item-background: transparent;
    }

    :where(&:not(.transitioning)) > :global .leo-control-item:hover {
      --leo-control-item-background: var(--leo-color-page-background);
      --leo-control-item-color: var(--leo-color-text-primary);
      --leo-control-item-shadow: var(--leo-effect-elevation-01);
    }

    :where(&) > :global .leo-control-item:focus-visible {
      --leo-control-item-shadow: var(--leo-effect-focus-state);
    }

    :where(&) > :global .leo-control-item[aria-selected] {
      --leo-control-item-color: var(--leo-color-text-primary);
    }

    :where(&.transitioning) > :global .leo-control-item[aria-selected],
    :where(&) > :global .leo-control-item[aria-selected]:hover {
      --leo-icon-color: currentColor;
      --leo-control-item-background: var(--leo-color-container-background);
    }
  }
</style>

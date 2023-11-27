<script context="module" lang="ts">
  declare global {
    namespace JSX {
      interface IntrinsicElements {
        'leo-segmented-item': HTMLAttributes<HTMLElement> & {
          // Note: This should line up with Reacts key type, but we don't want
          // to depend on React in this layer, so we just define it manually.
          key?: string | number | null

          value?: string
          children?: any
        }
      }
    }
  }
</script>

<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { createEventDispatcher, onMount } from 'svelte'

  type Size = 'default' | 'small' | 'tiny'

  export let selected: string | undefined = undefined
  export let size: Size = 'default'

  let segmentedControl: HTMLDivElement;

  let pillWidth: number;
  let pillPosition: number;

  const dispatch = createEventDispatcher<{
    'select-item': any
  }>()

  function getValue(e: Element) {
    // If the option element doesn't have a value, fallback to using the text
    // content - this allows writing simplified options:
    // i.e. <o>1</o>
    return e.getAttribute('value') ?? e['value'] ?? e.textContent
  }

  $: controlItems = Array.from(
    // TODO(petemil): support slot *descendents* that are leo-menu-item or leo-option (or something else unstyled like leo-menu-action?) so that we can
    // select items that are in complex positions (see an example in the browser app menu zoom controls).
    (segmentedControl?.querySelector('slot') as HTMLSlotElement)
      ?.assignedElements()
      ?.filter((element) =>
        ['LEO-SEGMENTED-ITEM'].includes(element.tagName)
      ) ??
      segmentedControl?.querySelectorAll(
        ':is(leo-segmented-item)'
      ) ??
      []
  ) as HTMLElement[]

  $: {
    for (const controlItem of controlItems) {
      controlItem.setAttribute('tabindex', '0')

      if (controlItem.tagName === 'LEO-SEGMENTED-ITEM') {
        controlItem.setAttribute('role', 'option')

        if (selected === getValue(controlItem)) {
          controlItem.setAttribute('aria-selected', '')
          pillWidth = controlItem.clientWidth;
          pillPosition = controlItem.offsetLeft;
        } else controlItem.removeAttribute('aria-selected')
      } else {
        controlItem.setAttribute('role', 'menuitem')
      }
    }
  }

  function selectItem(e: Event) {
    // Find the option which was clicked on, if any.
    const item = controlItems.find((item) => e.composedPath().includes(item))

    // If the event was triggered for something which isn't an option don't fire
    // a change event.
    if (!item) return

    // Use data-is-interactive=true to prevent the menu from closing when selected. This implies
    // there is interacitivity inside the menu item (e.g. a Toggle), which would be good for the user
    // to see change state and allowing the user to manually close when ready. In other words, when we want
    // the styles and menu navigation features of leo-menu-item, but we don't want the auto-close.

    if (item.tagName === 'LEO-SEGMENTED-ITEM') {
      selected = getValue(item)

      dispatch('select-item', {
        value: selected
      })
    }

    // When using keyboard navigation to call selectItem, ensure click handlers happen on the item,
    // but not when this was called in a click handler, otherwise we'll get 2x clicks.
    if (item.tagName === 'LEO-SEGMENTED-ITEM' && e.type !== 'click') {
      item.click()
    }
  }

  let pill: HTMLDivElement;

  onMount(() => {
    pill.addEventListener("transitionstart", () => {
      segmentedControl.classList.add("transitioning");
    });

    pill.addEventListener("transitionend", () => {
      segmentedControl.classList.remove("transitioning");
    });
  });
</script>

<div
  bind:this={segmentedControl}
  class="leo-segmented-control"
  class:isSmall={size === 'small'}
  class:isTiny={size === 'tiny'}
  on:keypress={(e) => {
    if (e.code !== 'Enter' && e.code !== 'Space') return
    selectItem(e)
  }}
  on:click={selectItem}
>
  <div class="pill" style:width={`${pillWidth}px`} style:left={`${pillPosition}px`} bind:this={pill} />
  <slot />
</div>

<style lang="scss">
  .leo-segmented-control {
    --leo-icon-size: var(--leo-icon-m);
    --bg: var(--leo-color-container-highlight);
    --control-padding: var(--leo-spacing-s);
    --item-padding: var(--leo-spacing-xl);
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

    &.isSmall {
      --leo-icon-size: var(--leo-icon-s);
      --control-height: 40px;
      --item-padding: var(--leo-spacing-l);
    }

    &.isTiny {
      --leo-icon-size: var(--leo-icon-xs);
      --control-padding: var(--leo-spacing-xs);
      --gap: var(--leo-spacing-xs);
      --control-height: 28px;
      --item-padding: var(--leo-spacing-m);
    }

    .pill {
      background: var(--leo-color-container-background);
      position: absolute;
      height: calc(100% - (var(--control-padding) * 2));
      min-width: var(--control-height);
      border-radius: calc(var(--control-height) - var(--control-padding));
      transition: width 0.2s cubic-bezier(0.22, 1, 0.36, 1), left 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    }

    :global :where(&) ::slotted(leo-segmented-item),
    :global :where(&) > leo-segmented-item {
      --leo-icon-color: var(--leo-color-icon-default);
      --item-color: var(--leo-color-text-secondary);
      --item-bg: transparent;

      all: unset;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 100%;
      border-radius: calc(var(--control-height) - var(--control-padding));
      min-width: var(--item-height);
      padding: 0 var(--item-padding);
      cursor: pointer;
      color: var(--item-color);
      background: var(--item-bg);
      box-shadow: var(--item-shadow);
      position: relative;
      z-index: 10;
    }

    :global & > leo-segmented-item,
    :global & > leo-segmented-item .icon {
      transition: background 0.12s ease-in-out, color 0.12s ease-in-out,
        box-shadow 0.12s ease-in-out;
    }

    :global &:not(.transitioning) ::slotted(leo-segmented-item:hover),
    :global &:not(.transitioning) > leo-segmented-item:hover {
      --item-bg: var(--leo-color-page-background);
      --item-color: var(--leo-color-text-primary);
      --item-shadow: var(--leo-effect-elevation-01);
    }

    :global & ::slotted(leo-segmented-item:focus-visible),
    :global & > leo-segmented-item:focus-visible {
      --item-shadow: var(--leo-effect-focus-state);
    }

    :global & ::slotted(leo-segmented-item[aria-selected]),
    :global & > leo-segmented-item[aria-selected] {
      --item-color: var(--leo-color-text-primary);
    }

    :global & ::slotted(leo-segmented-item[aria-selected]:hover),
    :global & > leo-segmented-item[aria-selected]:hover {
      --leo-icon-color: currentColor;
      --item-bg: var(--leo-color-container-background);
    }
  }
</style>

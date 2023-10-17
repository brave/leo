<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import Icon from '../icon/icon.svelte'

  export let title = ''

  // We have a separate external and internal isOpen flag because if the parent
  // doesn't pass anything in we want to be able to toggle open & closed
  // normally. However, if they didn't pass anything in, we just emit an event
  // and let the parent handle toggling the flag.
  export let isOpen: boolean | undefined
  $: isOpenInternal = isOpen ?? false

  const dispatcher = createEventDispatcher<{
    toggle: { open: boolean }
  }>()

  const toggle = (e) => {
    e.preventDefault()

    // We only support toggling if this component isn't being 'controlled'
    const toggleTo = !isOpenInternal
    if (isOpen === undefined) isOpenInternal = toggleTo
    dispatcher('toggle', { open: toggleTo })
  }
</script>

<details class="leoCollapse" open={isOpenInternal}>
  <summary on:click={toggle}>
    {#if $$slots.icon}
      <div class="icon">
        <slot name="icon" />
      </div>
    {/if}
    <div class="title">
      <slot name="title">
        {title}
      </slot>
    </div>
    <div class="arrow">
      <Icon name="carat-down" />
    </div>
  </summary>
  <div class="content">
    <slot />
  </div>
</details>

<style lang="scss">
  :host {
    display: block;
  }

  .leoCollapse {
    --summary-padding: var(
      --leo-collapse-summary-padding,
      var(--leo-spacing-xl) 18px
    );
    --content-padding: var(
      --leo-collapse-content-padding,
      var(--leo-spacing-m) var(--leo-spacing-2xl) var(--leo-spacing-2xl)
        var(--leo-spacing-2xl)
    );
    --background-color: var(
      --leo-collapse-background-color,
      var(--leo-color-container-background)
    );
    --background-color-hover: var(
      --leo-collapse-background-color-hover,
      var(--leo-color-container-interactive)
    );
    --icon-size: var(--leo-collapse-icon-size, 24px);
    --transition-duration: var(--leo-collapse-transition-duration, 0.12s);
    --border-color: var(
      --leo-collapse-border-color,
      var(--leo-color-divider-subtle)
    );
    --border-color-hover: var(
      --leo-collapse-border-color-hover,
      var(--leo-color-primary-20)
    );
    --shadow: var(--leo-collapse-shadow, var(--leo-effect-elevation-01));
    --shadow-hover: var(
      --leo-collapse-shadow-hover,
      var(--leo-effect-elevation-02)
    );
    --shadow-focus: var(
      --leo-collapse-shadow-focus,
      var(--leo-effect-focus-state)
    );
    --radius: var(--leo-collapse-radius, var(--leo-radius-xl));
    --summary-color: var(
      --leo-collapse-summary-color,
      var(--leo-color-text-primary)
    );
    --summary-color-hover: var(
      --leo-collapse-summary-color-hover,
      var(--leo-color-text-interactive)
    );
    --icon-color: var(--leo-collapse-icon-color, var(--leo-color-icon-default));
    --icon-color-hover: var(
      --leo-collapse-icon-color-hover,
      var(--summary-color-hover)
    );

    @media (prefers-reduced-motion) {
      --transition-duration: 0s;
    }

    background-color: var(--background-color);
    box-shadow: var(--shadow);
    border-radius: var(--radius);
    border: 1px solid var(--border-color);
    transition: box-shadow var(--transition-duration) ease-in-out,
      background-color var(--transition-duration) ease-in-out;

    &:has(summary:hover) {
      border-color: var(--border-color-hover);
    }

    &:hover {
      box-shadow: var(--shadow-hover);

      &:not([open]) {
        --background-color: var(--background-color-hover);
      }
    }

    &:focus-within:has(summary:focus-visible) {
      box-shadow: var(--shadow-focus);
    }
  }

  summary {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--leo-spacing-m);

    padding: var(--summary-padding);

    list-style: none;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    color: var(--summary-color);
    transition: color var(--transition-duration) ease-in-out;

    &:hover {
      color: var(--summary-color-hover);

      & .icon,
      .arrow {
        color: var(--icon-color-hover);
      }
    }
  }

  .icon {
    transition: color var(--transition-duration) ease-in-out;
    color: var(--icon-color);
    width: var(--icon-size);
    height: var(--icon-size);
  }

  .title {
    flex-grow: 1;
    font: var(--leo-font-primary-heading-h3);
  }

  .content {
    padding: var(--content-padding);
    font: var(--leo-font-primary-default-regular);
  }

  .arrow {
    color: var(--icon-color);
    transition: transform var(--transition-duration) ease-in-out,
      color var(--transition-duration) ease-in-out;
    transform: rotate(360deg);
  }

  summary {
    outline: none;
  }

  details[open] .arrow {
    transform: rotate(180deg);
  }
</style>

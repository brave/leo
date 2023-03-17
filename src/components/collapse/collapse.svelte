<svelte:options tag="leo-collapse" />

<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let title = ''

  // We have a separate external and internal isOpen flag because if the parent
  // doesn't pass anything in we want to be able to toggle open & closed
  // normally. However, if they didn't pass anything in, we just emit an event
  // and let the parent handle toggling the flag.
  export let isOpen: boolean | undefined
  $: isOpenInternal = isOpen ?? false

  const dispatcher = createEventDispatcher()
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
      {title}
    </div>
    <div class="arrow">
      <svg
        width="16"
        height="9"
        viewBox="0 0 16 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0.234303 0.234362C0.546723 -0.0780572 1.05325 -0.0780572 1.36567 0.234362L7.79999 6.66868L14.2343 0.234363C14.5467 -0.078056 15.0533 -0.0780559 15.3657 0.234363C15.6781 0.546783 15.6781 1.05331 15.3657 1.36573L8.64852 8.08289C8.17989 8.55152 7.42009 8.55152 6.95146 8.08289L0.234303 1.36573C-0.0781163 1.05331 -0.0781163 0.546782 0.234303 0.234362Z"
          fill="currentColor"
        />
      </svg>
    </div>
  </summary>
  <div class="content">
    <slot />
  </div>
</details>

<style lang="scss">
  .leoCollapse {
    --background-color: var(
      --leo-collapse-background-color,
      var(--leo-color-container-background)
    );
    --background-color-hover: var(
      --leo-collapse-background-color-hover,
      var(--leo-color-container-interactive-background)
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
    --radius: var(--leo-collapse-radius, var(--leo-radius-16));
    --summary-color: var(
      --leo-collapse-summary-color,
      var(--leo-color-text-primary)
    );
    --summary-color-hover: var(
      --leo-collapse-summary-color,
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
    gap: var(--leo-spacing-8);

    padding: var(--leo-spacing-16) 18px;

    list-style: none;
    cursor: pointer;

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
    font: var(--leo-font-heading-h5);
  }

  .content {
    padding: var(--leo-spacing-8) var(--leo-spacing-24) var(--leo-spacing-24)
      var(--leo-spacing-24);
    font: var(--leo-font-text-default-regular);
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

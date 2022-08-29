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
    --background-color: var(--color-white);
    --leo-icon-size: var(--icon-size, 24px);
    --animation-duration: 0.12s;

    @theme (dark) {
      --background-color: var(--color-gray-10);
    }

    background-color: var(--background-color);
    box-shadow: var(--effect-elevation-01);
    border-radius: var(--radius-8);
    transition: box-shadow var(--animation-duration) ease-in-out,
      background-color var(--animation-duration) ease-in-out;

    &:hover {
      box-shadow: var(--effect-elevation-02);

      &:not([open]) {
        --background-color: var(--color-primary-10);
      }
    }

    &:hover .title {
      color: var(--color-primary-80);
    }

    &:focus-within:has(summary:focus-visible) {
      box-shadow: 0px 0px 0px 1.7px rgba(255, 255, 255, 0.5),
        1px 1px 4px 2px rgba(33, 75, 230, 0.75),
        -1px -1px 4px 2px rgba(255, 71, 36, 0.75);
    }
  }

  summary {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-8);

    padding: 16px 18px;

    list-style: none;
    cursor: pointer;
  }

  .icon {
    width: var(--leo-icon-size);
    height: var(--leo-icon-size);
  }

  .title {
    flex-grow: 1;
    font: var(--font-heading-h5);
    font-weight: 500;
    color: var(--color-gray-120);
    transition: color --var(--animation-duration) ease-in-out;
  }

  .content {
    padding: 8px 24px 24px 24px;
  }

  .arrow {
    transition: transform var(--animation-duration) ease-in-out;
    transform: rotate(180deg);
  }

  summary {
    outline: none;
  }

  details[open] .arrow {
    transform: rotate(360deg);
  }
</style>

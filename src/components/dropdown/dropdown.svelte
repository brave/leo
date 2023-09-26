<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import FormItem, { type Mode, type Size } from '../formItem/formItem.svelte'
  import Icon from '../icon/icon.svelte'
  import Menu from '../menu/menu.svelte'

  export let placeholder = ''
  export let value: string | undefined = undefined
  export let disabled = false
  export let size: Size = 'normal'
  export let required = false
  export let mode: Mode = 'outline'

  let dispatch = createEventDispatcher()

  let isOpen = false
  let button: HTMLButtonElement
  let dropdown: HTMLDivElement

  function onItemSelect(e: CustomEvent) {
    dispatch('change', e.detail)
  }

  function onClick() {
    isOpen = !isOpen
  }
</script>

<div class="nala-dropdown">
  <div bind:this={dropdown}>
    <FormItem
      bind:disabled
      bind:required
      bind:size
      {mode}
      showFocusOutline={isOpen}
    >
      <slot name="label" slot="label" />
      <slot name="left-icon" slot="left-icon" />
      <button
        bind:this={button}
        class="click-target"
        {disabled}
        on:click|stopPropagation={onClick}
      >
        {#if value !== undefined}
          <slot name="value" {value}>
            <span class="value">{value}</span>
          </slot>
        {:else}
          <slot name="placeholder">
            <span class="placeholder">{placeholder}</span>
          </slot>
        {/if}
      </button>
      <slot name="right-icon" slot="right-icon">
        <div class="indicator" class:open={isOpen}>
          <Icon name="arrow-small-down" />
        </div>
      </slot>
    </FormItem>
  </div>
  <Menu
    target={dropdown}
    bind:isOpen
    bind:currentValue={value}
    on:select-item={onItemSelect}
  >
    <slot />
  </Menu>
</div>

<style lang="scss">
  :host {
    display: inline-block;
  }

  .nala-dropdown {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    button {
      all: unset;
    }
  }

  .nala-dropdown .click-target {
    flex: 1;
    pointer-events: none;
    --glow-size: 3px;

    padding: var(--glow-size);

    &:focus-visible {
      border-radius: var(--nl-spacing-m);
      box-shadow: 0px 0px 0px 1.5px rgba(255, 255, 255, 0.5),
        0px 0px 4px 2px #423eee;
    }
  }
</style>

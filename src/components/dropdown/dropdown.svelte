<script context="module" lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  declare global {
    namespace JSX {
      interface IntrinsicElements {
        'leo-option': HTMLAttributes<HTMLElement> & {
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
  export let showErrors = false

  let dispatch = createEventDispatcher<{
    change: { value: string }
  }>()

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

<div class="leo-dropdown">
  <div>
    <FormItem
      bind:disabled
      bind:required
      bind:size
      bind:controlElement={dropdown}
      {mode}
      showFocusOutline={isOpen}
      error={showErrors && $$slots.errors}
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
    on:close={(e) => {
      // Note: We cancel the |close| event if it was the dropdown that we
      // clicked on, as that already toggles the dropdown. If we do both, the
      // dropdown will instantly close and reopen.
      if (e.detail.originalEvent.composedPath().includes(dropdown)) {
        e.preventDefault()
      } else {
        // Focus the button when closing the dropdown, so keyboard users can
        // reopen it.
        button.focus()
      }
    }}
    on:close
  >
    <slot />
  </Menu>
</div>
{#if showErrors}
  <slot name="errors" />
{/if}

<style lang="scss">
  :host {
    display: inline-block;
  }

  .leo-dropdown {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    button {
      all: unset;
    }
  }

  .leo-dropdown .click-target {
    flex: 1;
    pointer-events: none;
  }
</style>

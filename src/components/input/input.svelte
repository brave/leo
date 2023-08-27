<script lang="ts">
  import type { SvelteHTMLElements } from 'svelte/elements'
  import Button from '../button/button.svelte'
  import FormItem, { type Mode, type Size } from '../formItem/formItem.svelte'
  import Icon from '../icon/icon.svelte'

  type OverrideProps = 'type' | 'value' | 'size' | 'class' | `on:${string}`
  type $$Props = Omit<SvelteHTMLElements['input'], OverrideProps> & {
    type: 'text' | 'password' | 'date' | 'time' | 'color'
    value: string | number | boolean
    size: Size
    hasErrors: boolean
    showErrors: boolean
    mode: Mode | undefined
  }

  export let type: $$Props['type'] = 'text'
  export let value: $$Props['value'] = ''
  export let required = false
  export let disabled = false
  export let size: Size = 'normal'
  export let hasErrors = false
  export let showErrors = false
  export let mode: Mode | undefined = undefined

  const pickerIcons = {
    date: 'calendar',
    time: 'clock'
  }

  let input: HTMLInputElement = undefined
</script>

<FormItem
  bind:required
  bind:disabled
  {size}
  {mode}
  error={(hasErrors || (required && !value)) && showErrors}
>
  <slot name="left-icon" slot="left-icon" />
  <div class="input-container">
    <input
      {...$$restProps}
      class="leo-input"
      {disabled}
      {type}
      {value}
      bind:this={input}
      on:change
      on:input={(e) => (value = e.target['value'])}
      on:input
      on:focus
      on:blur
      on:keydown
      on:keypress
      on:keyup
      on:focusin
      on:focusout
    />
    <div class="extra">
      <slot name="extra" />
    </div>
  </div>
  <slot name="right-icon" slot="right-icon">
    {#if pickerIcons[type]}
      <Button kind="plain-faint" on:click={() => input.showPicker()}>
        <Icon name={pickerIcons[type]} />
      </Button>
    {/if}
  </slot>
  <slot slot="label" />
</FormItem>
{#if showErrors && hasErrors}
  <slot name="errors" />
{/if}

<style lang="scss">
  .leo-input {
    all: unset;
    width: 100%;
  }

  .leo-input::-webkit-calendar-picker-indicator {
    opacity: 0;
    flex: 1;
  }

  .input-container {
    flex: 1;

    display: flex;
    flex-direction: column;
    justify-content: stretch;

    cursor: text;
  }

  .extra {
    color: var(--leo-color-text-secondary);
  }
</style>

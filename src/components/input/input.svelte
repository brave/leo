<script lang="ts">
  import type { SvelteHTMLElements } from 'svelte/elements'
  import Button from '../button/button.svelte'
  import FormItem, { type Mode, type Size } from '../formItem/formItem.svelte'
  import Icon from '../icon/icon.svelte'

  type OverrideProps = 'type' | 'value' | 'size' | 'class' | `on:${string}`
  type $$Props = Omit<SvelteHTMLElements['input'], OverrideProps> & {
    type: 'text' | 'password' | 'date' | 'time' | 'color' | 'number'
    value: string | number | boolean
    size: Size
    hasErrors: boolean
    showErrors: boolean
    mode: Mode | undefined
  }

  /**
   * The type of input to render. The Input component just supports a subset of
   * those supported by the HTML Input element.
   */
  export let type: $$Props['type'] = 'text'

  /**
   * The value of the input control.
   */
  export let value: $$Props['value'] = ''

  /*
   * Whether the value is required. In addition to showing a required indicator,
   * this performs some basic validation (i.e. is value truthy), and if it fails
   * (and showErrors is true), the component will be rendered in its error
   * state.
   */
  export let required = false

  /**
   * Whether the component is disabled.
   */
  export let disabled = false

  /**
   * The size of the input.
   */
  export let size: Size = 'normal'

  /**
   * Whether the component has any errors. If true, and showErrors is set then
   * the errors slot will be rendered and the component will show in its error
   * state.
   */
  export let hasErrors = false

  /**
   * Whether any errors the component has should be shown.
   */
  export let showErrors = false

  /**
   * The mode of the input.
   */
  export let mode: Mode | undefined = undefined

  const pickerIcons = {
    date: 'calendar',
    time: 'clock'
  }

  let input: HTMLInputElement = undefined
  let hasErrorsInternal = false

  function onInput(e) {
    value = e.target['value']
    hasErrorsInternal = (required && !value) || !input.checkValidity()
  }
</script>

<FormItem
  bind:required
  bind:disabled
  {size}
  {mode}
  error={(hasErrors || hasErrorsInternal) && showErrors}
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
      on:input={onInput}
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
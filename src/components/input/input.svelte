<script lang="ts" context="module">
  export type InputEventDetail = {
    innerEvent: Event & { target: HTMLInputElement }
    value: string
    valueAsNumber: number
    valueAsDate: Date | null
  }

  export type InputEvent = (detail: InputEventDetail) => void
</script>

<script lang="ts">
  import type { SvelteHTMLElements } from 'svelte/elements'
  import Button from '../button/button.svelte'
  import FormItem, { type Mode, type Size } from '../formItem/formItem.svelte'
  import Icon from '../icon/icon.svelte'
  import  { onMount } from 'svelte'

  type OverrideProps = 'type' | 'value' | 'size' | 'class' | `on:${string}`
  type LeoInputTypeAttribute =
    | 'color'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'file'
    | 'hidden'
    | 'month'
    | 'number'
    | 'password'
    | 'range'
    | 'search'
    | 'tel'
    | 'text'
    | 'time'
    | 'url'
    | 'week'
  type $$Props = Omit<SvelteHTMLElements['input'], OverrideProps> & {
    type?: LeoInputTypeAttribute
    value?: string | number | boolean
    size?: Size
    showErrors?: boolean
    mode?: Mode | undefined
    onChange?: InputEvent
    onInput?: InputEvent
    onFocus?: InputEvent
    onPaste?: InputEvent
    onBlur?: InputEvent
    onKeyDown?: InputEvent
    onKeyPress?: InputEvent
    onKeyUp?: InputEvent
    onFocusIn?: InputEvent
    onFocusOut?: InputEvent
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
   * Whether any errors the component has should be shown.
   */
  export let showErrors = false

  /**
   * The mode of the input.
   */
  export let mode: Mode | undefined = undefined

  /**
   * Placeholder text for the input.
   */
  export let placeholder = ''

  // Unfortunately, e.target isn't typed properly by Svelte's type definitions
  // in web components. This means we need to forward all the events we're
  // interested in manually, inside our own wrapper.
  export let onChange: InputEvent = undefined
  export let onInput: InputEvent = undefined
  export let onFocus: InputEvent = undefined
  export let onBlur: InputEvent = undefined
  export let onPaste: InputEvent = undefined
  export let onKeyDown: InputEvent = undefined
  export let onKeyUp: InputEvent = undefined
  export let onKeyPress: InputEvent = undefined
  export let onFocusIn: InputEvent = undefined
  export let onFocusOut: InputEvent = undefined

  function forward(handler: InputEvent) {
    return (e: Event) => {
      const event = e as Event & { target: HTMLInputElement }
      handler?.({
        value: value?.toString() ?? '',
        valueAsDate: event.target.valueAsDate,
        valueAsNumber: event.target.valueAsNumber,
        innerEvent: event
      })
    }
  }

  const pickerIcons = {
    date: 'calendar',
    time: 'clock'
  }

  let input: HTMLInputElement | undefined = undefined
  let hasErrorsInternal = false

  function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
    value = e.currentTarget['value']
    hasErrorsInternal = (required && !value) || !input?.checkValidity()
  }

  let tabindex : number;
  
  onMount(() => {
    const inputRootNode = input.getRootNode() as ShadowRoot;

    tabindex = inputRootNode.host?.tagName === 'LEO-INPUT' ? 1 : $$restProps.tabindex;
  });

</script>

<FormItem
  bind:required
  bind:disabled
  renderLabel={$$slots.default}
  {size}
  {mode}
  error={($$slots.errors || hasErrorsInternal) && showErrors}
>
  <slot name="left-icon" slot="left-icon" />
  <div class="input-container">
    <input
      {...$$restProps}
      class="leo-input"
      {disabled}
      {type}
      {value}
      {placeholder}
      {tabindex}
      bind:this={input}
      on:input={handleInput}
      on:change={forward(onChange)}
      on:input={forward(onInput)}
      on:focus={forward(onFocus)}
      on:paste={forward(onPaste)}
      on:blur={forward(onBlur)}
      on:keydown={forward(onKeyDown)}
      on:keypress={forward(onKeyPress)}
      on:keyup={forward(onKeyUp)}
      on:focusin={forward(onFocusIn)}
      on:focusout={forward(onFocusOut)}
    />
    <div class="extra">
      <slot name="extra" />
    </div>
  </div>
  <slot name="right-icon" slot="right-icon">
    {#if pickerIcons[type]}
      <Button kind="plain-faint" onClick={() => input?.showPicker()}>
        <Icon name={pickerIcons[type]} />
      </Button>
    {/if}
  </slot>
  <slot slot="label" />
</FormItem>
{#if showErrors}
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

  .leo-input::placeholder {
    color: currentColor;
    opacity: 0.6;
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

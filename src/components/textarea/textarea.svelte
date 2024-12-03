<script lang="ts" context="module">
  export type InputEventDetail = {
    innerEvent: Event & { target: HTMLTextAreaElement }
    value: string
  }

  export type InputEvent = (detail: InputEventDetail) => void
</script>

<script lang="ts">
  import type { SvelteHTMLElements } from 'svelte/elements'
  import FormItem, { type Mode } from '../formItem/formItem.svelte'

  type OverrideProps = 'value' | 'class' | `on:${string}`

  /**
   * We probably don't need to provide `size` for the textarea. We aren't
   * likely to support `small` or `large` textareas. Instead, we would be
   * more likely to simply use the `rows` and `cols` attributes.
   */
  type $$Props = Omit<SvelteHTMLElements['textarea'], OverrideProps> & {
    value?: string
    minRows?: number
    maxRows?: number
    resizeable?: boolean
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
   * The value of the input control.
   */
  export let value: $$Props['value'] = ''

  /**
   * The minimum number of rows to display.
   */
  export let minRows: $$Props['minRows'] = 3

  /**
   * The maximum number of rows to display. Once the number
   * of lines exceeds this value, the textarea will scroll.
   */
  export let maxRows: $$Props['maxRows'] = 3

  /**
   * Whether the textarea component is vertically resizeable.
   */
  export let resizeable = false

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
   * Whether any errors the component has should be shown.
   */
  export let showErrors = false

  /**
   * The mode of the textarea.
   */
  export let mode: Mode | undefined = undefined

  /**
   * Placeholder text for the textarea.
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
      const event = e as Event & { target: HTMLTextAreaElement }
      handler?.({
        value: value?.toString() ?? '',
        innerEvent: event
      })
    }
  }

  let input: HTMLTextAreaElement | undefined = undefined
  let rows = minRows
  let hasErrorsInternal = false

  function handleInput(e: Event & { currentTarget: HTMLTextAreaElement }) {
    value = e.currentTarget['value']
    hasErrorsInternal = (required && !value) || !input?.checkValidity()

    // Dynamically update the [rows] attribute based on user-input
    if ( minRows || maxRows ) {
      const lineCount = value.split('\n').length

      rows = lineCount > rows
        ? Math.min(lineCount, maxRows)
        : Math.max(lineCount, minRows)
    }
  }
</script>

<FormItem
  bind:required
  bind:disabled
  renderLabel={$$slots.default}
  {mode}
  error={($$slots.errors || hasErrorsInternal) && showErrors}
>
  <slot name="left-icon" slot="left-icon" />
  <div class="textarea-container">
    <textarea
      {...$$restProps}
      class="leo-textarea"
      class:resize={resizeable}
      {disabled}
      {value}
      {placeholder}
      {rows}
      tabindex={1}
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
    ></textarea>
    <div class="extra">
      <slot name="extra" />
    </div>
  </div>
  <slot name="right-icon" slot="right-icon"></slot>
  <slot slot="label" />
</FormItem>
{#if showErrors}
  <slot name="errors" />
{/if}

<style lang="scss">
  .leo-textarea {
    all: unset;
    width: 100%;
  }

  .resize {
    resize: vertical;
  }

  .leo-textarea::placeholder {
    color: currentColor;
    opacity: 0.6;
  }

  .textarea-container {
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

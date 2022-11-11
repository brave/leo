<svelte:options tag="leo-text-input" />

<script lang="ts">
  import type * as Props from './props';

  interface CommonProps {
    type?: Props.TextInputType;
  }

  type TextInputProps = CommonProps & Partial<svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['input']>> & {
    isRequired?: boolean;
    isDisabled?: boolean;
  }

  type $$Props = TextInputProps

  export let value: string = '';
  export let name: string = '';
  export let label: string = '';
  export let error: string = '';
  export let type: Props.TextInputType = 'text';
  export let isRequired: boolean = false;
  export let isDisabled: boolean = false;
</script>

<div class="form-control" class:required={isRequired} class:error={error} class:disabled={isDisabled}>
  {#if label}
    <label for={name}>{label}</label>
  {/if}
  <input {...{type}} id={name} {name} bind:value={value} on:input on:change on:focus on:blur required={isRequired ?? undefined} disabled={isDisabled ?? undefined} {...$$restProps} />
  {#if error}
    <p class="message">{error}</p>
  {/if}
</div>

<style lang="scss">
  .form-control {
    --label-text-color: var(--color-text-primary);

    display: flex;
    flex-direction: column;

    label {
      font: var(--font-text-small-semibold);
      padding-bottom: 8px;
      color: var(--label-text-color);
    }

    &.required label::after {
      content: '*';
      font: var(--font-text-small-regular);
      color: var(--color-systemfeedback-error-icon);
      padding-left: 4px;
    }

    &.error input {
      --bg: var(--color-systemfeedback-error-background);
    }

    &.error .message {
      margin: 0;
      padding: 0;
      padding-top: 8px;
      font: var(--font-text-small-regular);
      color: var(--color-systemfeedback-error-icon);
    }

    &.disabled {
      --label-text-color: var(--color-text-secondary);
    }
  }

  input {
    --text-color: var(--color-text-primary);
    --placeholder-text-color: var(--color-text-secondary);
    --bg: var(--color-container-highlight);
    --radius: var(--radius-8);
    --padding-y: 10px;
    --padding-x: 8px;
    --border-color: transparent;
    --box-shadow: none;

    all: unset;
    font: var(--font-text-default-regular);
    color: var(--text-color);
    background: var(--bg);
    border-radius: var(--radius);
    padding: var(--padding-y) var(--padding-x);
    border: 1px solid var(--border-color);
    box-shadow: var(--box-shadow);

    &::placeholder {
      color: var(--placeholder-text-color);
    }

    &:hover {
      --border-color: var(--color-divider-subtle);
      --box-shadow: var(--effect-elevation-02);
    }

    &:focus-visible {
      outline: none;
      --box-shadow: var(--effect-elevation-focus-state);
    }

    &:disabled {
      --text-color: var(--color-text-disabled);
      --placeholder-text-color: var(--color-text-disabled);
      --bg: var(--color-container-disabled);
    }
  }

  // TODO: is this the best approach?
  :global(.form-control) + :global(.form-control) {
    padding-top: 14px;
  }
</style>
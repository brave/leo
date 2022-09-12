<script lang="ts">
  export let required = false
  export let label = ''
  export let placeholder = ''
  export let value = ''
  export let disabled = false

  let inputId = Math.random().toString()
  $: hasError = !!$$slots.error
</script>

<label class="leo-input" class:error={hasError} class:disabled for={inputId}>
  <div class="label">
    {#if $$slots.label}
      <slot name="label" />
    {:else}
      {label}
    {/if}
    {#if required}
      <span class="required-indicator">*</span>
    {/if}
  </div>
  <div class="input-container">
    <slot name="icon" />
    <input
      type="text"
      id={inputId}
      {disabled}
      {placeholder}
      bind:value
      on:input
      on:change
      on:focus
      on:blur
    />
  </div>
  {#if hasError}
    <div class="error">
      <slot name="error" />
    </div>
  {/if}
</label>

<style lang="scss">
  .leo-input {
    display: flex;
    flex-direction: column;
    gap: 4px;

    &.disabled {
      & .input-container {
        background: var(--color-gray-30);
        color: var(--color-gray-60);
      }

      & .label {
        color: var(--color-gray-70);
      }
    }

    & .label {
      line-height: 18px;
      display: flex;
      flex-direction: row;
      gap: 4px;

      align-items: center;
      color: var(--color-gray-120);
      font: var(--font-button-small);
    }

    & .required-indicator {
      font: var(--font-small-regular);
      color: var(--color-red-70);
    }

    & .input-container {
      display: flex;
      flex-direction: row;
      gap: 8px;

      padding: 10px 8px;
      background: var(--color-gray-10);
      color: var(--color-gray-120);

      border-radius: 8px;
      border: 1px solid transparent;

      &:hover:not(.disabled .input-container) {
        border: 1px solid var(--color-gray-30);
        box-shadow: 0px 0.5px 1.5px 0px #4245521a, 0px 0px 1px 0px #42455214;
      }

      &:focus-within:not(.disabled .input-container) {
        box-shadow: 0px 0px 0px 1.7px rgba(255, 255, 255, 0.5),
          1px 1px 4px 2px rgba(33, 75, 230, 0.75),
          -1px -1px 4px 2px rgba(255, 71, 36, 0.75);
      }

      &.error {
        background: var(--color-red-30);
        & .icon {
          color: var(--color-red-70);
        }
      }

      & input {
        all: unset;
        font: var(--font-default-regular);
        &::placeholder {
          color: var(--color-gray-70);
        }
      }
    }

    & .error {
      color: var(--color-red-70);
    }
  }
</style>

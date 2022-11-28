<svelte:options tag="leo-toggle" />

<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let on: boolean = false
  export let disabled: boolean = false

  const dispatch = createEventDispatcher()
  const toggle = () => {
    on = !on
    dispatch('toggle', { on })
  }
</script>

<label class="leo-toggle">
  <button disabled={disabled} role="switch" aria-checked={on} part="track" on:click={toggle}>
    <div class="thumb" part="thumb" aria-hidden="true">
      <slot name="on-icon" />
    </div>
  </button>
  <slot name="label" />
</label>

<style lang="scss">
  :root {
    --leo-toggle-height: 32px;
    --leo-toggle-width: 56px;
    --leo-toggle-padding: 2px;
    --leo-toggle-on-color: var(--color-interaction-button-primary-background);
    --leo-toggle-on-color-hover: var(--color-primary-60);
    --leo-toggle-off-color: var(--color-gray-30);
    --leo-toggle-off-color-hover: var(--color-gray-40);
    --leo-toggle-thumb-color: var(--color-white);

    @theme (dark) {
      --leo-toggle-on-color-hover: var(--color-dark-primary-40);
    }
  }

  .leo-toggle {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    & button {
      all: unset;
      background: var(--leo-toggle-off-color);
      width: var(--leo-toggle-width);
      height: var(--leo-toggle-height);
      border-radius: var(--radius-full);
      padding: var(--leo-toggle-padding);
      transition: background-color 0.2s ease-in-out;
      flex-shrink: 0;

      &:disabled {
        opacity: 0.5;
      }

      &:focus-within:not(:disabled) {
        box-shadow: 0px 0px 0px 1.5px rgba(255, 255, 255, 0.5), 0px 0px 4px 2px #423EEE;
      }

      &:hover:not(:disabled) {
        background-color: var(--leo-toggle-off-color-hover);

        &[aria-checked='true'] {
          background-color: var(--leo-toggle-on-color-hover);
        }
      }

      .thumb {
        height: 100%;
        aspect-ratio: 1/1;
        background: white;
        border-radius: var(--radius-full);
        transition: transform 0.2s ease-in-out, color 0.2s ease-in-out;

        display: flex;
        align-items: center;
        justify-content: center;

        box-shadow: var(--effect-elevation-02);

        :global([slot$='-icon']) {
          transition: opacity 0.2s ease-in-out;
        }

        :global([slot='on-icon']) {
          opacity: 0;
        }
      }

      &[aria-checked='true'] {
        background: var(--leo-toggle-on-color);

        .thumb {
          transform: translate(
            calc(var(--leo-toggle-width) - var(--leo-toggle-height) + 0.25px),
            0
          );
          color: var(--leo-toggle-on-color);
        }

        :global([slot='on-icon']) {
          opacity: 1;
        }
      }
    }
  }
</style>

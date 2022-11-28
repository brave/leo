<svelte:options tag="leo-toggle" />

<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let on: boolean
  export let label: string = ''

  const dispatch = createEventDispatcher()
  const toggle = () => {
    on = !on
    dispatch('toggle', { on })
  }
</script>

<label class="leo-toggle">
  <button role="switch" aria-checked={on} part="track" on:click={toggle}>
    <div class="thumb" part="thumb" />
  </button>
  {label}
</label>

<style lang="scss">
  :root {
    --leo-toggle-height: 32px;
    --leo-toggle-width: 56px;
    --leo-toggle-padding: 2px;
  }

  .leo-toggle {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    & button {
      all: unset;
      background: var(--color-gray-30);
      width: var(--leo-toggle-width);
      height: var(--leo-toggle-height);
      border-radius: var(--radius-full);
      padding: var(--leo-toggle-padding);
      transition: background-color 0.2s ease-in-out;

      .thumb {
        height: 100%;
        aspect-ratio: 1/1;
        background: white;
        border-radius: var(--radius-full);
        transition: transform 0.2s ease-in-out;
      }

      &[aria-checked='true'] {
        background: var(--color-interaction-button-primary-background);

        .thumb {
          transform: translate(
            calc(var(--leo-toggle-width) - var(--leo-toggle-height) + 0.25px),
            0
          );
        }
      }
    }
  }
</style>

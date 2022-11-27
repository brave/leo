<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  class ChangeEvent extends Event {
    activeDot: number
  }

  export let dotCount: number
  export let activeDot: number

  let container: HTMLDivElement
  $: container?.setAttribute('style', `--current-dot: ${activeDot}`)
  $: dots = Array.from(Array(dotCount), (_, i) => i)

  let dispatch = createEventDispatcher<{
    change: { activeDot: number }
  }>()

  function setActive(dot: number) {
    dispatch('change', { activeDot: dot })
  }
</script>

<div class="leo-navdots">
  <div class="dot-container" part="dot-container" bind:this={container}>
    {#each dots as dot}
      <button class="dot" part="dot" on:click={() => setActive(dot)} />
    {/each}

    <div class="active-dot" part="active-dot" />
  </div>
</div>

<style lang="scss">
  :root {
    --dot-size: 16px;
    --dot-spacing: 10px;
    --current-dot: 0;
    --transition-duration: 0.2s;
    --transition-easing: ease-in-out;

    // Expanded dot grows to fill half spacing in each direction.
    --expanded-dot-size: calc(var(--dot-size) + var(--dot-spacing));

    width: 100%;
  }

  .leo-navdots {
    display: flex;
    flex-direction: row;
    justify-content: center;

    .dot-container {
      display: flex;
      flex-direction: row;
      gap: var(--dot-spacing);
      position: relative;
      padding: 0 calc(var(--dot-spacing) / 2);
    }

    .dot {
      all: unset;
      width: var(--dot-size);
      height: var(--dot-size);
      border-radius: var(--dot-size);
      background: var(--color-primary-20);
      transition: background-color var(--transition-duration)
        var(--transition-easing);

      &:hover {
        /* TODO(fallaciousreasoning): Work out better hover state with designers */
        background-color: var(--color-interaction-button-primary-background);
      }
    }

    .active-dot {
      position: absolute;
      transition: transform var(--transition-duration) var(--transition-easing);
      transform: translate(
        calc(
          (var(--dot-size) + var(--dot-spacing)) * var(--current-dot) -
            var(--dot-spacing) / 2
        ),
        0
      );
      width: calc(var(--dot-size) + var(--dot-spacing));
      height: var(--dot-size);
      border-radius: var(--dot-size);
      background: var(--color-interaction-button-primary-background);
    }
  }
</style>

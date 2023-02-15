<svelte:options tag="leo-navdots" />

<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let animateSlide: boolean = true
  export let dotCount: number
  export let activeDot: number = 0
  export let getDotLabel: (dot: number, isCurrent: boolean) => string = (dot) =>
    `Page ${dot + 1}`
  export let label: string = 'Pagination'

  let container: HTMLElement
  $: container?.setAttribute('style', `--current-dot: ${activeDot}`)
  $: dots = Array.from(Array(dotCount), (_, i) => i)

  let dispatch = createEventDispatcher<{
    change: { activeDot: number }
  }>()

  function setActive(dot: number) {
    dispatch('change', { activeDot: dot })
  }
</script>

<nav class="leo-navdots" aria-label={label}>
  <ol class="dot-container" bind:this={container}>
    {#each dots as dot}
      <li>
        <button
          class="dot"
          class:active={dot == activeDot}
          aria-current={dot === activeDot}
          aria-label={getDotLabel(dot, dot === activeDot)}
          on:click={() => setActive(dot)}
        />
      </li>
    {/each}

    <li
      aria-hidden="true"
      class="active-dot"
      class:no-animate={!animateSlide}
    />
  </ol>
</nav>

<style lang="scss">
  .leo-navdots {
    --dot-size: var(--leo-navdots-size, 8px);
    // Expanded dot grows to fill half spacing in each direction.
    --expanded-dot-size: var(
      --leo-navdots-expanded-size,
      calc(var(--dot-size) + var(--dot-spacing))
    );

    --dot-spacing: var(--leo-navdots-spacing, 10px);
    --dot-vertical-margin: var(--leo-navdots-vertical-margin, 1px);
    --transition-duration: var(--leo-navdots-transition-duration, 0.2s);
    --transition-easing: var(--leo-navdots-easing, ease-in-out);

    --active-dot-color: var(
      --leo-navdots-active-color,
      var(--leo-color-interaction-button-primary-background)
    );
    --active-dot-color-hover: var(
      --leo-navdots-active-color-hover,
      var(--leo-color-icon-interactive)
    );
    --dot-color: var(--leo-navdots-color, var(--leo-color-primary-20));
    --dot-color-hover: var(
      --leo-navdots-color-hover,
      var(--leo-color-primary-30)
    );

    --current-dot: 0;

    display: flex;
    flex-direction: row;
    justify-content: center;

    .dot-container {
      display: flex;
      flex-direction: row;
      gap: var(--dot-spacing);
      position: relative;
      padding: 0 calc(var(--dot-spacing) / 2);
      margin: 0;
      list-style: none;

      > li {
        display: flex;
      }

      &:has(.dot.active:focus-visible) .active-dot {
        box-shadow: 0px 0px 0px 1.5px rgba(255, 255, 255, 0.5),
          0px 0px 4px 2px #423eee;
      }
    }

    .dot {
      all: unset;
      cursor: pointer;
      margin: var(--dot-vertical-margin) 0;
      width: var(--dot-size);
      height: var(--dot-size);
      border-radius: var(--dot-size);
      background: var(--dot-color);
      transition: background-color var(--transition-duration)
          var(--transition-easing),
        box-shadow var(--transition-duration) var(--transition-easing);

      &:hover {
        background-color: var(--dot-color-hover);
      }

      &:focus-visible:not(.active) {
        box-shadow: 0px 0px 0px 1.5px rgba(255, 255, 255, 0.5),
          0px 0px 4px 2px #423eee;
      }
    }

    .no-animate {
      --transition-duration: 0;
    }

    .active-dot {
      cursor: pointer;
      position: absolute;
      transition: transform var(--transition-duration) var(--transition-easing),
        box-shadow var(--transition-duration) var(--transition-easing);
      transform: translate(
        calc(
          (var(--dot-size) + var(--dot-spacing)) * var(--current-dot) -
            var(--dot-spacing) / 2
        ),
        0
      );
      width: calc(var(--dot-size) + var(--dot-spacing));
      height: calc(var(--dot-size) + var(--dot-vertical-margin) * 2);
      border-radius: var(--dot-size);
      background: var(--active-dot-color);

      &:hover {
        background: var(--active-dot-color-hover);
      }
    }
  }
</style>

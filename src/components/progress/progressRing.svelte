<script lang="ts">
  export let progress = 0
  export let mode: 'determinate' | 'indeterminate' = 'indeterminate'

  $: progress = mode === 'indeterminate' ? 0.25 : progress
</script>

<div
  class="leo-progressring"
  class:spin={mode === 'indeterminate'}
  style:--progress={progress}
>
  <slot />
  <svg viewBox="0 0 48 48">
    <circle class="leo-progressring__background" />
    <circle class="leo-progressring__ring" />
  </svg>
</div>

<style lang="scss">
  :host {
    display: inline-block;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .leo-progressring {
    --size: var(--leo-progressring-size, 48px);
    --spin-rate: var(--leo-progressring-spin-rate, 1s);
    --transition-duration: var(--leo-progressring-transition-duration, 0.2s);
    --stroke-color: var(
      --leo-progressring-color,
      var(--leo-color-button-background)
    );
    --stroke-width: var(--leo-progressring-stroke-width, 4px);
    --radius: 24px;
    --normalized-radius: calc(var(--radius) - var(--stroke-width));
    --circumference: calc(var(--normalized-radius) * 2 * 3.141592);

    --background-color: var(--stroke-color);

    width: var(--size);
    height: var(--size);
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    svg {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
    }

    &.spin svg {
      animation-duration: var(--spin-rate);
      animation-name: spin;
      animation-iteration-count: infinite;
      animation-timing-function: cubic-bezier(0.17, 0.67, 0.83, 0.67);
    }

    circle {
      transform: rotate(270deg);
      transform-origin: 50% 50%;
      transition: stroke-dashoffset var(--transition-duration);
      stroke-linecap: round;
      r: var(--normalized-radius);
      cx: var(--radius);
      cy: var(--radius);
      stroke-width: var(--stroke-width);
      fill: transparent;
    }

    &__background {
      stroke-opacity: 0.3;
      stroke: var(--background-color);
    }

    &__ring {
      stroke-dasharray: var(--circumference) var(--circumference);
      stroke-dashoffset: calc(var(--circumference) * (1 - var(--progress)));
      stroke: var(--stroke-color);
    }
  }
</style>

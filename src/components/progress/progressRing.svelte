<svelte:options tag="leo-progressring" />

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
    <circle
      style:r="var(--normalized-radius)"
      style:cx="var(--radius)"
      style:cy="var(--radius)"
      style:stroke-width="var(--stroke-width)"
      stroke="var(--background-color)"
      fill="transparent"
    />
    <circle
      style:r="var(--normalized-radius)"
      style:cx="var(--radius)"
      style:cy="var(--radius)"
      style:stroke-width="var(--stroke-width)"
      stroke="var(--stroke-color)"
      style:stroke-dasharray="var(--circumference) var(--circumference)"
      style:stroke-dashoffset={'calc(var(--circumference) * (1 - var(--progress)))'}
      fill="transparent"
    />
  </svg>
</div>

<style lang="scss">
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
      var(--leo-color-interaction-button-primary-background)
    );
    --stroke-width: var(--leo-progressring-stroke-width, 4px);
    --radius: 24px;
    --normalized-radius: calc(var(--radius) - var(--stroke-width));
    --circumference: calc(var(--normalized-radius) * 2 * 3.141592);

    --background-color: var(
      --leo-progressring-background-color,
      var(--leo-color-primary-20)
    );

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
      animation-timing-function: linear;
    }

    circle {
      transform: rotate(270deg);
      transform-origin: 50% 50%;
      transition: stroke-dashoffset var(--transition-duration);
      stroke-linecap: round;
    }
  }
</style>

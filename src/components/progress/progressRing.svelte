<svelte:options tag="leo-progressring" />

<script lang="ts">
  export let progress = 0
  export let radius = 24
  export let strokeWidth = 4
  export let mode: 'determinate' | 'indeterminate' = 'indeterminate'

  $: progress = mode === 'indeterminate' ? 0.25 : progress

  $: normalizedRadius = radius - strokeWidth
  $: circumference = normalizedRadius * 2 * Math.PI
</script>

<div
  class="leo-progressring"
  class:spin={mode === 'indeterminate'}
  style="width: {radius * 2}px; height: {radius * 2}px"
>
  <slot />
  <svg width={radius * 2} height={radius * 2}>
    <circle
      r={normalizedRadius}
      cx={radius}
      cy={radius}
      stroke="var(--background-color)"
      stroke-width={strokeWidth}
      fill="transparent"
    />
    <circle
      stroke="var(--stroke-color)"
      stroke-dasharray="{circumference} {circumference}"
      stroke-width={strokeWidth}
      stroke-dashoffset={circumference * (1 - progress)}
      fill="transparent"
      r={normalizedRadius}
      cx={radius}
      cy={radius}
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
    --spin-rate: var(--leo-progressring-spin-rate, 1s);
    --transition-duration: var(--leo-progressring-transition-duration, 0.2s);
    --stroke-color: var(
      --leo-progress-stroke-color,
      var(--color-interaction-button-primary-background)
    );

    --background-color: var(
      --leo-progress-background-color,
      var(--color-primary-20)
    );

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

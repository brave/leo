<script>
  export let shouldWrap = false;
  export let swatchSize = 150;
</script>

{#if shouldWrap}
  <div class="swatch-group" style={`--swatch-size: ${swatchSize}px`}>
    <slot />
  </div>
{:else}
  <slot />
{/if}

<style>
  .swatch-group {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(50px, var(--swatch-size)));
    gap: 1rem;
    padding-bottom: 1rem;
  }
</style>

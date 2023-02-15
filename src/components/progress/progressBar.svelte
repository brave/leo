<svelte:options tag="leo-progressbar" />

<script lang="ts">
  export let progress: number = 0
</script>

<div class="leo-progressbar">
  <div class="progress" style="width: {progress * 100}%" />
</div>

<style lang="scss">
  .leo-progressbar {
    --radius: var(--leo-progressbar-radius, 10px);
    --transition-duration: var(--leo-progressbar-transition-duration, 0.2s);
    background: var(
      --leo-progressbar-background-color,
      var(--leo-color-primary-20)
    );
    height: var(--leo-progressbar-height, 4px);
    border-radius: var(--radius);

    .progress {
      height: 100%;
      width: 100%;
      transition: width var(--transition-duration) ease-in-out;
      background: var(
        --leo-progressbar-color,
        var(--leo-color-interaction-button-primary-background)
      );
      border-radius: var(--radius);
    }
  }
</style>

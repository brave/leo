<script lang="ts">
  export let progress: number = 0
</script>

<div class="nala-progressbar">
  <div class="progress" style="width: {progress * 100}%" />
</div>

<style lang="scss">
  :host {
    display: block;
  }

  .nala-progressbar {
    --radius: var(--nl-progressbar-radius, 10px);
    --transition-duration: var(--nl-progressbar-transition-duration, 0.2s);
    background: var(
      --nl-progressbar-background-color,
      var(--nl-color-primary-20)
    );
    height: var(--nl-progressbar-height, 4px);
    border-radius: var(--radius);

    .progress {
      height: 100%;
      width: 100%;
      transition: width var(--transition-duration) ease-in-out;
      background: var(
        --nl-progressbar-color,
        var(--nl-color-button-background)
      );
      border-radius: var(--radius);
    }
  }
</style>

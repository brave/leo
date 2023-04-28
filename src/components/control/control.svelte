<script lang="ts">
</script>

<div class="leo-control" on:click on:keyup>
  <slot name="left-icon" />
  <slot />
  <slot name="right-icon" />
</div>

<style lang="scss">
  .leo-control {
    --radius: var(--leo-control-radius, var(--leo-spacing-8));
    --background: var(
      --leo-control-background,
      var(--leo-color-container-highlight)
    );
    --padding: var(
      --leo-control-padding,
      var(--leo-spacing-12) var(--leo-spacing-8)
    );
    --font: var(--leo-control-font, var(--leo-font-primary-default-regular));

    border-radius: var(--radius);
    background: var(--background);
    padding: var(--padding);
    font: var(--font);

    border: 1px solid transparent;

    display: flex;
    flex-direction: row;
    gap: var(--leo-spacing-8);

    &:hover {
      border-color: var(--leo-color-divider-subtle);
    }

    &:focus-within {
      box-shadow: 0px 0px 0px 1.5px rgba(255, 255, 255, 0.5),
        0px 0px 4px 2px #423eee;
    }
  }
</style>

<script lang="ts">
  export let disabled = false
</script>

<div class="leo-control" aria-disabled={disabled} on:click on:keyup>
  <div>
    <slot name="left-icon" />
  </div>
  <slot />
  <div>
    <slot name="right-icon" />
  </div>
</div>

<style lang="scss">
  .leo-control {
    --radius: var(--leo-control-radius, var(--leo-spacing-8));
    --background: var(
      --leo-control-background,
      var(--leo-color-container-highlight)
    );
    --padding: var(--leo-control-padding, 9px);
    --font: var(--leo-control-font, var(--leo-font-primary-default-regular));
    --leo-icon-size: 20px;
    --leo-icon-color: var(--leo-color-icon-default);

    border-radius: var(--radius);
    background: var(--background);
    padding: var(--padding);
    font: var(--font);

    border: 1px solid transparent;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--leo-spacing-8);

    &:not([aria-disabled='true']) {
      &:hover {
        border-color: var(--leo-color-divider-subtle);
      }

      &:has(*:focus-visible) {
        box-shadow: 0px 0px 0px 1.5px rgba(255, 255, 255, 0.5),
          0px 0px 4px 2px #423eee;
      }
    }
  }

  .leo-control[aria-disabled='true'] {
    background: var(--leo-color-container-disabled);
    color: var(--leo-color-text-disabled);
  }
</style>

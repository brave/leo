<script lang="ts">
  export let value: string | number
</script>

<button class="leo-segmented-control-item" {value}>
  <div class="item-icon" class:no-icon={!$$slots['icon-before']}>
    <slot name="icon-before" />
  </div>
  <div class="content">
    <slot />
  </div>
  <div class="item-icon" class:no-icon={!$$slots['icon-after']}>
    <slot name="icon-after" />
  </div>
</button>

<style lang="scss">
  :host {
    display: flex;
    height: 100%;
    flex: 1 0 auto;
  }
  .leo-segmented-control-item {
    all: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1 0 auto;
    box-sizing: border-box;
    height: 100%;
    border-radius: var(--leo-segmented-control-item-radius);
    min-width: var(--leo-segmented-control-item-height);
    padding: 0 var(--leo-segmented-control-item-padding);
    cursor: pointer;
    color: var(--leo-segmented-control-item-color);
    font: var(--leo-segmented-control-item-font);
    background: var(--leo-segmented-control-item-background);
    box-shadow: var(--leo-segmented-control-item-shadow);
    position: relative;
    z-index: 10;

    &,
    .item-icon {
      transition: background 0.12s ease-in-out, color 0.12s ease-in-out, box-shadow 0.12s ease-in-out;
    }

    .item-icon {
      color: var(--leo-segmented-control-item-icon-color);
      width: var(--leo-icon-size);

      &.no-icon {
        display: none;
      }
    }

    & .content {
      padding: 0 var(--leo-segmented-control-item-icon-gap);
    }
  }
</style>

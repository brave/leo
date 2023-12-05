<script lang="ts">
  export let value: string | number
</script>

<button class="leo-control-item" {value}>
  <div class="item-icon" class:no-icon={!$$slots['icon-before']}>
    <slot name="icon-before" />
  </div>
  <div>
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
  }
  .leo-control-item {
    all: unset;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 100%;
    border-radius: var(--leo-control-item-radius);
    min-width: var(--leo-control-item-height);
    padding: 0 var(--leo-control-item-padding);
    cursor: pointer;
    color: var(--leo-control-item-color);
    font: var(--leo-control-item-font);
    background: var(--leo-control-item-background);
    box-shadow: var(--leo-control-item-shadow);
    position: relative;
    z-index: 10;

    &,
    .item-icon {
      transition: background 0.12s ease-in-out, color 0.12s ease-in-out, box-shadow 0.12s ease-in-out;
    }

    .item-icon {
      color: var(--leo-control-item-icon-color);
      width: var(--leo-icon-size);

      &.no-icon {
        display: none;
      }
    }

    & .item-icon:first-of-type {
      padding-right: var(--leo-control-item-icon-gap);
    }

    & .item-icon:last-of-type {
      padding-left: var(--leo-control-item-icon-gap);
    }
  }
</style>

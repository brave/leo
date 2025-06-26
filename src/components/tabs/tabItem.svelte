<script lang="ts">
  export let value: string | number
</script>

<button class="leo-tab-item" {value}>
  {#if $$slots['icon-before']}
    <div class="item-icon">
      <slot name="icon-before" />
    </div>
  {/if}
  <div class="content">
    <slot />
  </div>
  {#if $$slots['icon-after']}
    <div class="item-icon">
      <slot name="icon-after" />
    </div>
  {/if}
</button>

<style lang="scss">
  :host {
    display: flex;
    height: 100%;
    flex: 0 0 auto;
  }
  .leo-tab-item {
    all: unset;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    box-sizing: border-box;
    height: 100%;
    padding: var(--leo-tab-item-padding);
    cursor: pointer;
    color: var(--leo-tab-item-color);
    font: var(--leo-tab-item-font);
    background: var(--leo-tab-item-background);
    box-shadow: var(--leo-tab-item-shadow);
    position: relative;
    transition: color 0.2s ease-in-out;

    &,
    .item-icon {
      transition: background 0.12s ease-in-out, color 0.12s ease-in-out, box-shadow 0.12s ease-in-out;
    }

    .item-icon {
      color: var(--leo-tab-item-icon-color);
      width: var(--leo-icon-size);
      height: var(--leo-icon-size);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    & .content {
      display: flex;
      align-items: center;
      white-space: nowrap;
      gap: var(--leo-spacing-m);
    }
  }
</style> 
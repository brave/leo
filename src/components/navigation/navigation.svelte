<script lang="ts">
  export let kind: 'vertical' | 'horizontal' = 'vertical'
</script>

<div class="leo-navigation kind-{kind}">
  {#if $$slots.header}
    <slot name="header" />
  {/if}

  <nav>
    <slot />
  </nav>

  {#if $$slots.actions}
    <slot name="actions" />
  {/if}

  <div class="active-indicator" />
</div>

<style lang="scss">
  .leo-navigation {
    --nav-direction: row;
    --leo-icon-size: var(--leo-icon-s);

    position: relative;

    display: flex;
    flex-direction: var(--nav-direction);
    height: 100%;

    &.kind-vertical {
      --nav-direction: column;
    }

    @supports (anchor-name: --active-indicator) {
      &:has([data-selected='true']) .active-indicator {
        --anchor-padding: var(--leo-spacing-m);

        position-anchor: --active-indicator;

        transition:
          top 0.12s ease-in-out,
          bottom 0.12s ease-in-out,
          left 0.12s ease-in;

        content: '';
        width: 4px;
        border-top-right-radius: var(--leo-radius-xs);
        border-bottom-right-radius: var(--leo-radius-xs);
        background: var(--leo-color-text-interactive);
        position: absolute;
        left: anchor(left);
        top: calc(anchor(top) + var(--anchor-padding));
        bottom: calc(anchor(bottom) + var(--anchor-padding));
        z-index: 1;
      }
    }
  }
</style>

<header class="leo-navigation-header">
  <slot name="logo" />
  <slot />
</header>

<style>
  .leo-navigation-header {
    display: flex;
    gap: var(--leo-spacing-m);
    align-items: center;
    justify-self: self-start;
    padding: var(--leo-spacing-2xl) 20px;
  }
</style>

<script lang="ts">
  import '../tokens/css/variables.css'
</script>

<style>
  .layout { 
    padding: 30px;
    background: var(--color-page-background);
    color: var(--color-text-primary);
  }

  h2 {
    font-family: Arial, Helvetica, sans-serif;
  }
</style>

<div class="layout">
  <h2>User preference</h2>
  <slot />
</div>

<div class="layout" data-theme="light">
  <h2>Light</h2>
  <slot />
</div>

<div class="layout" data-theme="dark">
  <h2>Dark</h2>
  <slot />
</div>

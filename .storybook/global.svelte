<script lang="ts">
  import AlertCenter from '../src/components/alert/alertCenter.svelte'
  import '../tokens/css/variables.css'
</script>

<AlertCenter />

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

<style>
  .layout {
    padding: 30px;
    background: var(--leo-color-container-background);
    color: var(--leo-color-text-primary);
    font: var(--leo-font-primary-default-regular);
  }

  h2 {
    font-family: Arial, Helvetica, sans-serif;
  }
</style>

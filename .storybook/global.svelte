<script lang="ts">
  import AlertCentre from '../src/components/alert/alertCentre.svelte'
  import '../tokens/css/variables.css'
</script>

<AlertCentre />

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
    background: var(--leo-color-page-background);
    color: var(--leo-color-text-primary);
  }

  h2 {
    font-family: Arial, Helvetica, sans-serif;
  }
</style>

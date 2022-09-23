<script lang="ts">
  import '../build/css/variables.css'
</script>

<style>
  .layout { 
    padding: 30px;
    background: var(--color-gray-20);
    color: var(--color-gray-80);
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

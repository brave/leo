<script lang="ts">
  import '../build/css/variables.css'
</script>

<style>
  .layout { 
    padding: 30px;
    background: var(--color-gray-20);
    color: var(--color-gray-80);
  }
</style>

<div class="layout"><slot /></div>

<script lang="ts">
  export let name: string
  export let explanation: string
</script>

<li>
  <span class="slot">{name}</span> - {explanation}
  <slot />
</li>

<style>
  li {
    margin-top: var(--leo-spacing-xl);
  }
  .slot {
    font: var(--leo-font-default-semibold);
  }
</style>

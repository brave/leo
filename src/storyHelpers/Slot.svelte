<script lang="ts">
  export let name: string
  export let explanation: string
</script>

<li>
  <span class="slot">{name}</span> - {explanation}
  <slot />
</li>

<style>
  .slot {
    font: var(--leo-font-primary-default-semibold);
  }
</style>

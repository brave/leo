<script lang="ts">
  export let description: string
</script>

<h3>Slots</h3>
<div>
  {description}
  <ul>
    <slot />
  </ul>
</div>

<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let currentValue: string | number | any
  export let value: string | number | any
  export let name: string

  const dispatch = createEventDispatcher()

  function changed(e) {
    if (!e.target.checked) return

    currentValue = value
    dispatch('changed', { value })
  }
</script>

<label class="leo-radioButton">
  <input
    type="radio"
    {name}
    checked={currentValue === value}
    on:change={changed}
  />
  <slot>{value}</slot>
</label>

<style lang="scss">
  .leo-radioButton {
  }
</style>

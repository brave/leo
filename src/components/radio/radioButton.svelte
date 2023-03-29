<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let currentValue: string | number | any
  export let value: string | number | any
  export let name: string

  const tagName = 'leo-radiobutton'
  const dispatch = createEventDispatcher()

  function changed(e) {
    if (!e.target.checked) return

    // If we're in a custom element, make sure we update all the
    // other elements in our group, to make the behavior the same
    // as the built in radio.
    const maybeElement = e.target.getRootNode()?.host
    if (maybeElement && maybeElement.tagName === tagName.toUpperCase()) {
      // Note: We query the rootNode containing the element so we work
      // even when our element is contained inside another shadowRoot.
      const elements = maybeElement
        .getRootNode()
        .querySelectorAll(`${tagName}[name=${name}]`)
      for (const el of elements) el.currentValue = value
    }

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

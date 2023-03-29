<script lang="ts" context="module">
  export let sizes = ['small', 'normal'] as const
  export type Sizes = (typeof sizes)[number]

  const transition = { duration: 120 }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { fade } from 'svelte/transition'
  import Icon from '../icon/icon.svelte'

  export let currentValue: string | number | any
  export let value: string | number | any
  export let name: string
  export let size: Sizes = 'normal'

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

<label class="leo-radioButton" class:small={size === 'small'}>
  <div class="check">
    <input
      type="radio"
      {name}
      checked={currentValue === value}
      on:change={changed}
    />
    {#if currentValue === value && currentValue}
      <div transition:fade={transition}>
        <Icon name="radio-checked" />
      </div>
    {:else}
      <div transition:fade={transition}>
        <Icon name="radio-unchecked" />
      </div>
    {/if}
  </div>
  <slot>{value}</slot>
</label>

<style lang="scss">
  :host {
    display: inline-block;
  }

  .leo-radioButton {
    --icon-size: var(--leo-radiobutton-icon-size, 20px);

    display: flex;
    flex-direction: row;
    gap: var(--leo-spacing-4);
  }

  .leo-radioButton.small {
    --icon-size: var(--leo-radiobutton-small-icon-size, 16px);
  }

  .leo-radioButton .check {
    position: relative;
    width: var(--icon-size);
    height: var(--icon-size);
    --leo-icon-size: var(--icon-size);

    > input {
      opacity: 0;
    }

    > div {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
</style>

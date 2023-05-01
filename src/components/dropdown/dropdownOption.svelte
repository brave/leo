<script lang="ts">
  import { afterUpdate } from "svelte"

  export let value: { value: string; el: Node };

  let content: HTMLButtonElement

  afterUpdate(() => {
    console.log(value)
    // Clear the content of the element. As this only runs after an update it
    // should only be run if the value/template changes.
    content.innerHTML = ''

    // If we have no content, just render the value
    if (value.el.childNodes?.length === 0) {
        content.innerText = value.value;
        return
    }

    content.append(value.el.cloneNode(true))

    // // Otherwise, we need to clone the child nodes of the option, to make sure
    // // they're rendered in the right place.
    // for (const child of value.el.cloneNode(true).childNodes) {
    //     content.append(child)
    // }
  })
</script>

<button class="popup-item" on:click bind:this={content}>
</button>

<style lang="scss">
  .popup-item {
    all: unset;

    padding: var(--leo-spacing-16);
    transition: background var(--transition-duration) ease-in-out,
      color var(--transition-duration) ease-in-out;

    &:hover {
      background: var(--leo-color-container-interactive-background);
      color: var(--leo-color-text-interactive);
    }

    &:active {
      background: var(--leo-color-primary-20);
      color: var(--leo-color-text-interactive);
    }

    &:focus-visible {
      /** Our glow won't be visible if it's outside the parent, so shrink the
        * padding a little bit so the glow fits inside */
      --glow-size: 3px;
      padding: calc(var(--leo-spacing-16) - var(--glow-size));
      margin: var(--glow-size);

      border-radius: var(--leo-spacing-8);
      box-shadow: 0px 0px 0px 1.5px rgba(255, 255, 255, 0.5),
        0px 0px 4px 2px #423eee;
    }
  }
</style>

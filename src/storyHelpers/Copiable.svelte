<script>
  import Label from '../components/label/label.svelte'
  import Icon from '../components/icon/icon.svelte'

  export let text = ''

  const handleClick = async ({ currentTarget }) => {
    await navigator.clipboard.writeText(text)
    currentTarget.classList.add('isCopied')
    setTimeout(() => {
      currentTarget.classList.remove('isCopied')
    }, 1000)
  }
</script>

<button title={text} on:click={handleClick}>
  <span class="copy"><Icon name="copy" /></span>
  <span class="copied">
    <Label color="green" mode="loud">
      <Icon name="check-circle-filled" slot="icon-after" />
      Copied!
    </Label>
  </span>
  <slot />
</button>

<style>
  button {
    margin: 0;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    position: relative;
  }

  .copy {
    position: absolute;
    z-index: 1;
    top: 10px;
    right: 10px;
    color: rgb(193 209 209);
    mix-blend-mode: difference;
    opacity: 0.75;
    transition: opacity 0.13s ease-out;
  }

  button:hover .copy {
    opacity: 0.25;
  }

  .copied {
    position: absolute;
    z-index: 1;
    top: 10px;
    right: 10px;
    opacity: 0;
    transition: opacity 0.13s ease-out;
  }

  button:global(.isCopied) .copy {
    opacity: 0;
  }

  button:global(.isCopied) .copied {
    opacity: 1;
  }
</style>

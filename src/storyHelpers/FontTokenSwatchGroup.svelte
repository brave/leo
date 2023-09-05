<script>
  import Label from '../components/label/label.svelte'
  import Icon from '../components/icon/icon.svelte'

  export let level = 1
  export let name = ''
  export let tokens

  const headingTag = `h${level}`

  const getTokens = (obj) =>
    Object.entries(obj).filter((i) => i[0] !== 'toString')

  const handleClick = async ({ currentTarget }) => {
    await navigator.clipboard.writeText(currentTarget.title)
    currentTarget.classList.add('isCopied')
    setTimeout(() => {
      currentTarget.classList.remove('isCopied')
    }, 1000)
  }

  const filteredTokens = getTokens(tokens)
</script>

<svelte:element this={name ? 'section' : 'div'} id={name}>
  {#if name}
    <svelte:element this={headingTag} class="group-heading"
      >{name}</svelte:element
    >
  {/if}

  {#if typeof filteredTokens[0][1] === 'string'}
    <div class="font-group">
      {#each filteredTokens as [name, token]}
        <svelte:element this={`h${level + 1}`} class="group-heading"
          >{name}</svelte:element
        >
        <button
          title={token}
          class="font"
          style="--swatch-bg:{token}"
          on:click={handleClick}
        >
          <span class="copied">
            <Label color="green" mode="loud">
              <Icon name="check-circle-filled" />
              Copied!
            </Label>
          </span>
          <span class="sample" style="font: {token}">Keep it bravey.</span>
        </button>
      {/each}
    </div>
  {:else}
    {#each filteredTokens as [name, tokens]}
      {#if typeof tokens !== 'string'}
        <svelte:self {name} {tokens} level={level + 1} />
      {:else if ['white', 'black'].includes(name)}
        <svelte:self {name} tokens={{ [name]: tokens }} level={level + 1} />
      {/if}
    {/each}
  {/if}
</svelte:element>

<style>
  .group-heading {
    text-transform: capitalize;
    margin: 0 0 0.5rem;
  }

  .font-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-bottom: 1rem;
  }

  .font {
    display: flex;
    font-size: 0.75rem;
    color: var(--leo-color-text-primary);
    gap: 0.5rem;
    margin: 0;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    position: relative;
  }

  .font .sample {
    background: var(--leo-color-page-background);
    width: 100%;
    padding: 2rem;
  }

  .font .copied {
    position: absolute;
    right: 30%;
    opacity: 0;
    transition: opacity 0.13s ease-out;
  }

  .font:global(.isCopied) .copied {
    opacity: 1;
  }
</style>

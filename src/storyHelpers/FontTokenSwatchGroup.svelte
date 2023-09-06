<script>
  import Copiable from "./Copiable.svelte"

  export let level = 1
  export let name = ''
  export let tokens

  const headingTag = `h${level}`

  const getTokens = (obj) =>
    Object.entries(obj).filter((i) => i[0] !== 'toString')

  const filteredTokens = getTokens(tokens)
</script>

<svelte:element this={name ? 'section' : 'div'} id={name}>
  {#if name}
    <svelte:element this={headingTag} class="group-heading">
      {name}
    </svelte:element>
  {/if}

  {#if typeof filteredTokens[0][1] === 'string'}
    <div class="font-group">
      {#each filteredTokens as [name, token]}
        <svelte:element this={`h${level + 1}`} class="group-heading"
          >{name}</svelte:element
        >
        <Copiable text={token}>
          <span class="font-sample" style="font: {token}">Keep it bravey.</span>
        </Copiable>
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

  .font-sample {
    display: flex;
    font-size: 0.75rem;
    color: var(--leo-color-text-primary);
    background: var(--leo-color-page-background);
    padding: 2rem;
  }
</style>

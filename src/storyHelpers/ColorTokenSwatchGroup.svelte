<script>
  import Copiable from './Copiable.svelte'

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
    <div class="color-swatch-group">
      {#each filteredTokens as [name, token]}
        <Copiable text={token}>
          <div class="color-swatch" style="--swatch-bg:{token}">
            <span class="sample" />
            {name}
          </div>
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
  }

  .color-swatch-group {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(50px, 150px));
    gap: 1rem;
    padding-bottom: 1rem;
  }

  .color-swatch {
    display: flex;
    flex-direction: column;
    align-items: center;
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

  .color-swatch .sample {
    display: block;
    width: 100%;
    aspect-ratio: 1/1;
    background: var(--swatch-bg);
  }
</style>

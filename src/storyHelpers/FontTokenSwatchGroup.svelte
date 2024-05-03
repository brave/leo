<script>
  import Copiable from './Copiable.svelte'

  export let level = 1
  export let name = ''
  export let tokens

  const headingTag = `h${level}`

  const getTokens = (obj) =>
    !Array.isArray(obj)
      ? Object.entries(obj).filter((i) => i[0] !== 'toString')
      : obj.filter((i) => i[0] !== 'toString')

  const filteredTokens = getTokens(tokens)
</script>

<svelte:element
  this={name ? 'section' : 'div'}
  id={name}
  class="section section-{level}"
>
  {#if name}
    <svelte:element this={headingTag} class="group-heading">
      {name}
    </svelte:element>
  {/if}

  {#each filteredTokens as [name, token]}
    {#if typeof token === 'string'}
      <div class="font-group">
        <Copiable text={token}>
          <div class="font-sample">
            <svelte:element
              this={`h${level + 1}`}
              class="group-heading"
              style="--heading-color: var(--leo-color-text-tertiary); opacity: 0.75;"
            >
              {name}
            </svelte:element>
            <span style="font: {token}">Keep it bravey.</span>
          </div>
        </Copiable>
      </div>
    {:else}
      <svelte:self {name} tokens={token} level={level + 1} />
    {/if}
  {/each}
</svelte:element>

<style>
  .section {
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--leo-color-divider-subtle);
    margin-bottom: 3rem;
  }

  .section:last-of-type {
    padding-bottom: 0;
    border-bottom: none;
    margin-bottom: 0;
  }

  .group-heading {
    text-transform: capitalize;
    margin: 0 0 0.5rem;
    color: var(--heading-color, inherit);
  }

  .font-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-bottom: 1rem;
  }

  .font-sample {
    display: flex;
    flex-direction: column;
    align-items: start;
    font-size: 0.75rem;
    color: var(--leo-color-text-primary);
    background: var(--leo-color-page-background);
    padding: 2rem;
  }
</style>

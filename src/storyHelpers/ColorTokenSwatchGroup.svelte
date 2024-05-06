<script>
  import Copiable from './Copiable.svelte'
  import ConditionalSwatchGroup from './ConditionalSwatchGroup.svelte'

  export let level = 1
  export let name = ''
  export let tokens
  export let swatchSize = 150

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

  <ConditionalSwatchGroup
    {swatchSize}
    shouldWrap={filteredTokens.every((t) => typeof t[1] === 'string')}
  >
    {#each filteredTokens as [name, token]}
      {#if typeof token === 'string'}
        <ConditionalSwatchGroup {swatchSize} shouldWrap={level === 1}>
          <Copiable text={token}>
            <div class="color-swatch" style="--swatch-bg:{token}">
              <span class="sample" />
              {name}
            </div>
          </Copiable>
        </ConditionalSwatchGroup>
      {:else}
        <svelte:self {name} {swatchSize} tokens={token} level={level + 1} />
      {/if}
    {/each}
  </ConditionalSwatchGroup>
</svelte:element>

<style>
  .section-2 {
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--leo-color-divider-subtle);
    margin-bottom: 3rem;
  }

  .section-2:last-of-type {
    padding-bottom: 0;
    border-bottom: none;
    margin-bottom: 0;
  }

  .group-heading {
    text-transform: capitalize;
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
    box-shadow: var(--leo-effect-elevation-01);
    border-radius: var(--leo-radius-m);
    overflow: hidden;
    padding-bottom: 0.5rem;
  }

  .color-swatch .sample {
    display: block;
    width: 100%;
    aspect-ratio: 1/1;
    background: var(--swatch-bg);
  }
</style>

<script lang="ts">
  import type { SvelteHTMLElements } from 'svelte/elements'

  type ExcludedProps = 'class' | 'href' | 'aria-disabled'
  type $$Props = Omit<Partial<SvelteHTMLElements['a']>, ExcludedProps> & {
    isDisabled?: boolean
    href: string
  }

  export let href: string
  export let isDisabled: boolean = false
</script>

<a
  rel="noopener"
  {...$$restProps}
  {href}
  class="nala-link"
  class:disabled={isDisabled}
  aria-disabled={isDisabled}
  on:click={(e) => {
    if (isDisabled) e.preventDefault()
  }}
>
  <slot />
</a>

<style lang="scss">
  a {
    all: unset;

    --color: var(--nl-link-color, var(--nl-color-text-interactive));
    --hover-color: var(--nl-link-hover-color, var(--nl-color-primary-60));
    --visited-color: var(--nl-link-visited-color, var(--nl-color-pink-50));
    --disabled-color: var(
      --nl-link-disabled-color,
      var(--nl-color-text-disabled)
    );
    --focus-color: var(--nl-link-focus-color, var(--color));
    --focus-shadow: var(--nl-link-focus-shadow, var(--nl-effect-focus-state));

    color: var(--color);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    text-decoration: underline;

    &:hover {
      color: var(--hover-color);
    }

    &:visited:not(:hover) {
      color: var(--visited-color);
    }

    &:focus-visible:not(.disabled) {
      color: var(--focus-color);
      box-shadow: var(--focus-shadow);
    }

    &.disabled {
      color: var(--disabled-color);
      pointer-events: none;
    }
  }
</style>

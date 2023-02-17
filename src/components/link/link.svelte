<svelte:options tag="leo-link" />

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
  class="leo-link"
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

    --color: var(--leo-link-color, var(--leo-color-text-interactive));
    --hover-color: var(--leo-link-hover-color, var(--leo-color-primary-60));
    --visited-color: var(--leo-link-visited-color, var(--leo-color-pink-50));
    --disabled-color: var(
      --leo-link-disabled-color,
      var(--leo-color-text-disabled)
    );
    --focus-color: var(--leo-link-focus-color, var(--color));
    --focus-shadow: var(--leo-link-focus-shadow, var(--leo-effect-focus-state));

    color: var(--color);
    font: var(--leo-font-text-default-semibold);
    cursor: pointer;
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

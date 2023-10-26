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
      outline: none;
      box-shadow: var(--focus-shadow);
      border-radius: var(--leo-radius-xs);
    }

    &.disabled {
      color: var(--disabled-color);
      pointer-events: none;
    }
  }
</style>

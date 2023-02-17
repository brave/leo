<svelte:options tag="leo-button" />

<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { SvelteHTMLElements } from 'svelte/elements'
  import type * as Props from './props'

  // This black magic comes from this thread:
  // https://github.com/sveltejs/language-tools/issues/442#issuecomment-1278618531
  //
  // To quote that thread - This is "absolute bonkers!"
  //
  // It's interesting, minor variations which I would expect to work on don't,
  // and this is the only combination which seems to do what we want and I'm not
  // clear on why. You're welcome to try other approaches here.
  //
  // Tips, for if things aren't working right:
  // 1) npm run gen-types
  // 2) Reload your VSCode Window (sometimes the Svelte Type Checker struggles).
  // 3) Make sure any script tags on your component have a `lang="ts"` attribute.
  type Href = $$Generic<string | undefined>
  type Disabled = $$Generic<undefined extends Href ? boolean : undefined>
  type ExcludedProps = 'size' | 'href' | 'hreflang'

  interface CommonProps {
    kind?: Props.ButtonKind
    size?: Props.ButtonSize
    isLoading?: boolean
  }

  type ButtonProps = CommonProps &
    Omit<Partial<SvelteHTMLElements['button']>, ExcludedProps> & {
      isDisabled?: Disabled
      href?: never
    }

  type LinkProps = CommonProps &
    Omit<Partial<SvelteHTMLElements['a']>, ExcludedProps> & {
      href: Href
    }

  type $$Props = LinkProps | ButtonProps

  export let kind: Props.ButtonKind = 'primary'
  export let size: Props.ButtonSize = 'medium'
  export let isLoading: boolean = false
  export let isDisabled: Disabled = undefined
  export let href: Href = undefined

  $: tag = href ? 'a' : ('button' as 'a' | 'button')

  const dispatch = createEventDispatcher()

  /**
   * Optional click handler
   */
  function onClick(event) {
    dispatch('click', event)
  }
</script>

<svelte:element
  this={tag}
  href={href || undefined}
  disabled={isDisabled || undefined}
  class="leoButton"
  class:isPrimary={kind === 'primary'}
  class:isSecondary={kind === 'secondary'}
  class:isTertiary={kind === 'tertiary'}
  class:isHero={kind === 'hero'}
  class:isLarge={size === 'large'}
  class:isMedium={size === 'medium'}
  class:isSmall={size === 'small'}
  class:isLoading
  on:click={onClick}
  {...$$restProps}
>
  <slot>Leo Button</slot>
</svelte:element>

<style lang="scss">
  // Main styles and states
  .leoButton {
    // Gradients cannot have a transition, so we need to reset `transition`
    // to only apply to `box-shadow` and `border-color` in .isHero
    --default-transition: box-shadow 0.12s ease-in-out, color 0.12s ease-in-out,
      border-color 0.12s ease-in-out, opacity 0.12s ease-in-out;
    --box-shadow-hover: var(--leo-effect-elevation-02);
    display: block;
    cursor: pointer;
    transition: background 0.12s ease-in-out, var(--default-transition);
    box-shadow: none;
    border: solid var(--border-width, 0px) var(--border-color, transparent);
    border-radius: var(--leo-radius-full);
    background: var(--bg);
    color: var(--color);
    text-decoration: none;

    &:not(:disabled) {
      &:hover,
      [data-is-button-target]:hover :host .leoButton,
      [data-is-button-target]:hover .leoButton {
        background: var(--bg-hover, var(--bg));
        color: var(--color-hover, var(--color));
        box-shadow: var(--box-shadow-hover);
        border-color: var(--border-color-hover, var(--border-color));
      }

      &:active {
        background: var(--bg-active, var(--bg));
        color: var(--color-active, var(--color-hover, var(--color)));
      }

      &:focus-visible {
        outline: none;
        color: var(--color-focus, var(--color));
        box-shadow: var(--leo-effect-focus-state);
        background: var(--bg-focus, var(--bg));
        border-color: var(--border-color-focus, var(--border-color));
      }
    }
  }

  // State Definitions
  .leoButton.isLoading {
    opacity: 0.75;
    background: var(--bg-loading, var(--bg));
    color: var(--color-loading, var(--color));
  }
  :host:disabled .leoButton,
  .leoButton:disabled {
    background: var(--bg-disabled, var(--bg));
    opacity: 0.5;
  }

  // Size Variations
  .leoButton.isSmall {
    --icon-size: 20px;
    font: var(--leo-font-components-button-small);
    padding: 8px 14px;
  }
  .leoButton.isMedium {
    --icon-size: 24px;
    font: var(--leo-font-components-button-default);
    padding: 10px 16px;
  }
  .leoButton.isLarge {
    --icon-size: 24px;
    font: var(--leo-font-components-button-large);
    padding: 12px 20px;
  }

  // Kind Variations
  .leoButton.isPrimary {
    --bg: var(--leo-color-interaction-button-primary-background);
    --bg-hover: var(--leo-color-light-primary-60);
    --bg-active: var(--bg-hover);
    --bg-focus: var(--bg);
    --bg-loading: var(--leo-color-light-primary-70);
    --bg-disabled: var(--leo-color-gray-30);
    --color: white;

    @theme (dark) {
      --bg-hover: var(--leo-color-dark-primary-40);
      --bg-active: var(--leo-color-dark-primary-40);
      --bg-loading: var(--leo-color-dark-primary-60);
    }
  }
  .leoButton.isSecondary {
    --bg: transparent;
    --bg-active: --leo-color-gray-20;
    --color: var(--leo-color-text-primary);
    --color-hover: var(--leo-color-text-interactive);
    --color-focus: var(--leo-color-text-primary);
    --color-loading: var(--leo-color-gray-70);
    --border-width: 1px;
    --border-color: var(--leo-color-divider-strong);
    --border-color-focus: transparent;

    &:disabled {
      opacity: 0.5;
    }

    @theme (dark) {
      --border-color-hover: var(--leo-color-dark-primary-40);
    }
  }
  .leoButton.isTertiary {
    border-radius: 8px;
    padding-right: 0;
    padding-left: 0;
    --color: var(--leo-color-text-interactive);
    --color-hover: var(--leo-color-primary-60);
    --color-active: var(--leo-color-primary-90);
    --color-loading: var(--leo-color-primary-50);
    --box-shadow-hover: none;

    &:disabled {
      --color: var(--leo-color-light-text-secondary);

      @theme (dark) {
        --color: var(--leo-color-dark-text-primary);
      }
    }
  }
  .leoButton.isHero {
    transition: var(--default-transition);
    --bg: transparent;
    --bg-focus: var(--bg);
    --bg-disabled: var(--leo-color-gray-30);
    --color: white;
    --default-bg-opacity: 1;

    position: relative;
    z-index: 0;

    &::before,
    &::after {
      content: '';
      pointer-events: none;
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border-radius: var(--leo-radius-full);
    }

    &::before {
      transition: var(--default-transition);
      z-index: -1;
      background: var(--leo-gradient-hero);
      opacity: var(--default-bg-opacity);
    }

    &::after {
      z-index: -2;
      background: linear-gradient(
        101.5deg,
        #770eaa 21.56%,
        #b72070 74.97%,
        #e6461e 104.58%
      );
    }

    &:hover {
      --default-bg-opacity: 0;
    }
  }
</style>

<script lang="ts">
  import type { SvelteHTMLElements } from 'svelte/elements'
  import type * as Props from './props'
  import ProgressRing from '../progress/progressRing.svelte'

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
    fab?: boolean
    onClick?: () => void
  }

  type NalaButtonProps = CommonProps &
    Omit<Partial<SvelteHTMLElements['button']>, ExcludedProps> & {
      isDisabled?: Disabled
      isLoading?: boolean
      href?: never
    }

  type NalaLinkProps = CommonProps &
    Omit<Partial<SvelteHTMLElements['a']>, ExcludedProps> & {
      href: Href
    }

  type $$Props = NalaLinkProps | NalaButtonProps

  export let kind: Props.ButtonKind = 'filled'
  export let size: Props.ButtonSize = 'medium'
  export let isLoading: boolean = false
  export let isDisabled: Disabled = undefined
  export let href: Href = undefined
  export let fab = false

  export let onClick: () => void = undefined

  $: tag = href ? 'a' : ('button' as 'a' | 'button')
</script>

<svelte:element
  this={tag}
  href={href || undefined}
  class="leoButton"
  class:isFilled={kind === 'filled'}
  class:isOutline={kind === 'outline'}
  class:isPlain={kind === 'plain'}
  class:isPlainFaint={kind === 'plain-faint'}
  class:isHero={kind === 'hero'}
  class:isJumbo={size === 'jumbo'}
  class:isLarge={size === 'large'}
  class:isMedium={size === 'medium'}
  class:isSmall={size === 'small'}
  class:isTiny={size === 'tiny'}
  class:fab
  class:isLoading
  disabled={isLoading || isDisabled || undefined}
  on:click={onClick}
  {...$$restProps}
>
  {#if isLoading}
    <div class:content={!fab}>
      {#if $$slots.loading}
        <slot name="loading" />
      {:else if !fab}
        <slot>Leo Button</slot>
      {/if}
    </div>
    <ProgressRing />
  {:else}
    <slot name="icon-before" />
    <div class:content={!fab}>
      <slot>Leo Button</slot>
    </div>
    <slot name="icon-after" />
  {/if}
</svelte:element>

<style lang="scss">
  :host {
    display: inline-block;
    flex-grow: 1;
  }
  :host button {
    width: 100%;
  }

  .leoButton {
    /**
     * These are not literally the foreground/background of the button, but
     * rather the base colors, which will be remixed to make generate the
     * button color palette.
     */
    --foreground: var(--leo-color-text-primary);
    --background: var(--leo-color-container-background);

    --primary-color: var(
      --leo-button-color,
      var(--leo-color-button-background)
    );
    --mixed-primary-color: var(--primary-color);
  }

  // Main styles and states
  .leoButton,
  .leoButton:visited:not(:hover) {
    // Gradients cannot have a transition, so we need to reset `transition`
    // to only apply to `box-shadow` and `border-color` in .isHero
    --default-transition: box-shadow 0.12s ease-in-out, color 0.12s ease-in-out,
      border-color 0.12s ease-in-out, opacity 0.12s ease-in-out;
    --box-shadow-hover: var(--leo-effect-elevation-02);
    --box-shadow-focus: var(--leo-effect-focus-state);
    --radius: 0;
    --border-color: transparent;
    --border-width: 0px;
    --leo-icon-color: var(--icon-color);
    --leo-progressring-size: var(--leo-icon-size);
    --leo-progressring-color: var(--icon-color);

    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    transition:
      background 0.12s ease-in-out,
      var(--default-transition);
    box-shadow: none;
    border: solid var(--border-width, 1px) var(--border-color, transparent);
    border-radius: var(--leo-button-radius, var(--radius));
    background: var(--bg);
    color: var(--color);
    text-decoration: none;
    padding: var(--leo-button-padding, calc(var(--padding-y) - var(--border-width)) var(--padding-x));
    max-height: max-content;

    &.fab {
      max-width: max-content;
    }

    .content {
      padding: 0 var(--icon-gap);
    }

    /*
     * Should only be necessary for Tailwind consumers where there's
     * no guarantee that the button will contain a child element.
     */
    &:not(:has(> *)) {
      padding-left: var(--leo-button-padding, calc(var(--padding-x) + var(--icon-gap)));
      padding-right: var(--leo-button-padding, calc(var(--padding-x) + var(--icon-gap)));
    }
  }

  .leoButton:not(:disabled) {
    &:hover,
    [data-is-button-target]:hover :host .leoButton,
    [data-is-button-target]:hover .leoButton {
      --leo-icon-color: var(--icon-hover-color, var(--icon-color));
      --mixed-primary-color: var(--leo-color-primitive-primary-70);

      /** If we support the color-mix syntax, infer the hover color */
      @supports (color: color-mix(in srgb, transparent, transparent)) {
        --mixed-primary-color: color-mix(
          in srgb,
          var(--primary-color),
          var(--foreground) 20%
        );
      }

      background: var(--bg-hover, var(--bg));
      color: var(--color-hover, var(--color));
      box-shadow: var(--box-shadow-hover);
      border-color: var(--border-color-hover, var(--border-color));
    }

    &:active {
      opacity: 0.75;
      background: var(--bg-active, var(--bg));
      color: var(--color-active, var(--color-hover, var(--color)));
    }

    &:focus-visible {
      outline: none;
      color: var(--color-focus, var(--color));
      box-shadow: var(--box-shadow-focus);
      background: var(--bg-focus, var(--bg));
      border-color: var(--border-color-focus, var(--border-color));
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
    cursor: auto;
  }
  :host:disabled .leoButton:not(.isLoading),
  .leoButton:disabled:not(.isLoading) {
    --icon-color: var(--leo-color-icon-disabled);
    background: var(--bg-disabled, var(--bg));
    color: var(--leo-color-text-disabled);
    border-color: var(--leo-color-button-disabled);
  }

  // Size Variations
  .leoButton.isTiny {
    font: var(--leo-font-components-button-small);
    min-height: 28px;
    --padding-y: var(--leo-spacing-s);
    --padding-x: var(--leo-spacing-m);
    --radius: var(--leo-radius-m);
    --leo-icon-size: var(--leo-icon-xs);
    --icon-gap: var(--leo-spacing-m);

    &.fab {
      min-height: 0;
      --padding-x: 6px;
      --padding-y: 6px;
    }
  }
  .leoButton.isSmall {
    font: var(--leo-font-components-button-small);
    min-height: 36px;
    --padding-y: var(--leo-spacing-m);
    --padding-x: var(--leo-spacing-l);
    --radius: var(--leo-radius-m);
    --leo-icon-size: var(--leo-icon-s);
    --icon-gap: var(--leo-spacing-m);

    &.fab {
      min-height: 0;
      --padding-x: var(--leo-spacing-m);
    }
  }
  .leoButton.isMedium {
    font: var(--leo-font-components-button-default);
    min-height: 44px;
    --padding-y: var(--leo-spacing-l);
    --padding-x: var(--leo-spacing-xl);
    --radius: var(--leo-radius-l);
    --leo-icon-size: var(--leo-icon-m);
    --icon-gap: var(--leo-spacing-m);

    &.fab {
      min-height: 0;
      --padding-x: var(--leo-spacing-l);
      --padding-y: var(--leo-spacing-l);
    }
  }
  .leoButton.isLarge {
    font: var(--leo-font-components-button-large);
    min-height: 52px;
    --padding-y: var(--leo-spacing-l);
    --padding-x: var(--leo-spacing-xl);
    --radius: var(--leo-radius-xl);
    --leo-icon-size: var(--leo-icon-m);
    --icon-gap: 10px;

    &.fab {
      min-height: 0;
      --padding-x: var(--leo-spacing-xl);
      --padding-y: var(--leo-spacing-xl);
    }
  }
  .leoButton.isJumbo {
    font: var(--leo-font-components-button-jumbo);
    min-height: 60px;
    --padding-y: var(--leo-spacing-xl);
    --padding-x: var(--leo-spacing-xl);
    --radius: var(--leo-radius-xl);
    --leo-icon-size: var(--leo-icon-l);
    --icon-gap: var(--leo-spacing-l);

    &.fab {
      min-height: 0;
      --padding-x: 18px;
      --padding-y: 18px;
    }
  }

  // Kind Variations
  .leoButton.isFilled {
    --bg: var(--mixed-primary-color);
    --bg-disabled: var(--leo-color-button-disabled);
    --color: var(--leo-color-white);
    --icon-color: var(--color);
  }

  .leoButton.isOutline {
    --bg: transparent;
    --bg-active: --leo-color-gray-20;
    --primary-color: var(--leo-button-color, var(--leo-color-primitive-primary-60));
    --color: var(--mixed-primary-color);
    --border-width: 1px;
    --border-color: var(--leo-color-divider-interactive);
    --border-color-hover: var(--leo-color-primitive-primary-40);
    --border-color-focus: var(--leo-color-divider-interactive);

    @theme (dark) {
      --primary-color: var(--leo-button-color, var(--leo-color-primitive-primary-40));
      --border-color-hover: var(--leo-color-primitive-primary-60);
    }

    /** If we support color mix, infer border colors from primary color */
    @supports (color: color-mix(in srgb, transparent, transparent)) {
      --border-color: color-mix(
        in srgb,
        var(--primary-color),
        var(--background) 50%
      );
      --border-color-hover: var(--primary-color);
    }

    --box-shadow-focus: 0px 0px 0px 2px #423eee,
      0px 0px 0px 1px rgba(255, 255, 255, 0.3);
    --icon-color: var(--color);
  }
  .leoButton.isPlain {
    --primary-color: var(--leo-button-color, var(--leo-color-primitive-primary-60));
    --color: var(--mixed-primary-color);
    --box-shadow-hover: none;
    --bg-hover-mix: 5%;

    @theme (dark) {
      --primary-color: var(--leo-button-color, var(--leo-color-primitive-primary-40));
      --bg-hover-mix: 10%;
    }

    @supports (color: color-mix(in srgb, transparent, transparent)) {
      --bg-hover: color-mix(
        in srgb,
        var(--primary-color) var(--bg-hover-mix),
        var(--background)
      );
    }

    &:disabled:not(.isLoading) {
      --color: var(--leo-color-text-primary);
    }

    &.fab {
      --radius: var(--leo-radius-m);
      --bg-hover: transparent;
      --padding-y: 0;
      --padding-x: 0;
    }
  }
  .leoButton.isPlainFaint {
    --foreground: var(--leo-color-black);
    --primary-color: currentColor;
    --color: var(--mixed-primary-color);
    --box-shadow-hover: none;
    --icon-color: var(--mixed-primary-color);
    --bg-hover-mix: 5%;

    @theme (dark) {
      --foreground: var(--leo-color-white);
      --bg-hover-mix: 10%;
    }

    @supports (color: color-mix(in srgb, transparent, transparent)) {
      --icon-color: color-mix(
        in srgb,
        var(--primary-color),
        var(--background) 30%
      );

      --icon-hover-color: color-mix(
        in srgb,
        var(--icon-color),
        var(--foreground) 20%
      );

      position: relative;
      z-index: 0;

      // This pseudo-element is frustratingly necessary due to transitions mysteriously not working with our use of currentColor.
      &::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: -1;
        border-radius: var(--radius);
        background-color: color-mix(
          in srgb,
          var(--primary-color) var(--bg-hover-mix),
          transparent
        );
        transition: var(--default-transition);
        opacity: 0.001;
      }

      &:hover::before {
        opacity: 1;
      }
    }

    &.fab {
      --radius: var(--leo-radius-m);
      --bg-hover: transparent;
      --padding-y: 0;
      --padding-x: 0;

      &::before {
        content: unset;
      }
    }
  }
  .leoButton.isHero {
    transition: var(--default-transition);
    --bg: transparent;
    --bg-focus: var(--bg);
    --bg-disabled: var(--leo-color-button-disabled);
    --color: var(--leo-color-white);
    --icon-color: var(--leo-color-white);
    --default-bg-opacity: 1;

    position: relative;
    z-index: 0;

    &:not(:disabled:not(.isLoading)) {
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
        border-radius: var(--leo-button-radius, var(--radius));
      }

      &::before {
        transition: var(--default-transition);
        z-index: -1;
        background: var(--leo-gradient-hero);
        opacity: var(--default-bg-opacity);
      }

      &::after {
        z-index: -2;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), linear-gradient(174deg, #F50 2.32%, #F5002D 93.33%);
      }
    }

    &:hover:not(:disabled) {
      --default-bg-opacity: 0;
    }
  }

  .leoButton.fab {
    aspect-ratio: 1 / 1;
  }
</style>

<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import type { SvelteHTMLElements } from 'svelte/elements'
  import type { IconName } from '../../../icons/meta'
  import Icon from '../icon/icon.svelte'

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

  type CommonProps = {
    outsideList?: boolean
    icon?: IconName
  }

  type ButtonProps = CommonProps &
    Omit<Partial<SvelteHTMLElements['button']>, ExcludedProps> & {
      isDisabled?: Disabled
      isLoading?: boolean
      href?: never
    }

  type LinkProps = CommonProps &
    Omit<Partial<SvelteHTMLElements['a']>, ExcludedProps> & {
      href: Href
      isCurrent?: boolean
    }

  type $$Props = LinkProps | ButtonProps

  export let href: Href = undefined
  export let icon: IconName = undefined
  export let isLoading: boolean = false
  export let isDisabled: boolean = false
  export let isCurrent: boolean = window.location.pathname === href
  export let outsideList: boolean = false

  const checkIfCurrent = () => {
    isCurrent = window.location.pathname === href || window.location.hash === href;
  }

  $: tag = href ? 'a' : ('button' as 'a' | 'button')

  /**
   * Optional click handler
   */
  const dispatch = createEventDispatcher()
  function onClick(event) {
    dispatch('click', event)
  }

  onMount(() => {
    ;['pushState', 'replaceState'].forEach((name) => {
      const original = history[name]
      history[name] = function () {
        original.apply(history, arguments)
        checkIfCurrent()
      }
    })
  })
</script>

<svelte:window on:popstate={checkIfCurrent} on:hashchange={checkIfCurrent} />

<!-- Note that this doesn't currently work properly in WC land due to the nested dynamic elements -->
<svelte:element this={outsideList ? 'div' : 'li'} class="leo-navigation-item">
  <svelte:element
    this={tag}
    href={href || undefined}
    disabled={isLoading || isDisabled || undefined}
    on:click={onClick}
    {...$$restProps}
    class:isCurrent
  >
    {#if icon}
      <Icon name={icon} />
    {/if}
    <slot />
  </svelte:element>

  {#if $$slots.subnav}
    <slot name="subnav" />
  {/if}
</svelte:element>

<style lang="scss">
  .leo-navigation-item {
    --nav-item-color: var(--leo-color-text-secondary);
    --leo-icon-color: var(--leo-color-icon-default);
    --leo-icon-size: var(--leo-icon-s);

    a,
    button {
      all: unset;
      cursor: pointer;
      display: flex;
      width: 100%;
      box-sizing: border-box;
      gap: var(--leo-spacing-xl);
      align-items: center;
      height: 48px;
      padding-left: var(--leo-spacing-2xl);
      padding-right: var(--leo-spacing-m);
      border-radius: 0;
      outline: none;
      position: relative;
      text-decoration: none;

      font: var(--leo-font-components-button-default);
      color: var(--nav-item-color);

      &:hover {
        background: var(--leo-color-container-highlight);
      }

      &:focus-visible {
        box-shadow: var(--leo-effect-focus-state);
      }

      &.isCurrent {
        --nav-item-color: var(--leo-color-text-interactive);
        --leo-icon-color: var(--leo-color-icon-interactive);

        &::before {
          content: '';
          width: 4px;
          height: 76%;
          border-top-right-radius: var(--leo-radius-xs);
          border-bottom-right-radius: var(--leo-radius-xs);
          background: var(--leo-color-text-interactive);
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
</style>

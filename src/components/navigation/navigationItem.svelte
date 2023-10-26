<script lang="ts">
  import type { SvelteHTMLElements } from 'svelte/elements'
  import type { IconName } from '../../../icons/meta'
  import Icon from '../icon/icon.svelte'

  type Href = $$Generic<string | undefined>

  type $$Props = Omit<SvelteHTMLElements['a'], 'class' | 'href'> & {
    href: Href
    icon?: IconName
    isActive?: boolean
  }

  export let href: Href
  export let icon: IconName = undefined
  export let isActive: boolean = false
</script>

<li class="leo-navigation-item">
  <a {href} {...$$restProps} class:isActive>
    {#if icon}
      <Icon name={icon} />
    {/if}
    <slot />
  </a>

  {#if $$slots.subnav}
    <slot name="subnav" />
  {/if}
</li>

<style lang="scss">
  .leo-navigation-item {
    --color: var(--leo-color-text-secondary);
    --leo-icon-color: var(--leo-color-icon-default);

    a {
      cursor: pointer;
      display: flex;
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
      color: var(--color);

      &:hover {
        background: var(--leo-color-container-highlight);
      }

      &:focus-visible {
        box-shadow: var(--leo-effect-focus-state);
      }

      &.isActive {
        --color: var(--leo-color-text-interactive);
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

    :global(ul) {
      padding: var(--leo-spacing-m) 0 0;
      margin-left: 35px;
      border-left: 1px solid var(--leo-color-divider-subtle);
    }
  }
</style>

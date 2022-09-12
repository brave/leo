<svelte:options tag="leo-button" />

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type * as Props from './props'
  
  export let kind: Props.ButtonKind = "primary"
  export let size: Props.ButtonSize = "medium"
  export let isLoading: boolean = false
  export let isDisabled: boolean = false

  const dispatch = createEventDispatcher();

  /**
   * Optional click handler
   */
  function onClick(event) {
    dispatch('click', event);
  }
</script>

<style lang="scss">
  // Main styles and states
  .leoButton {
    --box-shadow-hover: var(--effect-elevation-02);
    cursor: pointer;
    transition: box-shadow .12s ease-in-out, color .12s ease-in-out;
    box-shadow: none;
    border: solid var(--border-width, 0px) var(--border-color, transparent);
    border-radius: var(--radius-full);
    background: var(--bg);
    color: var(--color);
    &:enabled {
      &:hover,
      [data-is-button-target]:hover :host .leoButton,
      [data-is-button-target]:hover .leoButton {
        background: var(--bg-hover, var(--bg));
        color: var(--color-hover, var(--color));
        // TODO(petemill): These elevation variables are weird
        box-shadow: var(--box-shadow-hover);
      }
      &:active {
        background: var(--bg-active, var(--bg));
        color: var(--color-active, var(--color-hover, var(--color)));
      }
      &:focus-visible {
        outline: none;
        box-shadow: 0px 0px 0px 1.7px rgba(255, 255, 255, 0.75), 1px 1px 4px 2px rgba(95, 103, 215, 0.75), -1px -1px 4px 2px rgba(255, 71, 36, 0.75);
        background: var(--bg-focus, var(--bg));
      }
    }
  }

  .leoButton.isLoading {
    background: var(--bg-loading, var(--bg));
    color: var(--color-loading, var(--color));
  }
  :host[disabled] .leoButton,
  .leoButton[disabled] {
    background: var(--bg-disabled, var(--bg));
  }

  // Size Variations
  .leoButton.isSmall {
    --icon-size: 20px;
    font: var(--font-button-small);
    padding: 8px 14px;
  }
  .leoButton.isMedium {
    --icon-size: 24px;
    font: var(--font-button-default);
    padding: 12px 16px;
  }

  .leoButton.isLarge {
    --icon-size: 24px;
    font: var(--font-button-large);
    padding: 12px 16px;
  }

  // Kind Variations
  .leoButton.isPrimary {
    --bg: var(--color-primary-light-mode-80);
    --bg-hover: var(--color-primary-light-mode-90);
    --bg-active: var(--color-primary-light-mode-100);
    --bg-focus: var(--color-primary-light-mode-80);
    --bg-loading: var(--color-primary-light-mode-70);
    --bg-disabled: var(--color-gray-70);
    --color: white;
    @darkmode {
      --bg: var(--color-primary-dark-mode-50);
      --bg-hover: var(--color-primary-dark-mode-60);
      --bg-active: var(--color-primary-dark-mode-30);
      --bg-focus: var(--color-primary-dark-mode-50);
      --bg-loading: var(--color-primary-dark-mode-60);
    }
  }

  .leoButton.isSecondary {
    // TODO(petemill): Is transparent right or should it be explicitly white (and black)?
    --bg: transparent;
    --bg-active: --color-gray-20;
    --color: var(--color-gray-90);
    --color-hover: var(--color-primary-light-mode-70);
    --color-loading: var(--color-gray-70);
    --border-width: 1px;
    --border-color: var(--color-gray-30);
    &[disabled] {
      opacity: 0.5;
    }
    @darkmode {
      --bg: transparent;
      --color-hover: var(--color-primary-dark-mode-80);
    }
  }
  .isTertiary {
    border-radius: 8px;
    --color: var(--color-primary-70);
    --color-hover: var(--color-primary-80);
    --color-active: var(--color-primary-90);
    --color-loading: var(--color-primary-50);
    --box-shadow-hover: none;
  }
  .leoButton.isCTA {
    --bg: var(--gradient-gradient-cta);
    --color: white;
  }
</style>

<button 
  class="leoButton"
  class:isPrimary="{kind==="primary"}"
  class:isSecondary="{kind==="secondary"}"
  class:isTertiary="{kind==="tertiary"}"
  class:isCTA="{kind==="CTA"}"
  class:isLarge="{size === 'large'}"
  class:isMedium="{size === 'medium'}"
  class:isSmall="{size === 'small'}"
  class:isLoading="{isLoading}"
  disabled={isDisabled}
  on:click={onClick}
>
  <slot>Leo Button</slot>
</button>

<script lang="ts">
  import type { ButtonKind, ButtonSize } from './props'

  export let size: ButtonSize = 'medium'
  export let kind: ButtonKind = 'filled'
</script>

<button class="leo-button size-{size} {kind}">
  <slot />
</button>

<style lang="scss">
  .leo-button {
    --foreground: var(--leo-color-text-primary);
    --background: var(--leo-color-container-background);

    --primary-color: var(
      --leo-button-primary-color,
      var(--leo-color-button-background)
    );
    --mixed-primary-color: var(--primary-color);
    --secondary-color: var(--leo-button-secondary-color, var(--foreground));
    --mixed-secondary-color: var(--secondary-color);

    --bg: transparent;
    --text: transparent;
    --border: transparent;
    --radius: 0;
    --border-color: transparent;
    --border-width: 0;

    color: var(--text);
    background: var(--bg);
    padding: var(--leo-button-padding, var(--padding-y) var(--padding-x));
    border-radius: var(--leo-button-radius, var(--radius));
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--radius);

    display: flex;
    gap: var(--icon-gap);
    justify-content: center;
    align-items: center;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.12s ease-in-out;

    /* Button Reset */
    box-shadow: none;
    text-decoration: none;

    &:hover:not(:active) {
      --mixed-primary-color: color-mix(
        in srgb,
        var(--primary-color) 80%,
        var(--foreground) 20%
      );
      --mixed-secondary-color: color-mix(
        in srgb,
        var(--secondary-color) 80%,
        var(--foreground) 20%
      );
    }

    &:focus-visible {
      outline: none;
      box-shadow: var(--leo-effect-focus-state);
    }

    &:active {
      opacity: 0.9;
    }

    /* Size Variants */
    &.size-tiny {
      font: var(--leo-font-components-button-small);

      --padding-x: var(--leo-spacing-m);
      --padding-y: 6px;
      --radius: 14px;
      --leo-icon-size: 16px;
      --icon-gap: 8px;

      &.fab {
        --padding-x: 6px;
      }
    }

    &.size-small {
      font: var(--leo-font-components-button-small);
      --padding-y: 8px;
      --padding-x: 14px;
      --radius: 18px;
      --leo-icon-size: 18px;
      --icon-gap: 8px;

      &.fab {
        --padding-x: 8px;
      }
    }

    &.size-medium {
      font: var(--leo-font-components-button-default);
      --padding-y: 10px;
      --padding-x: 16px;
      --radius: 22px;
      --leo-icon-size: 20px;
      --icon-gap: 8px;

      &.fab {
        --padding-x: 12px;
        --padding-y: 12px;
      }
    }

    &.size-large {
      font: var(--leo-font-components-button-large);
      --padding-y: 15px;
      --padding-x: 30px;
      --radius: 26px;
      --leo-icon-size: 20px;
      --icon-gap: 10px;

      &.fab {
        --padding-x: 15px;
        --padding-y: 15px;
      }
    }

    &.size-jumbo {
      font: var(--leo-font-components-button-jumbo);
      --padding-y: 18px;
      --padding-x: 26px;
      --radius: 30px;
      --leo-icon-size: 24px;
      --icon-gap: 12px;

      &.fab {
        --padding-x: 18px;
      }
    }

    &.filled {
      --bg: var(--mixed-primary-color);
      --text: white;
    }

    &.outline {
      --border-color: color-mix(
        in srgb,
        var(--mixed-primary-color) 40%,
        var(--background)
      );
      --border-width: 1px;
      --text: var(--mixed-primary-color);

      &:hover {
        --border-color: color-mix(
          in srgb,
          var(--mixed-primary-color) 70%,
          var(--background)
        );
        --text: color-mix(
          in srgb,
          var(--mixed-primary-color) 80%,
          var(--foreground)
        );
      }
    }

    &.plain {
      --radius: 8px;
      --padding-x: 2px;
      --text: var(--mixed-primary-color);

      &:hover {
        --text: color-mix(in srgb, var(--mixed-primary-color) 50%, var(--foreground));
      }
    }

    &.plain-faint {
      --radius: 8px;
      --padding-x: 2px;
      --text: color-mix(
        in srgb,
        var(--mixed-secondary-color) 70%,
        var(--background)
      );

      &:hover {
        --text: color-mix(
          in srgb,
          var(--mixed-secondary-color) 80%,
          var(--foreground)
        );
      }
    }
  }
</style>

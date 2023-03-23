<script context="module" lang="ts">
  let iconBasePath = '/icons'
  export const setIconBasePath = (basePath: string) => (iconBasePath = basePath)
</script>

<script lang="ts">
  import type { IconNames, StringWithAutocomplete } from '../types'

  export let name: StringWithAutocomplete<IconNames> = undefined
  export let forceColor: boolean = false
  export let size: string = 'unset'
  export let color: string | undefined = 'unset'
  export let darkModeColor: string | undefined = 'unset'
  let hasColor =
    name?.endsWith('-color') || name?.startsWith('Country=') || forceColor
</script>

<div
  class="leoIcon"
  style:--size-override={size}
  style:--color-override={color}
  style:--dark-mode-color-override={darkModeColor}
>
  <slot>
    {#if name}
      <div
        class="icon"
        class:color={hasColor}
        style:--icon-url={`url('${iconBasePath}/${name}.svg')`}
      />
    {/if}
  </slot>
</div>

<style lang="scss">
  .leoIcon {
    --icon-size: var(--size-override, var(--leo-icon-size, 24px));

    --icon-light-mode-color: var(--color-override, currentColor);
    --icon-dark-mode-color: var(--dark-mode-color-override, currentColor);

    width: var(--icon-size);
    height: var(--icon-size);

    & .icon,
    svg {
      width: 100%;
      height: 100%;
    }

    /* Non color icons are set via a mask-image, so we can change the color
     * by setting the background */
    & .icon:not(.color) {
      background: var(--icon-light-mode-color);
      -webkit-mask-image: var(--icon-url);
      mask-image: var(--icon-url);
      mask-repeat: no-repeat;

      @media (prefers-color-scheme: dark) {
        background: var(--icon-dark-mode-color);
      }
    }

    /* Color icons need to be set via a background rather than a mask so we
     * don't remove the color */
    & .icon.color {
      background: var(--icon-url);
      background-repeat: no-repeat;
    }
  }
</style>

<script context="module" lang="ts">
  import isSSR from '../../svelteDirectives/isSSR'
  import { writable } from 'svelte/store'

  let lastIconBasePath = '/icons'
  let iconBasePath = writable(lastIconBasePath)

  export const setIconBasePath = (basePath: string) => {
    lastIconBasePath = basePath
    iconBasePath.set(basePath)
  }

  const getIconUrl = (basePath: string, name: string) =>
    `${basePath}/${name}.svg`

  // Not actually used by the component, but used to preload SVGs.
  const svgCache = {}
  export const preloadIcon = (name: IconName) => {
    // Note: We do this in a |requestIdleCallback| because we want to do this as
    // soon as possible, but we want to make sure the consumer has a chance to
    // call setIconBasePath before we go and preload the icons (or we'll get a
    // 404).
    if (isSSR) return

    window.requestIdleCallback?.(() => {
      const image = new Image()
      image.src = getIconUrl(lastIconBasePath, name)
      image.onerror = () => delete svgCache[image.src]

      // Store the image in our cache, so it isn't garbage collected.
      svgCache[image.src] = image
    })
  }
</script>

<script lang="ts">
  import type { IconName } from '../../../icons/meta'
  export let name: IconName = undefined
  export let forceColor: boolean = false
  export let title: string = undefined
  $: hasColor =
    name?.endsWith('-color') || name?.startsWith('country-') || forceColor
</script>

<div class="leoIcon" {title}>
  <slot>
    {#if name}
      <div
        class="icon"
        class:color={hasColor}
        style:--icon-url={`url('${getIconUrl($iconBasePath, name)}')`}
      />
    {/if}
  </slot>
</div>

<style lang="scss">
  .leoIcon {
    --icon-width: var(--leo-icon-width, var(--leo-icon-size, 24px));
    --icon-height: var(--leo-icon-height, var(--leo-icon-size, 24px));
    --icon-color: var(--leo-icon-color, currentColor);

    width: var(--icon-width);
    height: var(--icon-height);
    flex-shrink: 0;

    & .icon,
    :global svg {
      width: 100%;
      height: 100%;
    }

    /* Non color icons are set via a mask-image, so we can change the color
     * by setting the background */
    & .icon:not(.color) {
      background: var(--icon-color);
      -webkit-mask-image: var(--icon-url);
      mask-image: var(--icon-url);
      -webkit-mask-repeat: no-repeat;
      mask-repeat: no-repeat;
      -webkit-mask-position: center;
      mask-position: center;
    }

    /* Color icons need to be set via a background rather than a mask so we
     * don't remove the color */
    & .icon.color {
      background: var(--icon-url);
      background-repeat: no-repeat;
      background-position: center;
    }
  }
</style>

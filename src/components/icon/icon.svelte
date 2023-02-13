<svelte:options tag="leo-icon" />

<script context="module" lang="ts">
  let iconBasePath = '/icons'
  export const setIconBasePath = (basePath: string) => (iconBasePath = basePath)
</script>

<script lang="ts">
  export let name: string = undefined
  let hasColor = name?.endsWith('-color') || name?.startsWith('Country=')
</script>

<div class="leoIcon">
  <slot>
    <div
      class="icon"
      class:color={hasColor}
      style:--icon-url={`url('${iconBasePath}/${name}.svg')`}
    />
  </slot>
</div>

<style lang="scss">
  .leoIcon {
    --icon-width: var(--leo-icon-size, 24px);
    --icon-height: var(--leo-icon-size, 24px);

    width: var(--icon-width);
    height: var(--icon-height);

    & .icon,
    svg {
      width: 100%;
      height: 100%;
    }

    /* Non color icons are set via a mask-image, so we can change the color
     * by setting the background */
    & .icon:not(.color) {
      background: currentColor;
      -webkit-mask-image: var(--icon-url);
      mask-image: var(--icon-url);
      mask-repeat: no-repeat;
    }

    /* Color icons need to be set via a background rather than a mask so we
     * don't remove the color */
    & .icon.color {
      background: var(--icon-url);
      background-repeat: no-repeat;
    }
  }
</style>

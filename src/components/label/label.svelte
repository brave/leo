<script context="module" lang="ts">
  export const colors = [
    'gray',
    'secondary',
    'primary',
    'red',
    'yellow',
    'green',
    'blue',
    'purple',
    'pink',
    'teal'
  ] as const
  export type Color = (typeof colors)[number]

  export const modes = ['default', 'loud'] as const
  export type Mode = (typeof modes)[number]
</script>

<script lang="ts">
  export let mode: Mode = 'default'
  export let color: Color = 'gray'

  $: background =
    mode === 'loud' ? `var(--nl-color-${color}-50)` : 'transparent'

  $: text =
    mode === 'loud'
      ? `var(--nl-color-${color}-10)`
      : `var(--nl-color-${color}-50)`

  $: border = mode === 'loud' ? `transparent` : `var(--nl-color-${color}-50)`
</script>

<div
  class="nala-label"
  style:background
  style:color={text}
  style:border="1px solid {border}"
>
  <div class="content">
    <slot>Label</slot>
  </div>
</div>

<style lang="scss">
  :host {
    display: inline-block;
  }

  .nala-label {
    --icon-size: var(--nl-label-icon-size, 14px);
    --font-text: var(--nl-label-font-text, var(--nl-font-components-label));
    --padding: var(--nl-label-padding, 2px 3px);
    --radius: var(--nl-label-radius, 6px);

    --nl-icon-size: var(--icon-size);

    display: inline-block;
    border-radius: var(--radius);
    padding: var(--padding);
    font: var(--font-text);
  }

  .content {
    display: flex;
    flex-direction: row;
    gap: 4px;
    justify-content: space-between;
    align-items: center;
  }
</style>

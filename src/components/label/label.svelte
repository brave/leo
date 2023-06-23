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
    mode === 'loud' ? `var(--leo-color-${color}-50)` : 'transparent'

  $: text =
    mode === 'loud'
      ? `var(--leo-color-${color}-10)`
      : `var(--leo-color-${color}-50)`

  $: border = mode === 'loud' ? `transparent` : `var(--leo-color-${color}-50)`
</script>

<div
  class="leo-label"
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

  .leo-label {
    --icon-size: var(--leo-label-icon-size, 14px);
    --font-text: var(--leo-label-font-text, var(--leo-font-components-label));
    --padding: var(--leo-label-padding, 2px 3px);
    --radius: var(--leo-label-radius, 6px);

    --leo-icon-size: var(--icon-size);

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

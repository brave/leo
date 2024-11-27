<script context="module" lang="ts">
  export const colors = [
    'neutral',
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

  export const modes = ['default', 'loud', 'outline'] as const
  export type Mode = (typeof modes)[number]
</script>

<script lang="ts">
  export let mode: Mode = 'default'
  export let color: Color = 'neutral'

  $: background =
    mode === 'default'
      ? `var(--leo-color-${color}-10)`
      : mode === 'loud'
        ? `var(--leo-color-${color}-40)`
        : 'transparent'

  $: text =
    mode === 'default'
      ? `var(--leo-color-${color}-60)`
      : mode === 'loud'
        ? `var(--leo-color-white)`
        : `var(--leo-color-${color}-50)`

  $: border = mode === 'outline' ? `var(--leo-color-${color}-50)` : `transparent`
</script>

<div
  class="leo-label"
  style:background
  style:color={text}
  style:border="1px solid {border}"
>
  <slot name="icon-before" />
  <div class="content">
    <slot>Label</slot>
  </div>
  <slot name="icon-after" />
</div>

<style lang="scss">
  :host {
    display: inline-block;
  }

  .leo-label {
    --icon-size: var(--leo-label-icon-size, 14px);
    --font-text: var(--leo-label-font-text, var(--leo-font-components-label));
    --padding: var(--leo-label-padding, 0 var(--leo-spacing-s));
    --radius: var(--leo-label-radius, var(--leo-radius-s));

    --leo-icon-size: var(--icon-size);

    display: inline-flex;
    flex-direction: row;
    gap: var(--leo-spacing-xs);
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    border-radius: var(--radius);
    padding: var(--padding);
    font: var(--font-text);
    height: var(--leo-icon-m);
    text-transform: var(--leo-label-capitalization, uppercase);
  }

  .content {
    padding: 0 var(--leo-spacing-xs);
  }
</style>

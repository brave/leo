<svelte:options tag="leo-link" />

<script lang="ts">
  import type { SvelteHTMLElements } from 'svelte/elements'
  import type * as Props from '../button/props'

  interface CommonProps {
    kind?: Props.ButtonKind
    isLoading?: boolean
    href: string
    size: Props.ButtonSize
  }

  type $$Props = CommonProps & SvelteHTMLElements['a']

  export let kind: Props.ButtonKind = 'tertiary'
  export let size: Props.ButtonSize = 'medium'
  export let isLoading: boolean = false
  export let href: string
</script>

<a
  {href}
  class="leoButton"
  class:isPrimary={kind === 'primary'}
  class:isSecondary={kind === 'secondary'}
  class:isTertiary={kind === 'tertiary'}
  class:isCTA={kind === 'CTA'}
  class:isLarge={size === 'large'}
  class:isMedium={size === 'medium'}
  class:isSmall={size === 'small'}
  class:isLoading
  {...$$restProps}
>
  <slot>Leo Link</slot>
</a>

<style lang="scss">
  @import '../button/styles.scss';
  .leoButton {
    display: inline-block;
  }
</style>

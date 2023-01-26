<script context="module" lang="ts">
    const colors = {
        
    }
</script>
<script lang="ts">
    export let mode: 'faint' | 'heavy' = 'faint'
    export let color: 'gray' | 'secondary' | 'primary' | 'red' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'teal' | 'hero' = 'gray'

    $: background = color === 'hero'
        ? `var(--gradient-hero)`
        : mode === 'heavy'
            ? `var(--color-${color}-40)`
            : `var(--color-${color}-10)`
    $: text = color === 'hero'
        ? `var(--color-white)`
        : mode === 'heavy'
            ? `var(--color-${color}-10)`
            : `var(--color-${color}-50)`
</script>

<style lang="scss">
    .leo-label {
        display: inline;
        border-radius: var(--radius-4);
        padding: var(--spacing-4);
    }
</style>

<div class="leo-label" style:background={background} style:color={text}>
    <slot>Label</slot>
</div>

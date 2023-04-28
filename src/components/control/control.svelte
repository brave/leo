<script lang="ts">
</script>

<div class="leo-control" on:click on:keyup>
    <slot name="left-icon"/>
    <slot/>
    <slot name="right-icon"/>
</div>

<style lang="scss">
    .leo-control {
        --radius: var(--leo-control-radius, var(--leo-spacing-8));
        --background: var(--leo-control-background, var(--leo-color-container-highlight));
        --padding: var(--leo-control-padding, var(--leo-spacing-12) var(--leo-spacing-8));
        --font: var(--leo-control-font, var(--leo-font-primary-default-regular));

        border-radius: var(--radius);
        background: var(--background);
        padding: var(--padding);
        font: var(--font);

        border: 1px solid transparent;

        &:hover {
            border-color: var(--leo-color-divider-subtle);
            /* border: 1px var(--leo-color-divider-subtle); */
        }
    }
</style>

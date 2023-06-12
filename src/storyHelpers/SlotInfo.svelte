<script lang="ts">
    export let description: string;
</script>


<style>
    :global .slot-descriptions > li {
      margin-top: var(--leo-spacing-4);
    }
</style>

<h3>Slots</h3>
<div>
    {description}
    <ul class="slot-descriptions">
        <slot/>
    </ul>
</div>

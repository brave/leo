<script lang="ts">
  let isSubnav = $$props.slot === 'subnav'
</script>

<ul class:isSubnav>
  <slot />
</ul>

<style>
  ul {
    display: flex;
    flex-direction: var(--nav-direction);
    gap: var(--leo-spacing-m);
    margin: 0;
    padding: var(--leo-spacing-2xl) 0;
    list-style: none;
  }

  ul.isSubnav,
  :host([slot="subnav"]) ul {
    padding: var(--leo-spacing-m) 0 0;
    margin-left: 33px;
    border-left: 1px solid var(--leo-color-divider-subtle);
  }
</style>

<script lang="ts">
  import AlertCenter from '../src/components/alert/alertCenter.svelte'
  import ControlItem from '../src/components/controlItem/controlItem.svelte'
  import Icon from '../src/components/icon/icon.svelte'
  import SegmentedControl from '../src/components/segmentedControl/segmentedControl.svelte'
  import '../tokens/css/variables.css'

  // Note: We set the data-theme attribute on the body and on our layout element
  // so that the theme is correctly set whether there are multiple stories on
  // the page or just this one.
  let theme = localStorage.getItem('theme') ?? 'light'
  $: {
    localStorage.setItem('theme', theme)
    document.body.setAttribute('data-theme', theme)
  }
</script>

<AlertCenter />

<div class="layout" data-theme={theme}>
  <div class="theme-toggle-container">
    <SegmentedControl size='tiny' bind:value={theme}>
      <ControlItem value="light">
        <Icon name="theme-light" />
      </ControlItem>
      <ControlItem value="dark">
        <Icon name="theme-dark" />
      </ControlItem>
      <ControlItem value="system">
        <Icon name="theme-system" />
      </ControlItem>
    </SegmentedControl>
  </div>
  <slot />
</div>

<style>
  :global(body),
  .layout {
    background: var(--leo-color-container-background);
    color: var(--leo-color-text-primary);
    font: var(--leo-font-default-regular);
  }

  .layout {
    padding: 30px;
  }

  .theme-toggle-container {
    display: flex;
    flex-direction: column;
    align-items: end;
    margin-bottom: var(--leo-spacing-m);
  }
</style>

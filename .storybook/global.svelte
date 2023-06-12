<script lang="ts">
  import AlertCenter from '../src/components/alert/alertCenter.svelte'
  import Icon from '../src/components/icon/icon.svelte'
  import Toggle from '../src/components/toggle/toggle.svelte'
  import '../tokens/css/variables.css'

  let theme = localStorage.getItem('theme') ?? 'light'
  document.body.setAttribute('data-theme', theme)
</script>

<AlertCenter />

<div class="layout">
  <div class="theme-toggle-container">
    <Toggle size="small" checked={theme === 'light'} on:change={() => {
      theme = theme === 'light' ? 'dark' : 'light'
      document.body.setAttribute('data-theme', theme)
      localStorage.setItem('theme', theme)
    }}>
      {theme[0].toUpperCase() + theme.slice(1)}
      <Icon slot="on-icon" name="theme-light" />
    </Toggle>
  </div>
  <slot />
</div>

<style>
  :global body {
    background: var(--leo-color-container-background);
    color: var(--leo-color-text-primary);
    font: var(--leo-font-primary-default-regular);
  }

  .layout {
    padding: 30px;
  }

  .theme-toggle-container {
    display: flex;
    flex-direction: column;
    align-items: end;
    margin-bottom: var(--leo-spacing-8);
  }
</style>

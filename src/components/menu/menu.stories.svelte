<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

  import Menu from './menu.svelte'
  import Icon from '../icon/icon.svelte'
</script>

<Meta title="Menu" component={Menu} />

<Template let:args>
  <div class="container">
    <Menu isOpen={true}>
      <leo-menu-item>
        <div>Regenerate</div>
      </leo-menu-item>
      <leo-menu-item> Copy </leo-menu-item>
      <leo-menu-item> Share </leo-menu-item>
      <leo-menu-item>
        <div class="item">
          <div>New Chat</div>
          <Icon name="plus-add" />
        </div>
      </leo-menu-item>
    </Menu>
  </div>
</Template>

<Story name="Default" />

<style>
  .container {
    width: 250px;
  }

  .item {
    --leo-icon-size: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>

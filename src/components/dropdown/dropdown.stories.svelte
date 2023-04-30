<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

  import Dropdown from './dropdown.svelte'
  import {
    getNonStyleArgs,
    getStyleFromArgs
  } from '../../../.storybook/argHelper'
  import Icon from '../icon/icon.svelte'
</script>

<Meta
  title="Dropdown"
  component={Dropdown}
  argTypes={{
    placeholder: {
      defaultValue: 'select...'
    }
  }}
/>

<Template let:args>
  <div class="container" style={getStyleFromArgs(args)}>
    <Dropdown
      value={undefined}
      {...getNonStyleArgs(args)}
      options={['one', 'two', 'three']}
    />
  </div>
</Template>

<Story name="Default" />

<Story name="Left Icon" let:args>
  <div class="container" style={getStyleFromArgs(args)}>
    <Dropdown
      value={undefined}
      {...getNonStyleArgs(args)}
      options={['one', 'two', 'three']}
    >
      <div slot="left-icon">
        <Icon name="check-circle-outline" />
      </div>
    </Dropdown>
  </div>
</Story>

<Story name="Right Icon" let:args>
  <div class="container" style={getStyleFromArgs(args)}>
    <Dropdown
      value={undefined}
      {...getNonStyleArgs(args)}
      options={['one', 'two', 'three']}
    >
      <div slot="right-icon">
        <Icon name="send" />
      </div>
    </Dropdown>
  </div>
</Story>

<Story name="Both Icons" let:args>
  <div class="container" style={getStyleFromArgs(args)}>
    <Dropdown
      value={undefined}
      {...getNonStyleArgs(args)}
      options={['one', 'two', 'three']}
    >
      <div slot="left-icon">
        <Icon name="check-circle-outline" />
      </div>
      <div slot="right-icon">
        <Icon name="send" />
      </div>
    </Dropdown>
  </div>
</Story>

<style>
  .container {
    width: 200px;
  }
</style>

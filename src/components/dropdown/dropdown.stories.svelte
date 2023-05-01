<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

  import Dropdown from './dropdown.svelte'
  import {
    getNonStyleArgs,
    getStyleFromArgs
  } from '../../../.storybook/argHelper'
  import Icon from '../icon/icon.svelte'

  const countries = {
    'NZ': 'New Zealand',
    'AU': 'Australia',
    'UK': 'United Kingdom',
    'CA': 'Canada'
  }
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
    >
    <option value="one"><div class="unholy" style="color: red">One</div></option>
    <option value="two">Two</option>
    <option value="one">Three</option>
  </Dropdown>
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

<Story name="Custom Options" let:args>
  <div class="container" style={getStyleFromArgs(args)}>
    <Dropdown
      value={undefined}
      {...getNonStyleArgs(args)}
      options={['NZ', 'AU', 'UK', "CA"]}
    >
      <div slot="value" let:value>
        {countries[value]}
      </div>
      <div class="option" slot="option" let:option>
        <Icon name={`Country=${option}`}/>
        {option}
      </div>
    </Dropdown>
  </div>
</Story>

<style>
  .container {
    width: 200px;
  }

  .option {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
  }

  .unholy {
    color: red;
    background: purple;
  }
</style>

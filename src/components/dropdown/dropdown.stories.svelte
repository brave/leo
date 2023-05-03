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
    <Dropdown value={undefined} {...getNonStyleArgs(args)}>
      <leo-option value="one">
        <div>One</div>
      </leo-option>
      <leo-option value="two">Two</leo-option>
      <leo-option>Three</leo-option>
    </Dropdown>
  </div>
</Template>

<Story name="Default" />

<Story name="Left Icon" let:args>
  <div class="container" style={getStyleFromArgs(args)}>
    <Dropdown {...getNonStyleArgs(args)}>
      <div slot="left-icon">
        <Icon name="check-circle-outline" />
      </div>
      <leo-option>One</leo-option>
      <leo-option>Two</leo-option>
      <leo-option>Three</leo-option>
    </Dropdown>
  </div>
</Story>

<Story name="Right Icon" let:args>
  <div class="container" style={getStyleFromArgs(args)}>
    <Dropdown {...getNonStyleArgs(args)}>
      <div slot="right-icon">
        <Icon name="send" />
      </div>
      <leo-option>One</leo-option>
      <leo-option>Two</leo-option>
      <leo-option>Three</leo-option>
    </Dropdown>
  </div>
</Story>

<Story name="Both Icons" let:args>
  <div class="container" style={getStyleFromArgs(args)}>
    <Dropdown {...getNonStyleArgs(args)}>
      <div slot="left-icon">
        <Icon name="check-circle-outline" />
      </div>
      <div slot="right-icon">
        <Icon name="send" />
      </div>
      <leo-option>One</leo-option>
      <leo-option>Two</leo-option>
      <leo-option>Three</leo-option>
    </Dropdown>
  </div>
</Story>

<Story name="Custom Options" let:args>
  <div class="container" style={getStyleFromArgs(args)}>
    <Dropdown {...getNonStyleArgs(args)}>
      <div slot="value" class="country" let:value>
        <Icon name={`Country=${value}`} />
        {countries[value]}
      </div>
      {#each Object.entries(countries) as [code, name]}
        <leo-option class="country" value={code}>
          <Icon name={`Country=${code}`} />
          {name}
        </leo-option>
      {/each}
    </Dropdown>
  </div>
</Story>

<style>
  .container {
    width: 250px;
  }

  .country {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
  }
</style>

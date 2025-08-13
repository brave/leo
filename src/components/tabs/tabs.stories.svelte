<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Tabs from './tabs.svelte'
  import TabItem from './tabItem.svelte'
  import Icon from '../icon/icon.svelte'

  // An interface for a single tab's data
  interface TabData {
    value: string
    label: string
    iconBefore?: string
    iconAfter?: string
  }
</script>

<Meta
  title="Components/Tabs"
  component={Tabs}
  argTypes={{
    size: {
      control: 'select',
      options: ['large', 'medium', 'small'],
    },
    value: {
      control: 'text',
    },
    tabs: {
      control: 'object',
    }
  }}
/>

<Template let:args>
  <Tabs {...args}>
    {#each args.tabs as tab}
      <TabItem value={tab.value}>
        {#if tab.iconBefore}
          <Icon name={tab.iconBefore} slot="icon-before" />
        {/if}
        {tab.label}
        {#if tab.iconAfter}
          <Icon name={tab.iconAfter} slot="icon-after" />
        {/if}
      </TabItem>
    {/each}
  </Tabs>
</Template>

<Story name="Large" args={{
  size: 'large',
  value: 'tab1',
  tabs: [
    { value: 'tab1', label: 'Tab 1' },
    { value: 'tab2', label: 'Tab 2' },
    { value: 'tab3', label: 'Tab 3' },
  ]
}} />

<Story name="Medium" args={{
  size: 'medium',
  value: 'tab1',
  tabs: [
    { value: 'tab1', label: 'Tab 1' },
    { value: 'tab2', label: 'Tab 2' },
    { value: 'tab3', label: 'Tab 3' },
  ]
}} />

<Story name="Small" args={{
  size: 'small',
  value: 'tab1',
  tabs: [
    { value: 'tab1', label: 'Tab 1' },
    { value: 'tab2', label: 'Tab 2' },
    { value: 'tab3', label: 'Tab 3' },
  ]
}} />

<Story name="With Icons" args={{
  size: 'large',
  value: 'tab1',
  tabs: [
    { value: 'tab1', label: 'Tab 1', iconBefore: 'close' },
    { value: 'tab2', label: 'Tab 2', iconBefore: 'close' },
    { value: 'tab3', label: 'Tab 3', iconAfter: 'close' },
  ]
}} /> 
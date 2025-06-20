<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Tabs from './tabs.svelte'
  import Tab from './tab.svelte'
  import TabPanel from './tabPanel.svelte'
  import Icon from '../icon/icon.svelte'

  // An interface for a single tab's data
  interface TabData {
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
    tabs: {
      control: 'object',
    },
    panels: {
      control: 'object',
    }
  }}
/>

<Template let:args>
  <Tabs {...args}>
    <div slot="tabs">
      {#each args.tabs as tab}
        <Tab>
          {#if tab.iconBefore}
            <Icon name={tab.iconBefore} slot="icon-before" />
          {/if}
          {tab.label}
          {#if tab.iconAfter}
            <Icon name={tab.iconAfter} slot="icon-after" />
          {/if}
        </Tab>
      {/each}
    </div>
    <div slot="tab-panels">
      {#each args.panels as panel}
        <TabPanel>
          <p>{panel}</p>
        </TabPanel>
      {/each}
    </div>
  </Tabs>
</Template>

<Story name="Large" args={{
  size: 'large',
  tabs: [
    { label: 'Tab 1' },
    { label: 'Tab 2' },
    { label: 'Tab 3' },
  ],
  panels: [
    'Content for tab 1',
    'Content for tab 2',
    'Content for tab 3',
  ]
}} />

<Story name="Medium" args={{
  size: 'medium',
  tabs: [
    { label: 'Tab 1' },
    { label: 'Tab 2' },
    { label: 'Tab 3' },
  ],
  panels: [
    'Content for tab 1',
    'Content for tab 2',
    'Content for tab 3',
  ]
}} />

<Story name="Small" args={{
  size: 'small',
  tabs: [
    { label: 'Tab 1' },
    { label: 'Tab 2' },
    { label: 'Tab 3' },
  ],
  panels: [
    'Content for tab 1',
    'Content for tab 2',
    'Content for tab 3',
  ]
}} />

<Story name="With Icons" args={{
  size: 'large',
  tabs: [
    { label: 'Tab 1', iconBefore: 'close' },
    { label: 'Tab 2', iconBefore: 'close' },
    { label: 'Tab 3', iconAfter: 'close' },
  ],
  panels: [
    'Content for tab 1',
    'Content for tab 2',
    'Content for tab 3',
  ]
}} /> 
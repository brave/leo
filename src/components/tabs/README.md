# Tabs Component

The tabs component follows the same pattern as segmentedControl, using child slot elements and no context.

## Usage

```svelte
<script>
  import Tabs from './tabs.svelte'
  import TabItem from './tabItem.svelte'
  import Icon from '../icon/icon.svelte'

  let selectedTab = 'home'
</script>

<Tabs 
  bind:value={selectedTab} 
  size="large"
  onChange={(detail) => console.log('Tab changed:', detail.value)}
>
  <TabItem value="home">
    <Icon name="home" slot="icon-before" />
    Home
  </TabItem>
  <TabItem value="settings">
    Settings
    <Icon name="cog" slot="icon-after" />
  </TabItem>
  <TabItem value="profile">Profile</TabItem>
</Tabs>
```

## Key Changes

- **No Context**: The component no longer uses Svelte context
- **No Panels**: The tabs component only handles the tab UI itself, not content panels
- **Child Elements**: Uses `TabItem` components as children, similar to `ControlItem` in segmentedControl
- **Value-based**: Uses string/number values instead of indices
- **onChange Callback**: Provides an onChange callback for handling tab selection

## Props

- `value: string | undefined` - The currently selected tab value
- `size: 'large' | 'medium' | 'small'` - The size of the tabs
- `onChange: (detail: { value: string | undefined }) => void` - Callback fired when tab selection changes 
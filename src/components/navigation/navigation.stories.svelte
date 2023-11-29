<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

  import Navigation from './navigation.svelte'
  import NavigationItem from './navigationItem.svelte'
  import NavigationHeader from './navigationHeader.svelte'
  import NavigationActions from './navigationActions.svelte'
  import NavigationSeparator from './navigationSeparator.svelte'
  import NavigationMenu from './navigationMenu.svelte'
  import Icon from '../icon/icon.svelte'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'
  import Toggle from '../toggle/toggle.svelte'
</script>

<Meta
  title="Components/Navigation"
  component={Navigation}
  argTypes={{
    kind: {
      table: {
        disable: true
      }
    }
  }}
  args={{}}
/>

<Template let:args>
  <Navigation {...args}>
    <NavigationHeader slot="header">
      <Icon slot="logo" name="social-brave-release-favicon-fullheight-color" />
      <h1><span class="logo-mark">Brave</span> Accounts</h1>
    </NavigationHeader>

    <NavigationMenu>
      {#each [1, 2, 3, 4, 5] as item}
        <NavigationItem
          href="#"
          icon="browser-ntp-widget"
          isCurrent={item === 3}>Item {item}</NavigationItem
        >
      {/each}
      <NavigationSeparator />
      <NavigationItem href="#" icon="browser-ntp-widget">
        Item with sub nav
        <NavigationMenu slot="subnav">
          <NavigationItem href="#" icon="agenda" isCurrent={true}>
            Testing
          </NavigationItem>
          <NavigationItem href="#" icon="browser-ntp-widget">
            Item with sub nav
            <NavigationMenu slot="subnav">
              <NavigationItem href="#" icon="agenda" isCurrent={true}>
                Testing
              </NavigationItem>
            </NavigationMenu>
          </NavigationItem>
        </NavigationMenu>
      </NavigationItem>
    </NavigationMenu>

    <NavigationActions slot="actions">
      <Toggle>
        Switch theme
        <Icon slot="on-icon" name="theme-dark" />
      </Toggle>
    </NavigationActions>
  </Navigation>
</Template>

<Story name="Slots" let:args>
  <SlotInfo description="The navigation component has the following slots:">
    <Slot
      name="default"
      explanation="This default slot should contain a NavigationMenu component, which in turn can contain NavigationItem and NavigationSeparator components."
    ></Slot>

    <Slot
      name="header"
      explanation="This should contain the NavigationHeader component, and most likely will act as the site header."
    ></Slot>

    <Slot
      name="actions"
      explanation="This should contain the NavigationAction component, and is used to hold action items like theme switcher, profile avatar, etc"
    ></Slot>
  </SlotInfo>
</Story>

<Story name="Primary" let:args />

<style>
  h1 {
    font: var(--leo-font-primary-heading-h4);
    margin: 0;
  }

  .logo-mark {
    color: var(--leo-color-text-secondary);
  }
</style>

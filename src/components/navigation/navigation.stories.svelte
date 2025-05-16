<script context="module" lang="ts">
  import Navigation from './navigation.svelte'

  type MenuItem = {
    icon: IconName
    label: string
    url: string
    children?: MenuItem[]
  }
  const menuItems: (MenuItem | '---')[] = [
    {
      icon: 'browser-home',
      label: 'Home',
      url: '#home'
    },
    {
      icon: 'discover',
      label: 'Explore',
      url: '#explore'
    },
    {
      icon: 'notification',
      label: 'Notifications',
      url: '#notifications'
    },
    '---',
    {
      icon: 'settings',
      label: 'Settings',
      url: '#settings',
      children: [
        {
          icon: 'globe',
          label: 'Languages',
          url: '#settings-languages'
        },
        {
          icon: 'lock',
          label: 'Security',
          url: '#settings-security',
          children: [
            {
              icon: 'user-accounts',
              label: 'Account',
              url: '#settings-security-account'
            },
            {
              icon: 'browser-extensions',
              label: 'Tokens',
              url: '#settings-security-tokens'
            }
          ]
        }
      ]
    }
  ]

  const getUrls = (menuItems, urls = []) => {
    for (let item of menuItems) {
      if (typeof item !== 'string') {
        urls.push(item.url)
        if (item.children && item.children.length > 0) {
          return getUrls(item.children, urls)
        }
      }
    }
    return urls
  }

  const allUrls = getUrls(menuItems)

  export const meta = {
    title: 'Components/Navigation',
    component: Navigation,
    argTypes: {
      current: {
        control: 'select',
        options: allUrls
      },
      kind: {
        table: {
          disable: true
        }
      }
    },
    args: {
      current: allUrls[0]
    }
  }
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'

  import NavigationItem from './navigationItem.svelte'
  import NavigationHeader from './navigationHeader.svelte'
  import NavigationActions from './navigationActions.svelte'
  import Hr from '../hr/hr.svelte'
  import NavigationMenu from './navigationMenu.svelte'
  import Icon from '../icon/icon.svelte'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'
  import SegmentedControl from '../segmentedControl/segmentedControl.svelte'
  import ControlItem from '../controlItem/controlItem.svelte'
  import type { IconName } from '../../../icons/meta'

  let theme = 'light'
</script>

<Template let:args>
  <div class="container">
    <Navigation {...args}>
      <NavigationHeader slot="header">
        <Icon
          slot="logo"
          name="social-brave-release-favicon-fullheight-color"
        />
        <h1><span class="logo-mark">Brave</span> Accounts</h1>
      </NavigationHeader>

      <NavigationMenu>
        {#each menuItems as menuItem}
          {#if menuItem === '---'}
            <Hr />
          {:else}
            <NavigationItem
              icon={menuItem.icon}
              href={menuItem.url}
              isCurrent={args.current === menuItem.url}
            >
              {menuItem.label}

              <NavigationMenu slot="subnav" hidden={!menuItem.children}>
                {#each menuItem.children || [] as child}
                  <NavigationItem
                    icon={child.icon}
                    href={child.url}
                    isCurrent={args.current === child.url}
                  >
                    {child.label}

                    <NavigationMenu slot="subnav" hidden={!child.children}>
                      {#each child.children || [] as grandchild}
                        <NavigationItem
                          icon={grandchild.icon}
                          href={grandchild.url}
                          isCurrent={args.current === grandchild.url}
                        >
                          {grandchild.label}
                        </NavigationItem>
                      {/each}
                    </NavigationMenu>
                  </NavigationItem>
                {/each}
              </NavigationMenu>
            </NavigationItem>
          {/if}
        {/each}
      </NavigationMenu>

      <NavigationActions slot="actions">
        <div class="theme-switcher">
          <span>Theme</span>
          <SegmentedControl size="tiny" bind:value={theme}>
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
        <Hr />
        <div class="action-items">
          <NavigationItem outsideList={true} icon="help-outline"
            >Help</NavigationItem
          >
          <NavigationItem outsideList={true} icon="outside">Log out</NavigationItem>
        </div>
      </NavigationActions>
    </Navigation>
  </div>
</Template>

<Story name="Slots" let:args>
  <SlotInfo description="The navigation component has the following slots:">
    <Slot
      name="default"
      explanation="This default slot should contain a NavigationMenu component, which in turn can contain NavigationItem and Hr components."
    >
      <Navigation {...args}>
        <NavigationMenu>
          {#each menuItems as menuItem}
            {#if menuItem === '---'}
              <Hr />
            {:else}
              <NavigationItem
                icon={menuItem.icon}
                href={menuItem.url}
                isCurrent={args.current === menuItem.url}
              >
                {menuItem.label}

                <NavigationMenu slot="subnav" hidden={!menuItem.children}>
                  {#each menuItem.children || [] as child}
                    <NavigationItem
                      icon={child.icon}
                      href={child.url}
                      isCurrent={args.current === child.url}
                    >
                      {child.label}

                      <NavigationMenu slot="subnav" hidden={!child.children}>
                        {#each child.children || [] as grandchild}
                          <NavigationItem
                            icon={grandchild.icon}
                            href={grandchild.url}
                            isCurrent={args.current === grandchild.url}
                          >
                            {grandchild.label}
                          </NavigationItem>
                        {/each}
                      </NavigationMenu>
                    </NavigationItem>
                  {/each}
                </NavigationMenu>
              </NavigationItem>
            {/if}
          {/each}
        </NavigationMenu>
      </Navigation>
    </Slot>

    <Slot
      name="header"
      explanation="This should contain the NavigationHeader component, and most likely will act as the site header."
    >
      <Navigation {...args}>
        <NavigationHeader slot="header">
          <Icon
            slot="logo"
            name="social-brave-release-favicon-fullheight-color"
          />
          <h1><span class="logo-mark">Brave</span> Accounts</h1>
        </NavigationHeader>
      </Navigation>
    </Slot>

    <Slot
      name="actions"
      explanation="This should contain the NavigationAction component, and is used to hold action items like theme switcher, profile avatar, etc"
    >
      <Navigation {...args}>
        <NavigationActions slot="actions">
          <div class="theme-switcher">
            <span>Theme</span>
            <SegmentedControl size="tiny" bind:value={theme}>
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
          <Hr />
          <div class="action-items">
            <NavigationItem outsideList={true} icon="help-outline">
              Help
            </NavigationItem>
            <NavigationItem outsideList={true} icon="outside">
              Log out
            </NavigationItem>
          </div>
        </NavigationActions>
      </Navigation>
    </Slot>
  </SlotInfo>
</Story>

<Story name="Primary" />

<style lang="scss">
  .container {
    border-radius: var(--leo-radius-m);
    background: var(--leo-color-container-background);
    box-shadow:
      0px 1px 4px 0px rgba(0, 0, 0, 0.07),
      0px 1px 0px 0px rgba(0, 0, 0, 0.04);
    width: 300px;
    height: 100%;
  }

  h1 {
    font: var(--leo-font-heading-h4);
    margin: 0;
  }

  .logo-mark {
    color: var(--leo-color-text-secondary);
  }

  .theme-switcher {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--leo-spacing-m);

    span {
      padding-left: var(--leo-spacing-m);
      color: var(--leo-color-text-secondary);
      font: var(--leo-font-components-navbutton);
    }
  }

  .action-items {
    padding-top: var(--leo-spacing-m);
  }
</style>

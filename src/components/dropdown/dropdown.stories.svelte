<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

  import Dropdown from './dropdown.svelte'
  import Icon from '../icon/icon.svelte'
  import { cssProperties, sizes } from '../formItem/formItem.svelte'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'
  import { modes } from '../formItem/formItem.svelte'

  const countries = {
    'nz': 'New Zealand',
    'au': 'Australia',
    'gb': 'United Kingdom',
    'ca': 'Canada'
  }
</script>

<Meta
  title="Dropdown"
  component={Dropdown}
  argTypes={{
    ...cssProperties,
    placeholder: {
      defaultValue: 'select...'
    },
    label: {
      defaultValue: 'Label'
    },
    size: {
      control: 'select',
      options: sizes
    },
    mode: {
      control: 'select',
      options: modes
    }
  }}
/>

<Template let:args>
  <div class="container">
    <Dropdown value={undefined} {...args}>
      <div slot="label">{args.label}</div>
      <nl-option value="one">
        <div>One</div>
      </nl-option>
      <nl-option value="two">Two</nl-option>
      <nl-option>Three</nl-option>
    </Dropdown>
  </div>
</Template>

<Story name="Slots" let:args>
  <SlotInfo
    description="The dropdown provides several slots for customization. It accepts '<nl-option>'"
  >
    <Slot
      name="default"
      explanation="The dropdown items. Each item should have a `value` attribute set to the value of the dropdown when that item is selected. This is similar to the <option value='1'>Foo</option> element. Items can be any sort of element, but type definitions are provided for <nl-option value='1'>Foo</nl-option>, so it's generally easiest to use that."
    >
      <Dropdown {...args}>
        <nl-option value="1">Foo</nl-option>
        <nl-option value="2">Bar</nl-option>
        <nl-option value="3">Frob</nl-option>
      </Dropdown>
    </Slot>
    <Slot name="label" explanation="A label for the dropdown">
      <Dropdown {...args}>
        <div slot="label"><i>A custom <b>label</b> I made</i></div>
        <nl-option value="1">Foo</nl-option>
        <nl-option value="2">Bar</nl-option>
        <nl-option value="3">Frob</nl-option>
      </Dropdown>
    </Slot>
    <Slot name="left-icon" explanation="A left icon to show in the dropdown">
      <Dropdown {...args}>
        <Icon name="country-nz" slot="left-icon" />
        <nl-option value="1">Foo</nl-option>
        <nl-option value="2">Bar</nl-option>
        <nl-option value="3">Frob</nl-option>
      </Dropdown>
    </Slot>
    <Slot name="right-icon" explanation="A right icon to show in the dropdown">
      <Dropdown {...args}>
        <Icon name="country-nz" slot="right-icon" />
        <nl-option value="1">Foo</nl-option>
        <nl-option value="2">Bar</nl-option>
        <nl-option value="3">Frob</nl-option>
      </Dropdown>
    </Slot>
    <Slot
      name="placeholder"
      explanation="Placeholder text to display when no option is selected"
    >
      <Dropdown {...args}>
        <div
          slot="placeholder"
          style="color: gray; display: flex; flex-direction: row"
        >
          <Icon name="finger-touch" />
          Maybe I should pick something
        </div>
        <nl-option value="1">Foo</nl-option>
        <nl-option value="2">Bar</nl-option>
        <nl-option value="3">Frob</nl-option>
      </Dropdown>
    </Slot>
    <Slot
      name="value"
      explanation="Let's you custom render the selected value. By default, the value will just be displayed"
    >
      <Dropdown {...args}>
        <div slot="value" let:value>
          You picked {value}
        </div>
        <nl-option value="Foo">Foo</nl-option>
        <nl-option value="Bar">Bar</nl-option>
        <nl-option value="Frob">Frob</nl-option>
      </Dropdown>
    </Slot>
  </SlotInfo>
</Story>

<Story name="Default" />

<Story name="Left Icon" let:args>
  <div class="container">
    <Dropdown {...args}>
      <div slot="label">{args.label}</div>
      <div slot="left-icon">
        <Icon name="check-circle-outline" />
      </div>
      <nl-option>One</nl-option>
      <nl-option>Two</nl-option>
      <nl-option>Three</nl-option>
    </Dropdown>
  </div>
</Story>

<Story name="Right Icon" let:args>
  <div class="container">
    <Dropdown {...args}>
      <div slot="label">{args.label}</div>
      <div slot="right-icon">
        <Icon name="send" />
      </div>
      <nl-option>One</nl-option>
      <nl-option>Two</nl-option>
      <nl-option>Three</nl-option>
    </Dropdown>
  </div>
</Story>

<Story name="Both Icons" let:args>
  <div class="container">
    <Dropdown {...args}>
      <div slot="label">{args.label}</div>
      <div slot="left-icon">
        <Icon name="check-circle-outline" />
      </div>
      <div slot="right-icon">
        <Icon name="send" />
      </div>
      <nl-option>One</nl-option>
      <nl-option>Two</nl-option>
      <nl-option>Three</nl-option>
    </Dropdown>
  </div>
</Story>

<Story name="Custom Options" let:args>
  <div class="container" style={args}>
    <Dropdown {...args}>
      <div slot="label">{args.label}</div>
      <div slot="value" class="country" let:value>
        <Icon name={`country-${value}`} />
        {countries[value]}
      </div>
      {#each Object.entries(countries) as [code, name]}
        <nl-option class="country" value={code}>
          <Icon name={`country-${code}`} />
          {name}
        </nl-option>
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

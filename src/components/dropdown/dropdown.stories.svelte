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
  title="Components/Dropdown"
  component={Dropdown}
  argTypes={{
    ...cssProperties,
    '--leo-menu-control-width': {
      description: '(readonly): Computed width of menu control'
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
  args={{
    label: 'Label',
    placeholder: 'select...'
  }}
/>

<Template let:args>
  <div class="container">
    <Dropdown value={undefined} {...args}>
      <div slot="label">{args.label}</div>
      <leo-option value="one">
        <div>One</div>
      </leo-option>
      <leo-option value="two">Two</leo-option>
      <leo-option>Three</leo-option>
    </Dropdown>
  </div>
</Template>

<Story name="Slots" let:args>
  <SlotInfo
    description="The dropdown provides several slots for customization. It accepts '<leo-option>'"
  >
    <Slot
      name="default"
      explanation="The dropdown items. Each item should have a `value` attribute set to the value of the dropdown when that item is selected. This is similar to the <option value='1'>Foo</option> element. Items can be any sort of element, but type definitions are provided for <leo-option value='1'>Foo</leo-option>, so it's generally easiest to use that."
    >
      <Dropdown {...args}>
        <leo-option value="1">Foo</leo-option>
        <leo-option value="2">Bar</leo-option>
        <leo-option value="3">Frob</leo-option>
      </Dropdown>
    </Slot>
    <Slot name="label" explanation="A label for the dropdown">
      <Dropdown {...args}>
        <div slot="label"><i>A custom <b>label</b> I made</i></div>
        <leo-option value="1">Foo</leo-option>
        <leo-option value="2">Bar</leo-option>
        <leo-option value="3">Frob</leo-option>
      </Dropdown>
    </Slot>
    <Slot name="left-icon" explanation="A left icon to show in the dropdown">
      <Dropdown {...args}>
        <Icon name="country-nz" slot="left-icon" />
        <leo-option value="1">Foo</leo-option>
        <leo-option value="2">Bar</leo-option>
        <leo-option value="3">Frob</leo-option>
      </Dropdown>
    </Slot>
    <Slot name="right-icon" explanation="A right icon to show in the dropdown">
      <Dropdown {...args}>
        <Icon name="country-nz" slot="right-icon" />
        <leo-option value="1">Foo</leo-option>
        <leo-option value="2">Bar</leo-option>
        <leo-option value="3">Frob</leo-option>
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
        <leo-option value="1">Foo</leo-option>
        <leo-option value="2">Bar</leo-option>
        <leo-option value="3">Frob</leo-option>
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
        <leo-option value="Foo">Foo</leo-option>
        <leo-option value="Bar">Bar</leo-option>
        <leo-option value="Frob">Frob</leo-option>
      </Dropdown>
    </Slot>
    <Slot
      name="error"
      explanation="A slot where any errors related to the component will be shown. Errors are only shown if showErrors is set and an error slot exists on the Dropdown (this one has them forced on)"
    >
      <Dropdown {...args} showErrors>
        <leo-option value="Error 1">Error 1</leo-option>
        <leo-option value="Error 2">Error 2</leo-option>
        <leo-option value="Error 3">Error 3</leo-option>
        <div slot="errors">Something is not quite right here!</div>
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
      <leo-option>One</leo-option>
      <leo-option>Two</leo-option>
      <leo-option>Three</leo-option>
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
      <leo-option>One</leo-option>
      <leo-option>Two</leo-option>
      <leo-option>Three</leo-option>
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
      <leo-option>One</leo-option>
      <leo-option>Two</leo-option>
      <leo-option>Three</leo-option>
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
        <leo-option class="country" value={code}>
          <Icon name={`country-${code}`} />
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

  [slot='errors'] {
    display: flex;
    flex-direction: row;
    gap: var(--leo-spacing-m);
    align-items: center;

    margin-top: var(--leo-spacing-s);

    color: var(--leo-color-systemfeedback-error-icon);
  }
</style>

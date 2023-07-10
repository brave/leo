<script lang="ts">
    import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
    import Icon from '../icon/icon.svelte'
    import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
    import Slot from '../../storyHelpers/Slot.svelte'
    import Tooltip from './tooltip.svelte'
  import Button from '../button/button.svelte'
  </script>
  
  <Meta
    title="Tooltip"
    component={Tooltip}
    argTypes={{  
      text: { control: 'text', defaultValue: 'A helpful hint' }
    }}
  />
  
  <Template let:args>
    <Tooltip {...args}>
        <Button>Trigger</Button>
    </Tooltip>
  </Template>
  
  <Story name="Slots" let:args>
    <SlotInfo
      description=""
    >
      <Slot name="default" explanation="The trigger for the tooltip">
        <Tooltip {...args}>
        </Tooltip>
      </Slot>
    </SlotInfo>
  </Story>
  
  <Story name="Default" />
  
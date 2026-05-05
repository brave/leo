<script context="module">
  import Link from './link.svelte'

  export const meta = {
    title: 'Components/Link',
    component: Link,
    argTypes: {
      href: {
        control: 'text',
        description: 'The href for the link',
        type: 'string'
      },
      target: {
        control: 'text',
        description: 'The target for the link',
        type: 'string'
      },
      text: {
        control: 'text',
        description: 'The text content of the link',
        type: 'string'
      },
      '--leo-link-color': {
        type: 'string',
        control: 'color',
        description: 'The color of the link'
      },
      '--leo-link-hover-color': {
        type: 'string',
        control: 'color',
        description: 'The hover color of the link'
      },
      '--leo-link-visited-color': {
        type: 'string',
        control: 'color',
        description: 'The visited color of the link'
      },
      '--leo-link-disabled-color': {
        type: 'string',
        control: 'color',
        description: 'The disabled color of the link'
      },
      '--leo-link-focus-color': {
        type: 'string',
        control: 'color',
        description:
          'The focused color of the link. Defaults to the link color, if not set'
      },
      '--leo-link-focus-shadow': {
        type: 'string',
        control: 'text',
        description: 'The focused shadow for the link'
      }
    },
    args: {
      text: 'Download Brave',
      target: '_blank',
      href: 'https://brave.com'
    }
  }
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'

  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'
  import Icon from '../icon/icon.svelte'
</script>

<Template let:args>
  <Link href="#foo" {...args} />
</Template>

<Story name="Slots" let:args>
  <SlotInfo
    description="The link supports icon-before and icon-after slots in addition to the default text slot"
  >
    <Slot name="default" explanation="The text of the link">
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit <Link {...args} text={null}>{args.text}</Link>. Voluptatum magni nobis vel architecto tenetur repellendus dicta provident cumque doloribus illum voluptates, accusantium reprehenderit numquam voluptas ad autem neque? Cumque, consectetur.
      </div>
    </Slot>
    <Slot name="icon-before" explanation="An icon displayed before the link text">
      <div>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit <Link {...args} text={null}>
          <Icon name="check-circle-outline" slot="icon-before" />
          {args.text}
        </Link>. Vitae fuga, voluptate inventore est nesciunt delectus, vel quidem vero minus fugiat totam deleniti? Eveniet quasi iusto maxime rem dicta saepe libero.
      </div>
    </Slot>
    <Slot name="icon-after" explanation="An icon displayed after the link text">
      <div>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit <Link {...args} text={null}>
          {args.text}
          <Icon name="check-circle-outline" slot="icon-after" />
        </Link>. Amet, harum nisi. Libero in repudiandae magnam blanditiis deleniti labore ducimus ex quis iste, distinctio nesciunt quibusdam? Consequuntur corrupti magni culpa ea!
      </div>
    </Slot>
  </SlotInfo>
</Story>

<Story name="Default" />

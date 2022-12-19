<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Toggle, { sizes } from './toggle.svelte'
</script>

<Meta
  title="Toggle"
  component={Toggle}
  argTypes={{
    togglePadding: { control: 'range', min: 0, max: 24, defaultValue: 2 },
    toggleWidth: { control: 'range', min: 10, max: 200, defaultValue: 56 },
    toggleHeight: { control: 'range', min: 10, max: 100, defaultValue: 32 },
    size: { control: 'select', options: sizes, defaultValue: 'medium' },
    labelDirection: { control: 'select', options: ['row', 'row-reverse'], defaultValue: 'row' },
    label: { control: 'text', defaultValue: 'Label' }
  }}
/>

<Template let:args>
  <div
    style={`
        --leo-toggle-thumb-color: ${args.toggleThumbColor || 'unset'};
        --leo-toggle-padding: ${args.togglePadding}px;
        --leo-toggle-width: ${args.toggleWidth}px;
        --leo-toggle-height: ${args.toggleHeight}px;
    `}
  >
    <Toggle {...args}>{args.label}</Toggle>
  </div>
</Template>

<Story name="Default" />
<Story name="Custom Icon" let:args>
  <Toggle {...args}>
    <svg
      slot="on-icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M20.3333 21.3333H3.66667C2.7475 21.3333 2 20.5858 2 19.6667V4.66667C2 3.74833 2.7475 3 3.66667 3H20.3333C21.2525 3 22 3.74833 22 4.66667V19.6667C22 20.5858 21.2525 21.3333 20.3333 21.3333ZM3.66667 19.6667H20.3308L20.3325 8H3.66667V19.6667ZM3.66667 4.66667V6.33333H20.3333V4.66667H3.66667ZM15.3333 18H8.66667C8.20667 18 7.83333 17.6275 7.83333 17.1667V13C7.83333 12.5392 8.20667 12.1667 8.66667 12.1667H9.5V12.115C9.5 10.7775 10.6217 9.69084 12 9.69084C13.3783 9.69084 14.5 10.7775 14.5 12.115V12.1667H15.3333C15.7933 12.1667 16.1667 12.5392 16.1667 13V17.1667C16.1667 17.6275 15.7933 18 15.3333 18ZM12.8333 12.115C12.8333 11.6967 12.4592 11.3567 12 11.3567C11.5408 11.3567 11.1667 11.6967 11.1667 12.115V12.1667H12.8333V12.115ZM14.5 13.8333H10.45C10.4108 13.8392 10.375 13.8567 10.3333 13.8567C10.2917 13.8567 10.2567 13.8392 10.2167 13.8333H9.5V16.3333H14.5V13.8333Z"
        fill="currentColor"
      />
    </svg>
    {args.label}
  </Toggle>
</Story>

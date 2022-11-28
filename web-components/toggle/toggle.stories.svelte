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
  }}
/>

<Template let:args>
  <div
    style={`
        --leo-toggle-on-color: ${args.toggleOnColor || 'unset'};
        --leo-toggle-off-color: ${args.toggleOffColor || 'unset'};
        --leo-toggle-thumb-color: ${args.toggleThumbColor || 'unset'};
        --leo-toggle-padding: ${args.togglePadding}px;
        --leo-toggle-width: ${args.toggleWidth}px;
        --leo-toggle-height: ${args.toggleHeight}px;
    `}
  >
    <Toggle {...args}>
      <span slot="label">Toggle Me!</span>
      <svg
        slot="on-icon"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.6461 4.00015C14.2516 3.69959 13.6882 3.77573 13.3876 4.17021L7.47971 11.9243L4.53279 8.9774C4.18211 8.62672 3.61356 8.62672 3.26288 8.9774C2.91221 9.32807 2.91221 9.89663 3.26288 10.2473L6.93634 13.9208C7.11956 14.104 7.37301 14.1991 7.63155 14.1817C7.89009 14.1643 8.12851 14.0361 8.28555 13.83L14.8161 5.25861C15.1167 4.86413 15.0406 4.3007 14.6461 4.00015Z"
          fill="currentColor"
        />
      </svg>
    </Toggle>
  </div>
</Template>

<Story name="Default" />
<Story name="Disabled - Off" args={{ on: false, disabled: true }} />
<Story name="Disabled - On" args={{ on: true, disabled: true }} />

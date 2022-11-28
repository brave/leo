<script lang="ts">
    import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
    import Toggle from './toggle.svelte'
  
    let on = false
    function handleChange() {
      on = !on
    }
  </script>
  
  <Meta
    title="Toggle"
    component={Toggle}
    argTypes={{
      dots: { control: 'number', defaultValue: 10 },
      dotSize: { control: 'number', defaultValue: 8 },
      activeColor: { control: 'color' },
      defaultColor: { control: 'color' },
    }}
  />
  
  <Template let:args>
    <div style={`--color-interaction-button-primary-background: ${args.activeColor || 'unset'}; --color-primary-20: ${args.defaultColor || 'unset'}`}>
      <Toggle label="Toggle me!" on={on} />
    </div>
  </Template>
  
  <Story name="Default" />

<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

  import Collapse from './collapse.svelte'
</script>

<Meta
  title="Collapse"
  component={Collapse}
  argTypes={{
    open: { control: 'select', options: [undefined, true, false] },
  }}
/>

<Template let:args>
  <Collapse {...args} />
</Template>

<Story name="Primary" let:args>
  <Collapse title="Title" {...args}>
    <!-- TODO(fallaciousreasoning): When we get icons, use one of those here (see https://github.com/brave/leo/issues/45). -->
    <svg
      slot="icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11.9965 22C14.6691 22 17.1807 20.96 19.0692 19.0717C20.9593 17.1825 22 14.6708 22 12C22 9.32917 20.9593 6.8175 19.0692 4.92917C17.1807 3.04 14.6691 2 11.9965 2C9.32481 2 6.81326 3.04 4.92393 4.92917C1.02536 8.8275 1.02536 15.1717 4.92393 19.0708C6.81326 20.96 9.32481 22 11.9965 22ZM11.9965 3.66667C14.2238 3.66667 16.3169 4.53333 17.8909 6.1075C19.4658 7.68167 20.3329 9.77417 20.3329 12C20.3329 14.2258 19.4658 16.3192 17.8909 17.8925C16.3169 19.4667 14.2238 20.3333 11.9965 20.3333C9.77011 20.3333 7.67701 19.4667 6.10299 17.8925C2.85348 14.6433 2.85348 9.35667 6.10299 6.1075C7.67701 4.53333 9.77011 3.66667 11.9965 3.66667ZM10.3303 7.8325C10.3303 8.75167 11.0783 9.5 11.9974 9.5C12.9173 9.5 13.6645 8.75167 13.6645 7.8325C13.6645 6.91417 12.9173 6.16667 11.9974 6.16667C11.0783 6.16667 10.3303 6.91417 10.3303 7.8325ZM12 11.2C11.5306 11.2 11.15 11.5806 11.15 12.05V17.15C11.15 17.6194 11.5306 18 12 18C12.4695 18 12.85 17.6194 12.85 17.15V12.05C12.85 11.5806 12.4695 11.2 12 11.2Z"
        fill="currentColor"
      />
    </svg>
    Content goes here
  </Collapse>
</Story>

<style>
</style>

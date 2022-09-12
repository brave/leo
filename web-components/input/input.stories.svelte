<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

  import Input from './input.svelte'
  import { inputTypes } from './props'
</script>

<Meta
  title="Input"
  component={Input}
  argTypes={{
    type: { control: 'select', options: inputTypes },
  }}
/>

<Template let:args>
  <Input {...args} />
</Template>

<Story name="Default" args={{ type: 'text' }} />
<Story name="Icon" let:args>
  <Input {...args}>
    <svg
      slot="icon"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8.99996 17.3333C4.40482 17.3333 0.666626 13.5951 0.666626 8.99996C0.666626 4.40482 4.40482 0.666626 8.99996 0.666626C13.5951 0.666626 17.3333 4.40482 17.3333 8.99996C17.3333 13.5951 13.5951 17.3333 8.99996 17.3333ZM8.99996 2.05551C5.17079 2.05551 2.05551 5.17079 2.05551 8.99996C2.05551 12.8291 5.17079 15.9444 8.99996 15.9444C12.8291 15.9444 15.9444 12.8291 15.9444 8.99996C15.9444 5.17079 12.8291 2.05551 8.99996 2.05551ZM8.82774 12.2347C8.69093 12.3916 8.49857 12.4722 8.30551 12.4722C8.15274 12.4722 7.99926 12.4222 7.87218 12.3201L4.39926 9.54232C4.09996 9.30274 4.05135 8.86593 4.29093 8.56593C4.53121 8.26663 4.96871 8.21802 5.26662 8.4576L8.2201 10.8201L12.6444 5.76524C12.8972 5.47635 13.3354 5.44718 13.6243 5.69927C13.9125 5.95204 13.9416 6.39093 13.6888 6.67913L8.82774 12.2347Z"
        fill="currentColor"
      />
    </svg>
  </Input>
</Story>
<Story name="Error" let:args>
  <Input {...args}>
    <div slot="error">
      <svg
        width="18"
        height="16"
        viewBox="0 0 18 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M16.6391 15.9444C16.6342 15.9444 16.63 15.9444 16.6252 15.9444H1.36043C1.11557 15.9444 0.888098 15.8144 0.763581 15.6025C0.63837 15.3914 0.634196 15.1285 0.752452 14.9131L8.38481 0.999607C8.62828 0.555632 9.35729 0.555632 9.60076 0.999607L17.174 14.8055C17.2735 14.9257 17.3333 15.0802 17.3333 15.2487C17.3333 15.6326 17.0224 15.9444 16.6391 15.9444ZM8.99281 2.77899L2.53396 14.553H15.4517L8.99281 2.77899ZM8.99278 6.20494C9.37606 6.20494 9.68701 6.51607 9.68701 6.90062V10.379C9.68701 10.7628 9.37606 11.0747 8.99278 11.0747C8.60949 11.0747 8.29924 10.7628 8.29924 10.379V6.90062C8.29924 6.51607 8.60949 6.20494 8.99278 6.20494ZM9.48741 11.9717C9.61193 12.1038 9.68845 12.2849 9.68845 12.466C9.68845 12.6471 9.61193 12.8275 9.48046 12.9596C9.35525 13.0848 9.17508 13.1617 8.99491 13.1617C8.8071 13.1617 8.63389 13.0848 8.50241 12.9596C8.37025 12.8275 8.30068 12.6471 8.30068 12.466C8.30068 12.2849 8.37025 12.1038 8.50241 11.9717C8.7584 11.7144 9.23073 11.7144 9.48741 11.9717Z"
          fill="currentColor"
        />
      </svg>
      Error message description here (it wraps to container).
    </div>
  </Input>
</Story>
<Story name="Complex Label" let:args>
  <Input {...args}>
    <div class="complex-label" slot="label">
      <span>Start</span>
      <span>End</span>
    </div>
  </Input>
</Story>

<style>
  .complex-label {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: darkblue;
  }
</style>

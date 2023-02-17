<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import meta from '../../../icons/meta'
  import Icon from './icon.svelte'

  let filter = ''
  $: filteredIcons = Object.values(meta.icons).filter((i) =>
    i.toLowerCase().includes(filter.toLowerCase())
  )
</script>

<Meta
  title="Icon"
  component={Icon}
  argTypes={{
    name: {
      control: 'select',
      options: Object.values(meta.icons),
      description: 'The name of the icon to use',
      type: 'string',
      defaultValue: 'shield-alert-filled'
    },
    color: {
      control: 'color',
      description: 'The color to use for the icon',
      type: 'string',
      defaultValue: 'var(--leo-color-icon-default)'
    },
    size: {
      control: 'number',
      description: 'The size of the icon (defaults to 24px if not set)',
      type: 'number',
      defaultValue: 24
    }
  }}
/>

<Template let:args>
  <div style={`color: ${args.color}; --leo-icon-size: ${args.size}px;`}>
    <Icon {...args} />
  </div>
</Template>

<Story name="Default" />

<Story name="Custom Icon" let:args>
  <div style={`color: ${args.color}; --leo-icon-size: ${args.size}px;`}>
    This icon isn't rendered from our libray - instead an SVG is passed in via a
    slot. This allows consumers of the libary to import their own SVGs and use
    them directly inside an icon.
    <Icon {...args}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0, 0, 400,400">
        <circle cx="200" cy="200" r="200" fill="#2cb44c" />
        <path
          d="M108.385 104.100 C 107.019 104.789,106.365 105.469,105.600 107.000 L 104.600 109.000 104.600 122.000 L 104.600 135.000 105.600 137.000 C 107.148 140.097,108.671 140.676,117.226 141.421 C 197.595 148.424,261.367 211.172,268.636 290.400 C 270.097 306.329,269.418 305.800,288.400 305.800 L 301.400 305.800 303.400 304.800 C 307.537 302.731,308.191 296.486,306.019 279.800 C 295.730 200.782,239.137 134.255,162.760 111.395 C 141.337 104.983,113.926 101.306,108.385 104.100 M110.274 172.787 C 105.028 173.802,104.238 176.591,104.505 193.137 C 104.764 209.197,105.022 209.611,115.611 210.982 C 160.231 216.759,193.492 250.335,199.381 295.545 C 200.688 305.583,202.074 306.225,221.800 305.935 C 238.552 305.688,239.424 304.577,236.816 286.800 C 227.961 226.439,179.294 179.506,118.800 172.990 C 112.931 172.358,112.540 172.349,110.274 172.787 M126.705 253.186 C 106.131 256.947,97.686 281.780,111.869 296.814 C 127.848 313.753,155.989 303.890,157.483 280.827 C 158.577 263.953,143.225 250.166,126.705 253.186 "
          stroke="none"
          fill="currentColor"
          fill-rule="evenodd"
        />
      </svg>
    </Icon>
  </div>
</Story>

<Story name="All Icons" let:args>
  <input
    class="filter"
    type="text"
    placeholder="Filter icons"
    bind:value={filter}
  />
  <div
    class="all"
    style={`color: ${args.color}; --leo-icon-size: ${args.size}px;`}
  >
    {#each filteredIcons as icon}
      <div class="icon">
        <Icon name={icon} />
        <div class="name">
          {icon}
        </div>
      </div>
    {/each}
  </div>
</Story>

<style>
  .filter {
    padding: 10px;
    margin: 10px;
  }
  .all {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
  }

  .icon {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100px;
  }
</style>

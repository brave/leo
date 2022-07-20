<svelte:options tag="leo-demo-button" />

<script lang="typescript">
  import { createEventDispatcher } from 'svelte'

  export let button_text: string
  let acted = false

  setTimeout(() => { acted = true}, 1000)

  const dispatch = createEventDispatcher()

  function sayHello() {
    console.log('svelte component: dispatching "hello" event')
    dispatch('hello', {
      text: 'from svelte'
    })
  }
</script>

<style>
  /* Rotation to visually verify it's the same DOM element! */
  button {
    transition: transform 40s linear;
    transform: rotate(0deg);
  }
  button.acted {
    transform: rotate(180deg);
  }
</style>
<!-- 
  Demonstrate: 
  - attribute changing
  - events
  - child content changing
  - slots
-->
<button class="{acted ? 'acted' : ''}" on:click={sayHello}>Hefllo world! {button_text} <slot></slot></button>

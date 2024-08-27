<script lang="ts">
  import { onMount } from 'svelte'
  import Button from '../../src/components/button/button.svelte'
  import ProgressRing from '../../src/components/progress/progressRing.svelte'

  export let delay = 3000

  const baseText = 'Retry'
  let text = baseText
  let progress = 0

  onMount(() => {
    let start: number
    function incrementProgress(timeStamp) {
      if (start === undefined) {
        start = timeStamp
      }

      const elapsed = timeStamp - start
      progress = (1 / delay) * elapsed

      const secsRemaining = Math.ceil(Math.abs(elapsed - delay) / 1000)
      text = `${baseText} in ${secsRemaining}`

      if (elapsed < delay) {
        requestAnimationFrame(incrementProgress)
      }
    }

    const animationFrameId = requestAnimationFrame(incrementProgress)

    return () => cancelAnimationFrame(animationFrameId)
  })

  $: isDelayed = progress < 1
</script>

<Button {...$$restProps} isDisabled={isDelayed}>
  {isDelayed ? text : baseText}
  <div slot="icon-after" hidden={!isDelayed}>
    {#if isDelayed}
      <ProgressRing mode="determinate" progress={progress} />
    {/if}
  </div>
</Button>

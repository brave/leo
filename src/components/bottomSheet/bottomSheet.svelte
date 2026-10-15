<script context="module" lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { writable } from 'svelte/store'
  import { prefersReducedMotion } from '../prefersReducedMotion'

  declare global {
    namespace JSX {
      interface IntrinsicElements {
        'leo-bottomsheet': HTMLAttributes<HTMLElement> & {
          children?: any
        }
      }
    }
  }

  let nextId = 0
  const sheetStack = writable<number[]>([])
  /** Sheets running their dismiss animation; stack depth leaves them out. */
  const dismissingSheetIds = writable<number[]>([])
  const sheetHeights = writable<Record<number, number>>({})
  /** Host overflow captured when the first sheet opens; restored when the stack empties. */
  let savedBodyOverflow: string | null = null

  /** How far each background sheet peeks above the one in front (spacing-2xl). */
  const STACK_PEEK_PX = 24
  /** Opacity lost per level a sheet sits behind the front one. */
  const STACK_FADE_STEP = 0.15
  const STACK_MIN_OPACITY = 0.4
  /** Release speed, in px per ms, that counts as a flick. */
  const FLICK_VELOCITY = 0.5
  /** Movement before a press on the handle becomes a drag rather than a tap. */
  const DRAG_SLOP_PX = 4
  const ITEM_SELECTOR = 'leo-menu-item, leo-option'

  // The token values, for pages that load the component without Leo's variables.
  const MOTION_FALLBACKS: Record<string, string> = {
    '--leo-duration-xs': '50ms',
    '--leo-duration-m': '200ms',
    '--leo-duration-l': '300ms',
    '--leo-easing-out': 'cubic-bezier(0, 0, 0.58, 1)',
    '--leo-easing-in': 'cubic-bezier(0.5, 0, 0.5, 1)',
    '--leo-easing-linear': 'cubic-bezier(0, 0, 1, 1)'
  }

  function motionToken(name: string) {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim()
    return value || MOTION_FALLBACKS[name]
  }

  /** Reads reduced motion each time, so an OS change applies mid-session. */
  function sheetMotion(duration: string, easing: string) {
    const reduced = prefersReducedMotion()
    return {
      reduced,
      duration: parseFloat(
        motionToken(reduced ? '--leo-duration-xs' : duration)
      ),
      easing: motionToken(reduced ? '--leo-easing-linear' : easing)
    }
  }

  function deepActiveElement() {
    let el = document.activeElement
    while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement
    return el as HTMLElement | null
  }

  function syncBodyScrollLock(locked: boolean) {
    if (typeof document === 'undefined') return
    if (locked) {
      if (savedBodyOverflow === null) {
        savedBodyOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
      }
      return
    }
    if (savedBodyOverflow !== null) {
      document.body.style.overflow = savedBodyOverflow
      savedBodyOverflow = null
    }
  }
</script>

<script lang="ts">
  import { fade } from 'svelte/transition'
  import { onDestroy, tick } from 'svelte'

  export let isOpen = false
  export let onClose: () => void = undefined
  export let escapeCloses = true
  export let backdropClickCloses = true
  export let dragToClose = true
  /** When true, dragging the handle up expands the sheet to full viewport height. */
  export let dragToExpand = false
  /** Accessible name for the sheet. */
  export let label: string = undefined
  /** Accessible name for the handle, which toggles expansion when `dragToExpand` is set. */
  export let expandLabel: string = undefined

  const id = nextId++

  let sheetEl: HTMLDivElement
  let contentEl: HTMLDivElement
  let backdropEl: HTMLDivElement
  /** Stays true after `isOpen` turns false, until the dismiss animation ends. */
  let rendered = false
  let showBackdrop = false
  let backdropClosing = false
  let dismissing = false
  let isExpanded = false
  let snapping = false
  let hasMenuItems = false
  /** Natural height when collapsed; kept while expanded so a collapse knows where to land. */
  let collapsedHeight = 0

  let pointerId: number | null = null
  let dragStartY = 0
  let dragStartHeight = 0
  let dragStartedExpanded = false
  let isDragging = false
  let suppressHandleClick = false
  let samples: { y: number; t: number }[] = []
  /** Live height while dragging an expandable sheet. */
  let dragHeight: number | undefined
  /** How far the sheet is pulled below its resting position. */
  let dragTranslateY = 0
  let pressStartedOutside = false

  $: atFullHeight =
    isExpanded || (dragHeight != null && dragHeight >= getViewportHeight() - 1)

  $: if (isOpen) rendered = true

  // A parent closing the sheet directly gets the same exit as close().
  $: if (!isOpen && rendered && !dismissing) void dismiss()

  $: if (rendered) {
    sheetStack.update((s) => (s.includes(id) ? s : [...s, id]))
  } else {
    isExpanded = false
    collapsedHeight = 0
    dragHeight = undefined
    dragTranslateY = 0
    sheetStack.update((s) =>
      s.includes(id) ? s.filter((sid) => sid !== id) : s
    )
  }

  $: syncBodyScrollLock($sheetStack.length > 0)

  onDestroy(() => {
    sheetStack.update((s) => {
      const next = s.includes(id) ? s.filter((sid) => sid !== id) : s
      syncBodyScrollLock(next.length > 0)
      return next
    })
    dismissingSheetIds.update((ids) => ids.filter((sid) => sid !== id))
  })

  $: stackIndex = $sheetStack.indexOf(id)
  $: effectiveStack = $sheetStack.filter(
    (sid) => !$dismissingSheetIds.includes(sid)
  )
  $: effectiveIndex = effectiveStack.indexOf(id)
  $: fullDepthBehind =
    stackIndex === -1 ? 0 : $sheetStack.length - 1 - stackIndex
  $: effectiveDepthBehind =
    effectiveIndex === -1 ? 0 : effectiveStack.length - 1 - effectiveIndex
  /** Visual stack depth; compresses when a sheet above is dismissing. */
  $: depthBehind = dismissing ? fullDepthBehind : effectiveDepthBehind
  $: frontHeight =
    $sheetHeights[effectiveStack[effectiveStack.length - 1]] ?? 0
  $: ownHeight = $sheetHeights[id] ?? 0
  $: isBottomOfStack = stackIndex === 0
  $: stackAnimating = $dismissingSheetIds.length > 0

  // Reads the store directly: when one sheet opens another, the opener's
  // reactive state can lag behind the stack within the same update.
  function isTop() {
    return rendered && $sheetStack[$sheetStack.length - 1] === id
  }

  $: if (rendered && isBottomOfStack) {
    showBackdrop = true
  }

  $: if (!rendered && showBackdrop && !backdropClosing) {
    void fadeBackdropAndHide()
  }

  function backdropFadeMs() {
    return sheetMotion('--leo-duration-m', '--leo-easing-out').duration
  }

  function fadeBackdropOut() {
    if (!backdropEl) return Promise.resolve()
    const { duration, easing } = sheetMotion(
      '--leo-duration-m',
      '--leo-easing-in'
    )
    return backdropEl
      .animate([{ opacity: 1 }, { opacity: 0 }], {
        duration,
        easing,
        fill: 'forwards'
      })
      .finished.then(() => undefined)
      .catch(() => undefined)
  }

  async function fadeBackdropAndHide() {
    if (backdropClosing) return
    backdropClosing = true
    await fadeBackdropOut()
    showBackdrop = false
    backdropClosing = false
  }

  function close() {
    void dismiss(false)
  }

  async function dismiss(fromParent = true) {
    if (dismissing) return
    if (!sheetEl) {
      rendered = false
      if (!fromParent) finishClose()
      return
    }
    dismissing = true
    dismissingSheetIds.update((ids) => [...ids, id])

    const { reduced, duration, easing } = sheetMotion(
      '--leo-duration-m',
      '--leo-easing-in'
    )
    // Starts from the current transform, which may be a drag or stack offset.
    const from = getComputedStyle(sheetEl).transform
    const keyframes = reduced
      ? [{ opacity: 1 }, { opacity: 0 }]
      : [
          { transform: from === 'none' ? 'translateY(0)' : from },
          { transform: `translateY(${sheetEl.offsetHeight}px)` }
        ]
    const fadeBackdrop = isBottomOfStack && showBackdrop
    // A cancelled animation rejects; the sheet still has to finish closing.
    await Promise.all([
      sheetEl
        .animate(keyframes, { duration, easing, fill: 'forwards' })
        .finished.catch(() => undefined),
      fadeBackdrop ? fadeBackdropOut() : undefined
    ])

    dismissing = false
    dismissingSheetIds.update((ids) => ids.filter((sid) => sid !== id))
    if (fadeBackdrop) showBackdrop = false
    rendered = false
    if (!fromParent) {
      finishClose()
      return
    }
    // Reopened by the parent while closing.
    await tick()
    if (isOpen) rendered = true
  }

  function finishClose() {
    isOpen = false
    onClose?.()
  }

  // Only a press that starts outside the open sheet closes it, so the click
  // that opened the sheet cannot also close it.
  function handleWindowPointerDown(e: PointerEvent) {
    pressStartedOutside =
      isTop() && !!sheetEl && !e.composedPath().includes(sheetEl)
  }

  function handleWindowClick(e: MouseEvent) {
    const startedOutside = pressStartedOutside
    pressStartedOutside = false
    if (!startedOutside || !backdropClickCloses || !isTop() || !sheetEl) return
    if (!e.composedPath().includes(sheetEl)) close()
  }

  function handleWindowFocusIn(e: FocusEvent) {
    if (!isTop() || !sheetEl || dismissing) return
    if (!e.composedPath().includes(sheetEl)) sheetEl.focus({ preventScroll: true })
  }

  /** Menu items in the content, including ones slotted into the web component. */
  function getItems(root: HTMLElement = contentEl): HTMLElement[] {
    if (!root) return []
    const scopes: Element[] = [root]
    root
      .querySelectorAll('slot')
      .forEach((slot) => scopes.push(...slot.assignedElements({ flatten: true })))
    const items: HTMLElement[] = []
    for (const scope of scopes) {
      if (scope !== root && scope.matches(ITEM_SELECTOR)) {
        items.push(scope as HTMLElement)
      }
      items.push(...Array.from(scope.querySelectorAll<HTMLElement>(ITEM_SELECTOR)))
    }
    return items
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!isTop()) return

    if (e.code === 'Escape' && escapeCloses) {
      e.preventDefault()
      close()
      return
    }

    if (isEditable(e)) return

    let dir = 0
    if (e.code === 'ArrowUp') dir = -1
    if (e.code === 'ArrowDown') dir = 1
    if (dir === 0) return

    const items = getItems()
    if (!items.length) return

    let focusedIndex = items.findIndex((el) => el.matches(':focus-within'))
    if (focusedIndex === -1) {
      focusedIndex = 0
    } else {
      focusedIndex += dir
      if (focusedIndex < 0) focusedIndex = items.length - 1
      if (focusedIndex >= items.length) focusedIndex = 0
    }

    items[focusedIndex]?.focus()
    e.preventDefault()
  }

  function isEditable(e: Event) {
    const target = e.composedPath()[0] as HTMLElement
    return (
      target?.isContentEditable ||
      !!target?.matches?.('input, textarea, select')
    )
  }

  // Menu items are custom elements with no native activation, so Enter and
  // Space click them, as `menu.svelte` does.
  function handleItemKeydown(e: KeyboardEvent) {
    if (e.key !== 'Enter' && e.key !== ' ') return
    const target = e.composedPath()[0]
    const item = getItems().find((el) => el === target)
    if (!item) return
    e.preventDefault()
    item.click()
  }

  function handleItemClick(e: MouseEvent) {
    if (!isTop()) return
    const item = getItems().find((el) => e.composedPath().includes(el))
    if (item && !item.dataset.isInteractive) close()
  }

  function getViewportHeight() {
    return window.visualViewport?.height ?? window.innerHeight
  }

  function handlePointerDown(e: PointerEvent) {
    if ((!dragToClose && !dragToExpand) || !isTop() || dismissing) return
    if (e.button !== 0) return
    pointerId = e.pointerId
    dragStartY = e.clientY
    dragStartHeight = sheetEl.offsetHeight
    dragStartedExpanded = isExpanded
    if (!isExpanded) collapsedHeight = dragStartHeight
    samples = [{ y: e.clientY, t: e.timeStamp }]
    isDragging = false
    suppressHandleClick = false
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e: PointerEvent) {
    if (e.pointerId !== pointerId) return
    const delta = e.clientY - dragStartY
    if (!isDragging && Math.abs(delta) < DRAG_SLOP_PX) return
    isDragging = true
    suppressHandleClick = true
    samples = [...samples, { y: e.clientY, t: e.timeStamp }].filter(
      (s) => e.timeStamp - s.t < 100
    )

    const visualHeight = dragStartHeight - delta
    let pulledBelow = -delta
    if (dragToExpand) {
      dragHeight = Math.min(
        getViewportHeight(),
        Math.max(collapsedHeight, visualHeight)
      )
      pulledBelow = collapsedHeight - visualHeight
    }
    dragTranslateY = dragToClose ? Math.max(0, pulledBelow) : 0
  }

  /** Speed over the last 100ms before release, so a drag that pauses is not a flick. */
  function releaseVelocity(releasedAt: number) {
    const recent = samples.filter((s) => releasedAt - s.t < 100)
    if (recent.length < 2) return 0
    const first = recent[0]
    const last = recent[recent.length - 1]
    const dt = last.t - first.t
    return dt > 0 ? (last.y - first.y) / dt : 0
  }

  function handlePointerUp(e: PointerEvent) {
    if (e.pointerId !== pointerId) return
    pointerId = null
    if (!isDragging) return
    isDragging = false

    const cancelled = e.type === 'pointercancel'
    const velocity = cancelled ? 0 : releaseVelocity(e.timeStamp)
    const lastY = samples[samples.length - 1].y
    const visualHeight = dragStartHeight - (lastY - dragStartY)
    const flickUp = velocity < -FLICK_VELOCITY
    const flickDown = velocity > FLICK_VELOCITY

    if (!cancelled && dragToClose) {
      // From expanded, a flick collapses unless the sheet is already well
      // below its collapsed height.
      const wellBelowCollapsed = visualHeight < collapsedHeight * 0.85
      const pulledFar = visualHeight < collapsedHeight * 0.7
      const flickedClosed =
        flickDown &&
        (!dragToExpand || !dragStartedExpanded || wellBelowCollapsed)
      if (pulledFar || flickedClosed) {
        close()
        return
      }
    }

    if (!dragToExpand) {
      void snapTo(false)
      return
    }

    // Leaving a state takes a quarter of the travel, in either direction.
    const range = getViewportHeight() - collapsedHeight
    const expandAt =
      collapsedHeight + range * (dragStartedExpanded ? 0.75 : 0.25)
    const expand = flickUp ? true : flickDown ? false : visualHeight > expandAt
    void snapTo(cancelled ? dragStartedExpanded : expand)
  }

  // Changes height in one step and animates only the transform, so the
  // sheet's bottom edge never leaves the bottom of the viewport.
  async function snapTo(expand: boolean) {
    if (!sheetEl) return
    const fromHeight = dragHeight ?? sheetEl.offsetHeight
    const fromY = dragTranslateY
    const targetHeight = expand ? getViewportHeight() : collapsedHeight
    const { reduced, duration, easing } = sheetMotion(
      '--leo-duration-m',
      '--leo-easing-out'
    )

    const settle = () => {
      isExpanded = expand
      dragHeight = undefined
      dragTranslateY = 0
    }

    if (reduced) {
      settle()
      return
    }

    snapping = true
    if (targetHeight >= fromHeight) {
      settle()
      await tick()
      const offset = sheetEl.offsetHeight - fromHeight + fromY
      await sheetEl
        .animate(
          [{ transform: `translateY(${offset}px)` }, { transform: 'none' }],
          { duration, easing }
        )
        .finished.catch(() => undefined)
    } else {
      const animation = sheetEl.animate(
        [
          { transform: `translateY(${fromY}px)` },
          { transform: `translateY(${fromHeight - targetHeight}px)` }
        ],
        { duration, easing, fill: 'forwards' }
      )
      await animation.finished.catch(() => undefined)
      settle()
      await tick()
      animation.cancel()
    }
    snapping = false
  }

  function handleHandleClick() {
    if (suppressHandleClick) {
      suppressHandleClick = false
      return
    }
    if (!dragToExpand || !isTop() || dismissing || snapping) return
    void snapTo(!isExpanded)
  }

  function trackHeight(node: HTMLElement) {
    const observer = new ResizeObserver(() => {
      sheetHeights.update((h) => ({ ...h, [id]: node.offsetHeight }))
      if (!isExpanded && dragHeight == null && !snapping && !dismissing) {
        collapsedHeight = node.offsetHeight
      }
    })
    observer.observe(node)
    return {
      destroy() {
        observer.disconnect()
        sheetHeights.update(({ [id]: _, ...rest }) => rest)
      }
    }
  }

  function enterAndRestoreFocus(node: HTMLElement) {
    const opener = deepActiveElement()
    const { reduced, duration, easing } = sheetMotion(
      '--leo-duration-l',
      '--leo-easing-out'
    )
    node.animate(
      reduced
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [{ transform: 'translateY(100%)' }, { transform: 'none' }],
      { duration, easing }
    )
    node.focus({ preventScroll: true })
    return {
      destroy() {
        // Waits for sheets below to drop `inert` before focusing back into them.
        tick().then(() => {
          if (opener?.isConnected) opener.focus({ preventScroll: true })
        })
      }
    }
  }

  function trackMenuItems(node: HTMLElement) {
    const update = () => (hasMenuItems = getItems(node).length > 0)
    const observer = new MutationObserver(update)
    observer.observe(node, { childList: true, subtree: true })
    node
      .querySelectorAll('slot')
      .forEach((slot) => slot.addEventListener('slotchange', update))
    update()
    return { destroy: () => observer.disconnect() }
  }

  // Sheets are bottom-anchored with a top transform-origin, so this places
  // the visual top edge STACK_PEEK_PX * depth above the foreground sheet's top.
  function stackTransform(depth: number, own: number, front: number): string {
    if (depth <= 0) return ''
    const scale = Math.max(0.85, 1 - depth * 0.05)
    const yOffset = Math.max(
      own - front - depth * STACK_PEEK_PX,
      own - getViewportHeight()
    )
    return `translateY(${yOffset}px) scale(${scale})`
  }
</script>

{#if showBackdrop}
  <div
    class="leo-bottomsheet-backdrop"
    role="presentation"
    in:fade={{ duration: backdropFadeMs() }}
    bind:this={backdropEl}
  ></div>
{/if}
{#if rendered}
  <div
    class="leo-bottomsheet"
    class:is-behind={depthBehind > 0}
    class:is-expanded={atFullHeight}
    class:is-dragging={isDragging}
    class:is-dismissing={dismissing}
    class:is-snapping={snapping}
    class:is-compressing={stackAnimating}
    role="dialog"
    aria-modal="true"
    aria-label={label}
    tabindex="-1"
    inert={depthBehind > 0}
    style:height={dragHeight != null ? `${dragHeight}px` : undefined}
    style:max-height={dragHeight != null ? 'none' : undefined}
    style:transform={dragTranslateY
      ? `translateY(${dragTranslateY}px)`
      : stackTransform(depthBehind, ownHeight, frontHeight) || undefined}
    style:--stack-opacity={depthBehind > 0
      ? Math.max(STACK_MIN_OPACITY, 1 - depthBehind * STACK_FADE_STEP)
      : undefined}
    style:z-index={10000 + stackIndex}
    bind:this={sheetEl}
    use:trackHeight
    use:enterAndRestoreFocus
  >
    {#if dragToExpand}
      <button
        type="button"
        class="drag-handle-area"
        aria-label={expandLabel}
        aria-expanded={isExpanded}
        on:click={handleHandleClick}
        on:pointerdown={handlePointerDown}
        on:pointermove={handlePointerMove}
        on:pointerup={handlePointerUp}
        on:pointercancel={handlePointerUp}
      >
        <div class="drag-handle"></div>
      </button>
    {:else if dragToClose}
      <div
        class="drag-handle-area"
        aria-hidden="true"
        on:pointerdown={handlePointerDown}
        on:pointermove={handlePointerMove}
        on:pointerup={handlePointerUp}
        on:pointercancel={handlePointerUp}
      >
        <div class="drag-handle"></div>
      </div>
    {/if}
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
    <div
      class="leo-bottomsheet-content"
      role={hasMenuItems ? 'menu' : undefined}
      bind:this={contentEl}
      use:trackMenuItems
      on:click={handleItemClick}
      on:keydown={handleItemKeydown}
    >
      <slot />
    </div>
  </div>
{/if}

<svelte:window
  on:keydown={handleKeydown}
  on:pointerdown|capture={handleWindowPointerDown}
  on:click={handleWindowClick}
  on:focusin={handleWindowFocusIn}
/>

<style lang="scss">
  :host {
    display: block;
  }

  .leo-bottomsheet-backdrop {
    position: fixed;
    inset: 0;
    background: var(
      --leo-bottomsheet-backdrop-background,
      var(--leo-color-dialogs-scrim-background)
    );
    z-index: 9998;
    -webkit-tap-highlight-color: transparent;
  }

  .leo-bottomsheet {
    position: fixed;
    bottom: 0;
    inset-inline: 0;
    margin: 0 auto;

    width: 100%;
    max-width: var(--leo-bottomsheet-max-width, 480px);

    background: var(
      --leo-bottomsheet-background,
      var(--leo-color-page-background)
    );
    border-radius: var(
        --leo-bottomsheet-border-radius,
        var(--leo-radius-xl)
      )
      var(--leo-bottomsheet-border-radius, var(--leo-radius-xl)) 0 0;
    box-shadow: var(--leo-effect-elevation-02);

    display: flex;
    flex-direction: column;
    gap: var(--leo-spacing-l);
    max-height: var(--leo-bottomsheet-max-height, 85vh);
    overflow: hidden;
    transform-origin: top center;

    transition:
      transform var(--leo-duration-l) var(--leo-easing-in-out),
      background-color var(--leo-duration-l) var(--leo-easing-in-out),
      box-shadow var(--leo-duration-l) var(--leo-easing-in-out),
      border-radius var(--leo-duration-l) var(--leo-easing-in-out);

    &:focus {
      outline: none;
    }

    /* Dims a sheet once another opens in front of it. */
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: var(--leo-color-dialogs-scrim-background);
      opacity: 0;
      pointer-events: none;
      transition: opacity var(--leo-duration-l) var(--leo-easing-in-out);
    }
  }

  .leo-bottomsheet.is-compressing {
    transition-duration: var(--leo-duration-m);
  }

  .leo-bottomsheet.is-snapping {
    transition-property: border-radius;
    transition-duration: var(--leo-duration-m);
  }

  .leo-bottomsheet.is-dragging,
  .leo-bottomsheet.is-dismissing {
    transition: none;
  }

  .leo-bottomsheet.is-expanded {
    height: var(--leo-bottomsheet-expanded-max-height, 100dvh);
    max-height: var(--leo-bottomsheet-expanded-max-height, 100dvh);
    border-radius: 0;
  }

  .leo-bottomsheet.is-behind {
    pointer-events: none;
    box-shadow: none;
    border-radius: var(--leo-bottomsheet-border-radius, var(--leo-radius-xl));

    /* Only the background is translucent: element opacity would let the
       unblurred sheets behind show through the backdrop blur. */
    background-color: color-mix(
      in srgb,
      var(--leo-bottomsheet-background, var(--leo-color-page-background))
        calc(var(--stack-opacity) * 100%),
      transparent
    );

    /* Leo has no blur scale yet, so the default borrows spacing-m (8px). */
    backdrop-filter: var(
      --leo-bottomsheet-stacked-backdrop-filter,
      blur(var(--leo-spacing-m))
    );

    /* Half strength, so the peeking edge stays distinct from the backdrop. */
    &::after {
      opacity: 0.5;
    }

    /* Background sheets are translucent, so their content would show through
       the sheets in front of them. */
    .leo-bottomsheet-content {
      opacity: 0;
    }
  }

  .drag-handle-area {
    all: unset;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    box-sizing: border-box;
    height: var(--leo-spacing-2xl);
    padding-bottom: var(--leo-spacing-m);
    cursor: grab;
    touch-action: none;
    flex-shrink: 0;

    &:active {
      cursor: grabbing;
    }

    /* Extends the grab area over the gap below the handle. */
    &::after {
      content: '';
      position: absolute;
      inset: 0 0 calc(-1 * var(--leo-spacing-l));
    }

    &:focus-visible .drag-handle {
      box-shadow: var(--leo-effect-focus-state);
    }
  }

  .drag-handle {
    width: var(--leo-spacing-3xl);
    height: var(--leo-spacing-s);
    border-radius: var(--leo-radius-full);
    background: var(--leo-color-divider-subtle);
  }

  .leo-bottomsheet-content {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    display: flex;
    flex-direction: column;
    gap: var(--leo-spacing-l);
    padding-bottom: calc(
      var(--leo-spacing-l) + env(safe-area-inset-bottom, 0px)
    );
    transition: opacity var(--leo-duration-l) var(--leo-easing-in-out);
  }

  @media (prefers-reduced-motion: reduce) {
    .leo-bottomsheet,
    .leo-bottomsheet::after,
    .leo-bottomsheet-content {
      transition: none;
    }
  }

  @media (forced-colors: active) {
    .leo-bottomsheet {
      border: 1px solid CanvasText;
    }

    .leo-bottomsheet::after {
      display: none;
    }

    .drag-handle {
      background: CanvasText;
    }

    .drag-handle-area:focus-visible .drag-handle {
      outline: 1px solid Highlight;
      outline-offset: var(--leo-spacing-xs);
    }
  }

  /*
   * Menu items sit in grouped cards (container-background) on the sheet's
   * page-background, matching the Figma bottom sheet.
   */

  :global(.leo-bottomsheet-content ::slotted(*)),
  :global(.leo-bottomsheet-content > *) {
    --leo-menu-item-margin: 0;
    --leo-menu-item-padding: var(--leo-spacing-m);
    --leo-menu-item-border-radius: var(--leo-radius-m);
  }

  :global(.leo-bottomsheet-content ::slotted(leo-title)),
  :global(.leo-bottomsheet-content leo-title) {
    display: block;
    box-sizing: border-box;
    width: 100%;
    padding: var(--leo-spacing-m) var(--leo-spacing-2xl) 0;
    background: transparent;
    font: var(--leo-font-components-label);
    color: var(--leo-color-text-secondary);
  }

  :global(.leo-bottomsheet-content ::slotted(hr)),
  :global(.leo-bottomsheet-content hr) {
    all: unset;
    display: block;
    border-top: 1px solid var(--leo-color-divider-subtle);
    width: 100%;
    margin: 0;
  }

  :global(.leo-bottomsheet-content ::slotted(leo-menu-section)),
  :global(.leo-bottomsheet-content leo-menu-section) {
    display: flex;
    flex-direction: column;
    gap: var(--leo-spacing-s);
    max-height: var(--leo-menu-section-max-height, none);
    overflow-x: hidden;
    overflow-y: auto;
    background: var(
      --leo-bottomsheet-group-background,
      var(--leo-color-container-background)
    );
    padding: var(--leo-bottomsheet-group-padding, var(--leo-spacing-s));
    border-radius: var(--leo-bottomsheet-group-radius, var(--leo-radius-l));
    margin: 0 var(--leo-bottomsheet-group-inset, var(--leo-spacing-l));
  }

  :global(:where(.leo-bottomsheet-content) ::slotted(leo-menu-item)),
  :global(:where(.leo-bottomsheet-content) ::slotted(leo-option)),
  :global(:where(.leo-bottomsheet-content) > leo-menu-item),
  :global(:where(.leo-bottomsheet-content) > leo-option),
  :global(:where(.leo-bottomsheet-content) leo-menu-section leo-menu-item),
  :global(:where(.leo-bottomsheet-content) leo-menu-section leo-option) {
    all: unset;
    cursor: pointer;
    margin: var(--leo-menu-item-margin);
    border-radius: var(--leo-menu-item-border-radius);
    padding: var(--leo-menu-item-padding);
    display: revert;
  }

  /* Unwrapped items still sit on a group card. */
  :global(.leo-bottomsheet-content ::slotted(leo-menu-item)),
  :global(.leo-bottomsheet-content ::slotted(leo-option)),
  :global(.leo-bottomsheet-content > leo-menu-item),
  :global(.leo-bottomsheet-content > leo-option) {
    background: var(
      --leo-bottomsheet-group-background,
      var(--leo-color-container-background)
    );
    margin-inline: var(--leo-bottomsheet-group-inset, var(--leo-spacing-l));
  }

  :global(:where(.leo-bottomsheet-content) ::slotted(leo-menu-item:hover)),
  :global(:where(.leo-bottomsheet-content) ::slotted(leo-option:hover)),
  :global(:where(.leo-bottomsheet-content) > leo-menu-item:hover),
  :global(:where(.leo-bottomsheet-content) > leo-option:hover),
  :global(
      :where(.leo-bottomsheet-content) leo-menu-section leo-menu-item:hover
    ),
  :global(
      :where(.leo-bottomsheet-content) leo-menu-section leo-option:hover
    ) {
    background: var(--leo-color-container-highlight);
  }

  :global(
      :where(.leo-bottomsheet-content) ::slotted(leo-option[aria-selected])
    ),
  :global(
      :where(.leo-bottomsheet-content) ::slotted(leo-menu-item[aria-selected])
    ),
  :global(:where(.leo-bottomsheet-content) ::slotted(leo-option:active)),
  :global(:where(.leo-bottomsheet-content) ::slotted(leo-menu-item:active)),
  :global(:where(.leo-bottomsheet-content) > leo-option[aria-selected]),
  :global(:where(.leo-bottomsheet-content) > leo-menu-item[aria-selected]),
  :global(:where(.leo-bottomsheet-content) > leo-option:active),
  :global(:where(.leo-bottomsheet-content) > leo-menu-item:active),
  :global(
      :where(.leo-bottomsheet-content)
        leo-menu-section
        leo-option[aria-selected]
    ),
  :global(
      :where(.leo-bottomsheet-content)
        leo-menu-section
        leo-menu-item[aria-selected]
    ),
  :global(
      :where(.leo-bottomsheet-content) leo-menu-section leo-option:active
    ),
  :global(
      :where(.leo-bottomsheet-content) leo-menu-section leo-menu-item:active
    ) {
    background: var(--leo-color-container-interactive);
    color: var(--leo-color-text-interactive);
  }

  :global(
      :where(.leo-bottomsheet-content)
        ::slotted(leo-option:focus-visible)
    ),
  :global(
      :where(.leo-bottomsheet-content)
        ::slotted(leo-menu-item:focus-visible)
    ),
  :global(:where(.leo-bottomsheet-content) > leo-option:focus-visible),
  :global(:where(.leo-bottomsheet-content) > leo-menu-item:focus-visible),
  :global(
      :where(.leo-bottomsheet-content)
        leo-menu-section
        leo-option:focus-visible
    ),
  :global(
      :where(.leo-bottomsheet-content)
        leo-menu-section
        leo-menu-item:focus-visible
    ) {
    box-shadow: var(--leo-effect-focus-state);
    /* Box shadows are dropped in forced colours; this outline shows instead. */
    outline: 1px solid transparent;
  }

  :global(.leo-bottomsheet-content leo-menu-section leo-menu-item),
  :global(.leo-bottomsheet-content leo-menu-section leo-option) {
    --leo-menu-item-margin: 0;
  }
</style>

import type { HTMLAttributes as SvelteHTMLAttributes } from 'svelte/elements'

export type HTMLAttributes<T extends EventTarget> = Omit<
  SvelteHTMLAttributes<T>,
  'children'
>

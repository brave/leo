export let sizes = ['small', 'medium'] as const
export type Sizes = (typeof sizes)[number]

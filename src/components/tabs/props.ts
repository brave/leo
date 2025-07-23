export const tabSizes = ['large', 'medium', 'small'] as const
export type TabSize = (typeof tabSizes)[number]

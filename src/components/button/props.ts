export const buttonKinds = ['hero', 'primary', 'secondary', 'tertiary'] as const
export type ButtonKind = (typeof buttonKinds)[number]

export const buttonSizes = ['large', 'medium', 'small'] as const
export type ButtonSize = (typeof buttonSizes)[number]

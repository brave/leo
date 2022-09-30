export const buttonKinds = ['CTA', 'primary', 'secondary', 'tertiary'] as const
export type ButtonKind = (typeof buttonKinds)[number]

export const buttonSizes = ['large', 'medium', 'small'] as const
export type ButtonSize = (typeof buttonSizes)[number]

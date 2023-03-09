export const buttonKinds = ['hero', 'primary', 'secondary', 'tertiary', 'quaternary'] as const
export type ButtonKind = (typeof buttonKinds)[number]

export const buttonSizes = ['jumbo', 'large', 'medium', 'small', 'tiny'] as const
export type ButtonSize = (typeof buttonSizes)[number]

export const textInputTypes = ['text', 'password', 'email', 'search'] as const
export type TextInputType = (typeof textInputTypes)[number]
export const inputTypes = ['text', 'email', 'password', 'search'] as const;
export type InputType = (typeof inputTypes)[number]

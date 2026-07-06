import { camelCase, camelCaseTransformMerge } from 'change-case'

export default (name) => camelCase(name, { transform: camelCaseTransformMerge })

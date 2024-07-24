import { TransformedToken } from 'style-dictionary'

const acceptedTypes = ['font', 'custom-fontStyle']

export default (token: TransformedToken) => acceptedTypes.includes(token.type)

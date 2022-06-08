const acceptedTypes = ['color', 'dimension', 'font', 'custom-radius', 'custom-fontStyle', 'custom-shadow', 'custom-gradient']
const disallowedPathParts = ["android", "ios"]

module.exports = (token) => acceptedTypes.includes(token.type) && !token.path.toString().includes("android") && !token.path.toString().match(new RegExp(`(${disallowedPathParts.join("|")})`))

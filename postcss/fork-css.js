const fs = require('fs')
const path = require('path')

const getInputPath = (root) => root.source.input.file

module.exports = (options = { outputFolder: 'build', match: /^((?!\.(stories|test)).)*\.svelte/gi, dropExtension: true }) => {
  const getOutputFile = (inputFile) => {
    const fileName = path.basename(inputFile, options.dropExtension ? path.extname(inputFile) : undefined);
    const relativePath = path.relative('.', path.resolve(inputFile, '..'))
    return path.join(options.outputFolder, relativePath, fileName + '.css');
  }

  return {
    postcssPlugin: 'fork-css',
    OnceExit: (root) => {
      const inputFile = getInputPath(root);
      if (!options.match.test(inputFile)) return;

      const outputFile = getOutputFile(inputFile);
      fs.mkdirSync(path.dirname(outputFile), { recursive: true });
      fs.writeFileSync(outputFile, root.toString());
    }
  }
}

module.exports.postcss = true;

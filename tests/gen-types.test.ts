const { readFileSync } = require('fs')
describe('gen-types', () => {
  it('generated types smoketest', () => {
    const expectProps = {
      'checkbox': ['checked: boolean', 'isDisabled?: boolean', 'size?: Sizes'],
      'button': [
        'kind?: Props.ButtonKind',
        'size?: Props.ButtonSize',
        'fab?: boolean',
        'loading: {}'
      ],
      'icon': ['name?: IconName', 'forceColor?: boolean', 'title?: string']
    }

    for (const [component, props] of Object.entries(expectProps)) {
      const generatedTypes = readFileSync(
        `./types/src/components/${component}/${component}.svelte.d.ts`,
        'utf-8'
      )
      for (const prop of props) {
        expect(generatedTypes).toContain(prop)
      }
    }
  })
})

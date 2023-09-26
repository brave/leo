import * as React from 'react'
import '../../../tokens/css/variables.css'
import NalaButton from '../../../react/button'
import Tooltip from '../../../react/tooltip'
import styles from './App.module.css'
import Input from '../../../react/input'
import Dropdown from '../../../react/dropdown'
import ButtonMenu from '../../../react/buttonMenu'
import Toggle from '../../../react/toggle'

function App() {
  // Verify that we can change props and children (slots)
  const [buttonText, setButtonText] = React.useState('I am a NALA Button')
  const [spinning, setSpinning] = React.useState(false)

  return (
    <div className={styles['App']} data-theme="dark">
      <header className={styles['App-header']}>
        <h1>A React App</h1>
        <label>
          Edit the button text:
          <Input
            value={buttonText}
            onInput={(e) => setButtonText(e.detail.value)}
          />
        </label>
        {buttonText && (
          <NalaButton
            className={spinning ? 'spin' : ''}
            kind="filled"
            size="large"
            onClick={() => {
              location.hash = ''
              setSpinning((s) => !s)
              alert('clicked!')
            }}
          >
            {buttonText}
          </NalaButton>
        )}
        <div data-theme="dark">
          <Dropdown value="foo">
            <nl-option value="foo">Foo</nl-option>
            <nl-option value="bar">Bar</nl-option>
          </Dropdown>
        </div>
        <ButtonMenu>
          <div slot="anchor-content">ButtonMenu</div>
          <nl-menu-item>Llama2-13b</nl-menu-item>
          <nl-menu-item>Llama2-7b</nl-menu-item>
          <div
            style={{
              padding: '10px 0',
              fontSize: 12,
              borderTop: '1px solid blue'
            }}
          >
            Coding
          </div>
          <nl-menu-item>Llama2-13b</nl-menu-item>
          <nl-menu-item>Llama2-7b</nl-menu-item>
          <div>
            <span>Suggested questions</span>
            <Toggle />
          </div>
        </ButtonMenu>
        <Tooltip text="Hello World">
          <NalaButton href="#foo">Link button!</NalaButton>
        </Tooltip>
      </header>
    </div>
  )
}

export default App

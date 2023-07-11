import * as React from 'react'
import '../../../tokens/css/variables.css'
import LeoButton from '../../../react/button'
import Tooltip from '../../../react/tooltip'
import styles from './App.module.css'
import Dropdown from '../../../react/dropdown'

import { color } from '../../../tokens/css'

color.white

let f = '#FFFFFF'

function App() {
  // Verify that we can change props and children (slots)
  const [buttonText, setButtonText] = React.useState('I am a LEO Button')
  const [spinning, setSpinning] = React.useState(false)

  return (
    <div className={styles['App']}>
      <header className={styles['App-header']}>
        <h1>A React App</h1>
        <label>
          Edit the button text:
          <input
            type="text"
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
          />
        </label>
        {buttonText && (
          <LeoButton
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
          </LeoButton>
        )}
        <div data-theme="dark">
          <Dropdown value="foo">
            <leo-option value="foo">Foo</leo-option>
            <leo-option value="bar">Bar</leo-option>
          </Dropdown>
        </div>
        <Tooltip text="Hello World" visible={spinning} onVisibilitychange={() => { console.log("Closed")}}>
          <LeoButton href="#foo">Link button!</LeoButton>
        </Tooltip>
      </header>
    </div>
  )
}

export default App

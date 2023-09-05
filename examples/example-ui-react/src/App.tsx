import * as React from 'react'
import '../../../tokens/css/variables.css'
import LeoButton from '../../../react/button'
import styles from './App.module.css'
import Input from '../../../react/input'
import Dropdown from '../../../react/dropdown'

function App() {
  // Verify that we can change props and children (slots)
  const [buttonText, setButtonText] = React.useState('I am a LEO Button')
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
        <LeoButton href="#foo">Link button!</LeoButton>
      </header>
    </div>
  )
}

export default App

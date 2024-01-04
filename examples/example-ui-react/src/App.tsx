import * as React from 'react'
import '../../../tokens/css/variables.css'
import LeoButton from '../../../react/button'
import Tooltip from '../../../react/tooltip'
import styles from './App.module.css'
import Input from '../../../react/input'
import Dropdown from '../../../react/dropdown'
import ButtonMenu from '../../../react/buttonMenu'
import Toggle from '../../../react/toggle'
import Icon from '../../../react/icon'

function App() {
  // Verify that we can change props and children (slots)
  const [buttonText, setButtonText] = React.useState('I am a LEO Button')
  const [spinning, setSpinning] = React.useState(false)
  const [isThing, setIsThing] = React.useState(false)

  const handleAction = () => console.log('action')

  return (
    <div className={styles['App']} data-theme="dark">
      <header className={styles['App-header']}>
        <h1>A React App</h1>
        <label>
          Edit the button text:
          <Input
            value={buttonText}
            placeholder="Set button text"
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
        <ButtonMenu>
          <LeoButton fab kind="plain-faint" slot="anchor-content">
            <Icon name="more-horizontal" />
          </LeoButton>
          <leo-menu-item onClick={handleAction}>Llama2-13b</leo-menu-item>
          <leo-menu-item onClick={handleAction}>Llama2-7b</leo-menu-item>
          <div
            style={{
              padding: '10px 0',
              fontSize: 12,
              borderTop: '1px solid blue'
            }}
          >
            Coding
          </div>
          <leo-menu-item onClick={handleAction}>Llama2-13b</leo-menu-item>
          <leo-menu-item onClick={handleAction}>Llama2-7b</leo-menu-item>
          <div onClick={() => setIsThing(!isThing)}>
            <span>Suggested questions</span>
            <Toggle checked={isThing} />
          </div>
          <leo-menu-item
            onClick={() => setIsThing(!isThing)}
            data-is-interactive={true}
          >
            <span>Suggested questions</span>
            <Toggle checked={isThing} />
          </leo-menu-item>
        </ButtonMenu>
        <Tooltip text="Hello World">
          <LeoButton href="#foo">Link button!</LeoButton>
        </Tooltip>
      </header>
    </div>
  )
}

export default App

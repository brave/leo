import * as React from 'react'
import '@brave/leo/tokens/css/variables.css'
import LeoButton from '@brave/leo/react/button'
import Tooltip from '@brave/leo/react/tooltip'
import Input from '@brave/leo/react/input'
import Dropdown from '@brave/leo/react/dropdown'
import ButtonMenu from '@brave/leo/react/buttonMenu'
import Toggle from '@brave/leo/react/toggle'
import Icon from '@brave/leo/react/icon'
import styles from './App.module.css'

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
        <Input value={buttonText} onInput={(e: any) => setButtonText(e.value)}>
          Edit the button text:
          {buttonText.length % 2 === 0 && <Icon name='loading-spinner' slot="left-icon"/>}
        </Input>
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

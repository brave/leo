import * as React from 'react'
import '@brave/nala/tokens/css/variables.css'
import LeoButton from '@brave/nala/react/button'
import Tabs from '@brave/nala/react/tabs'
import TabItem from '@brave/nala/react/tabItem'
import Tooltip from '@brave/nala/react/tooltip'
import Input from '@brave/nala/react/input'
import Dropdown from '@brave/nala/react/dropdown'
import ButtonMenu from '@brave/nala/react/buttonMenu'
import Toggle from '@brave/nala/react/toggle'
import Icon from '@brave/nala/react/icon'

import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource-variable/inter/index.css'

function App() {
  // Verify that we can change props and children (slots)
  const [buttonText, setButtonText] = React.useState('I am a LEO Button')
  const [spinning, setSpinning] = React.useState(false)
  const [isThing, setIsThing] = React.useState(false)

  const handleAction = (e: MouseEvent) => {
    console.log('action, with meta key down?', e.metaKey)
  }

  return (
    <>
      <header>
        <h1>A React App</h1>
      </header>
      <section>
        <Input value={buttonText} onInput={(e: any) => setButtonText(e.value)}>
          Edit the button text:
          {buttonText.length % 2 === 0 && (
            <Icon name="loading-spinner" slot="left-icon" />
          )}
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
        <Tabs value="1">
          <TabItem value="1">Tab 1</TabItem>
          <TabItem value="2">Tab 2</TabItem>
          <TabItem value="3">Tab 3</TabItem>
        </Tabs>
        <Tooltip text="Hello World">
          <LeoButton href="#foo">Link button!</LeoButton>
        </Tooltip>
      </section>
    </>
  )
}

export default App

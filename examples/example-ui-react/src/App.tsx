import * as React from 'react';
import "../../../build/css/_variables.css"
import LeoButton from '../../../web-components/button/react'
import styles from './App.module.css';
import SvelteReactComponent, { HelloEvent } from './MySvelteComponent/react'

function App() {
  // Verify that we can change props and children (slots)
  const [acted, setActed] = React.useState(false)
  React.useEffect(() => {
    setTimeout(() => setActed(true), 4000)
  }, [])

  function handleSvelteComponentHello (e: HelloEvent) {
    console.log('onhello from react', e)
    alert('react svelte wc hello ' + e.detail.text)
  }

  return (
    <div className={styles['App']}>
      <header className={styles['App-header']}>
        <h1>A React App</h1>
        <LeoButton 
          kind='primary' 
          size='medium'
          onClick={() => alert('clicked')}
        >
            I am a LEO Button
        </LeoButton>
        <SvelteReactComponent 
          button_text={'ATTRIBUTE TEXT FROM REACT' + (acted ? ':MODIFIED' : '')} 
          onHello={handleSvelteComponentHello}
        >
          Inside contents from react{acted ? ' MODIFIED' : ''}
        </SvelteReactComponent>
      </header>
    </div>
  );
}

export default App;

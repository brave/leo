import * as React from 'react';
import "../../../tokens/css/variables.css"
import LeoButton from '../../../react/button'
import styles from './App.module.css';

function App() {
  // Verify that we can change props and children (slots)
  const [acted, setActed] = React.useState(false)
  React.useEffect(() => {
    setTimeout(() => setActed(true), 4000)
  }, [])

  const [buttonText, setButtonText] = React.useState('I am a LEO Button');

  return (
    <div className={styles['App']}>
      <header className={styles['App-header']}>
        <h1>A React App</h1>
        <label>
          Edit the button text:
          <input type="text" value={buttonText} onChange={e => setButtonText(e.target.value)} />
        </label>
        <LeoButton
          kind='primary'
          size='large'
          onClick={() => {
            location.hash = ''
            alert('clicked!')
          }}
        >
          {buttonText}
        </LeoButton>
        <LeoButton href='#foo'>Link button!</LeoButton>
      </header>
    </div>
  );
}

export default App;

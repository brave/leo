import * as React from 'react'
import styles from './component.module.scss'

interface Props {}

export default function MyComponent(props: Props) {
  return <div className={styles.component}>a react component</div>
}

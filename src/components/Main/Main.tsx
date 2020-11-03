import React, { ReactElement } from 'react'
import style from './Main.module.scss'

interface Props {}

const Main = (props: Props): ReactElement => {
  return <h1 className={style.main__title}>Hello smena</h1>
}

export default Main

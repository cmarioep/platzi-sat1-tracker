import { useState } from 'react'
import Viewer from '../component/Viewer'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Viewer />
    </>
  )
}

export default App

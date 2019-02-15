import React, { useState, useEffect } from 'react'
import './App.css'
import styled from 'styled-components'
import openSocket from 'socket.io-client';

const NoisyBg = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100vh;
  background-color: ${props => props.noisy ? 'red' : 'white'}
`

const App = () => {
  const [noisy, setNoisy] = useState(false)
  const [value, setValue] = useState({})

  useEffect(() => {
    const socket = openSocket('http://localhost:1337')
    socket.on('transcript', ({ transcript, confidence, soundLevel }) => {
      if (transcript && confidence && soundLevel) {
        console.log('yeah', confidence, soundLevel)
        setNoisy(confidence <= 0.8 && soundLevel > -60)
      }
      setValue({transcript, confidence, soundLevel})
    })
  }, [])

  return <NoisyBg noisy={noisy}>
    { noisy && 'Shut up!' }
    { JSON.stringify(value) }
  </NoisyBg>
}

export default App

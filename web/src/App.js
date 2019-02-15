import React, { useState, useEffect } from 'react'
import './App.css'
import styled from 'styled-components'
import openSocket from 'socket.io-client'

const NoisyBg = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100vh;
  background-color: ${props => (props.noisy ? 'red' : 'white')};
`

const smiley = mood => (
  <div class={`smiley ${mood}`}>
    <div class="eyes">
      <div class="eye" />
      <div class="eye" />
    </div>
    <div class="mouth" />
  </div>
)

const App = () => {
  const [noisy, setNoisy] = useState(false)
  const [value, setValue] = useState({})
  // const [mood, setMood] = useState('normal')

  useEffect(() => {
    const socket = openSocket('http://localhost:1337')
    socket.on('transcript', ({ transcript, confidence, soundLevel }) => {
      if (soundLevel) {
        setValue({ transcript, confidence, soundLevel })
        setNoisy(confidence <= 0.8 && soundLevel > -55)
      }
    })
  }, [])

  return (
    <NoisyBg noisy={noisy}>
      {noisy && 'Shut up!'}
      {JSON.stringify(value)}
      {smiley(noisy ? 'angry' : value.soundLevel < -50 ? 'normal' : 'happy')}
    </NoisyBg>
  )
}

export default App

import React, { useState, useEffect } from 'react'
import './App.css'
import styled from 'styled-components'
import openSocket from 'socket.io-client'
import { Planet } from 'react-kawaii'

const NoisyBg = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100vh;
  background-color: ${props => (props.noisy ? 'red' : 'white')};
`

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
      <Planet
        size={1200}
        mood={noisy ? 'sad' : value.soundLevel < -50 ? 'happy' : 'blissful'}
        color="#FCCB7E"
      />
      {/* {smiley(noisy ? 'angry' : value.soundLevel < -50 ? 'normal' : 'happy')} */}
    </NoisyBg>
  )
}

export default App

import React, { useState, useEffect } from 'react'
import './App.css'
import styled from 'styled-components'
import openSocket from 'socket.io-client'
import { Planet } from 'react-kawaii'

const NOISE_SOUND_THRESHOLD = -65
const NOISE_CONFIDENCE_THRESHOLD = 0.8
let noiseCounter = 0

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
      setValue({ transcript, confidence, soundLevel })
      if (confidence <= NOISE_CONFIDENCE_THRESHOLD && soundLevel > NOISE_SOUND_THRESHOLD) {
        noiseCounter++
        if (noiseCounter > 1) setNoisy(true)

      } else {
        setNoisy(false)
        noiseCounter = 0
      }
    })
  }, [])

  return (
    <NoisyBg noisy={noisy}>
      {noisy && 'Shut up!'}
      {JSON.stringify(value)}
      <Planet
        size={200}
        mood={noisy ? 'sad' : value.soundLevel < NOISE_SOUND_THRESHOLD ? 'happy' : 'blissful'}
        color="#FCCB7E"
      />
      { value.transcript }
      {/* {smiley(noisy ? 'angry' : value.soundLevel < -50 ? 'normal' : 'happy')} */}
    </NoisyBg>
  )
}

export default App

const PassThrough = require('stream').PassThrough
const record = require('node-record-lpcm16')
const Analyser = require('audio-analyser')
const Generator = require('audio-generator')

const speech = require('@google-cloud/speech')
const client = new speech.SpeechClient()

const encoding = 'LINEAR16'
const sampleRateHertz = 16000
const languageCode = 'sv-SE'

const request = {
  config: {
    encoding,
    sampleRateHertz,
    languageCode
  },
  singleUtterance: true,
  interimResults: true
}

let listens = 0
let volume = 0

const recognizeStream = client
  .streamingRecognize(request)
  .on('error', console.error)
  .on('data', data => {
    const isFinal = data.results.find(({ isFinal }) => isFinal)
    if (isFinal) {
      console.log('google.isFinal')
      record.stop()
      return
    }
    data.results
      // .filter(({ isFinal }) => isFinal)
      .forEach(result => {
        console.log(result.alternatives[0].transcript)
      })
  })
  .on('close', () => {
    console.log('google.close')
  })

// Create a recognize stream
const startListening = () => {
  const session = {
    id: listens,
    levels: []
  }
  console.log('startListening')

  const audioStream = record
    .start({
      sampleRateHertz,
      threshold: 0,
      verbose: false,
      recordProgram: 'rec',
      silence: '3.0'
    })
    .on('error', console.error)
    .on('close', () => {
      console.log('audioStream.close')
      startListening()
      listens++
    })

  const recognizeStream = client
    .streamingRecognize(request)
    .on('error', console.error)
    .on('data', data => {
      const isFinal = data.results.find(({ isFinal }) => isFinal)
      if (isFinal) {
        console.log('google.isFinal')
        sum = session.levels.reduce((a, b) => a + b)
        avg = sum / session.levels.length
        console.log('volume for session', avg)
        if (avg > -50) {
          console.log('HÅLL KÄFTEN')
        }
        record.stop()
        return
      }
      data.results
        // .filter(({ isFinal }) => isFinal)
        .forEach(result => {
          console.log(
            `${session.id} - ${result.alternatives[0].transcript} - ${volume}dB`
          )
        })
    })

  const analyser = new Analyser({
    minDecibels: -100,
    maxDecibels: 100,
    fftSize: 1024,
    frequencyBinCount: 1024 / 2,
    smoothingTimeConstant: 0.2,
    channel: 0,
    bufferSize: 44100
  }).on('data', function() {
    volume = this.getFrequencyData().reduce((i, max) => (i > max ? i : max))
    session.levels.push(volume)
  })

  // audioStream.pipe(recognizeStream)
  audioStream.pipe(analyser)
  analyser.pipe(recognizeStream)
}
// analyser.on('close', () => {
//   console.log('analyser was closed')
// })

startListening()
// Generator({
//   generate: function() {
//     return Math.random()
//   },
//   samplesPerFrame: 64,
//   duration: 1
// }).pipe(analyser)

const record = require('node-record-lpcm16')
const Analyser = require('audio-analyser')
const speech = require('@google-cloud/speech').v1p1beta1
const client = new speech.SpeechClient()

const encoding = 'LINEAR16'
const sampleRateHertz = 16000
const languageCode = 'sv-SE'
const levels = []
let volume = 0

const request = {
  config: {
    encoding,
    sampleRateHertz,
    languageCode,
    // model: 'video',
    enableSpeakerDiarization: true
  },
  singleUtterance: false,
  interimResults: true
}

const audioStream = record
  .start({
    sampleRateHertz,
    threshold: 0,
    verbose: true,
    recordProgram: 'rec',
    silence: '2.0'
  })
  .on('error', console.error)

const recognizeStream = client
  .streamingRecognize(request)
  .on('error', () => process.exit(1))
  .on('data', data => {
    const isFinal = data.results.find(({ isFinal }) => isFinal)
    if (isFinal) {
      record.stop()
    }
    data.results.forEach(result => {
      console.log(`${result.alternatives[0].transcript}`)
    })
  })
  .on('close', () => {
    const avgLevel = levels.reduce((a, b) => a + b) / levels.length
    process.exit(0)
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
  levels.push(volume)
})

audioStream.pipe(analyser)
analyser.pipe(recognizeStream)

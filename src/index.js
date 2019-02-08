const io = require('socket.io')(1337)
const { spawn } = require('child_process')
const understand = require('./understand')

const start = () => {
  console.log('start listen session')
  const listen = spawn('npm', ['run', 'listen'])

  listen.stdout.on('data', async data => {
    const text = data.toString()
    console.log(text)
    const sentiment = await understand(text)
    console.log(sentiment)
  })

  listen.on('close', code => {
    console.log('closed')
    start()
  })
}

start()

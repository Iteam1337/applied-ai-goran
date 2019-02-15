const io = require('socket.io')(1337)
const { spawn } = require('child_process')

const start = () => {
  const listen = spawn('npm', ['run', 'listen'])

  listen.stdout.on('data', async data => {
    try {
      const message = JSON.parse(data.toString())
      io.emit('transcript', message)
    } catch (e) {
      console.log("couldn't parse", data.toString())
    }
  })

  listen.on('close', code => {
    console.log('closed')
    start()
  })

  setInterval(() => {
    io.emit('transcript', {
      transcript: 'hej det här är ett automatiskt meddelande',
      confidence: 0.8,
      soundLevel: 7
    })
    console.log('deo')
  }, 1000)
}

start()

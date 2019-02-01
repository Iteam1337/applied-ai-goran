const socket = io.connect('http://localhost:1337')

socket.on('connect', () => console.log('connected!'))

socket.on('shutup', () => {
  chrome.tabs.query({ index: 0, currentWindow: true }, (tabs) => {
    const tab = tabs[0]
    const message = {
        text: 'SHUT UP'
    }

    chrome.tabs.sendMessage(tab.id, message, () => {});
  })
})

socket.on('transcript', transcript => {
  chrome.tabs.query({ index: 0, currentWindow: true }, (tabs) => {
    const tab = tabs[0]
    const message = {
        text: transcript
    }
    chrome.tabs.sendMessage(tab.id, message, () => {});
});

})
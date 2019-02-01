chrome.runtime.onMessage.addListener((msg, sender, respond) => {
	document.querySelectorAll('[aria-label="Skicka ett meddelande till alla"]')[1].setAttribute('aria-disabled', false)
	document.querySelectorAll('[aria-label="Skicka ett meddelande till alla"]')[1].setAttribute('disabled', false)
	document.querySelectorAll('[aria-label="Skicka ett meddelande till alla"]')[0].value = msg.text
	document.querySelectorAll('[aria-label="Skicka ett meddelande till alla"]')[1].click()
});
var mirror = document.getElementById("mirror")
var reflection = document.getElementById("reflection")
var mirrorFocus = false

document.addEventListener("DOMContentLoaded", () => {
	_onMirrorInput(mirror.value)
})


function _onMirrorInput(value) {
	reflection.innerText = value
}

function _onReflectionClick() {
	mirrorFocus = !mirrorFocus
	if (mirrorFocus) {
		mirror.focus()
	} else {
		mirror.blur()
	}
}

function _onClearClick() {
	mirror.value = ""
	reflection.innerText = ""
}

function _onJishoClick() {
	let userInput = encodeURIComponent(mirror.value)

	let newUrl = `https://jisho.org/search/${userInput}`
	window.location.assign(newUrl)
}
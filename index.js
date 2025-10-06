// Shortcut for this long ass function name
function $(query) {
	return document.querySelector(query)
}


// HTML Element References 
var mirror = $("#mirror")
var reflection = $("#reflection")
var jishoAnchor = $("#jisho-anchor")

// States
var mirrorFocus = false

document.addEventListener("DOMContentLoaded", () => {
	_onMirrorInput(mirror.value)
})


function _onMirrorInput(value) {
	reflection.innerText = value

	let userInput = encodeURIComponent(mirror.value)
	let newUrl = `https://jisho.org/search/${userInput}`
	jishoAnchor.href = newUrl
}

function _onMirrorClick() {
	mirrorFocus = true
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
	jishoAnchor.href = "https://jisho.org/search/"
}

async function _onPasteClick() {
	navigator.clipboard
	.readText()
	.then((clipText) => {
		mirror.value = clipText
		_onMirrorInput(clipText)
	})
}

async function _onCopyClick() {
	navigator.clipboard.writeText(mirror.value)
}


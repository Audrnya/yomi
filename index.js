// Shortcut for this long ass function name
function $(query) {
	return document.querySelector(query)
}


// HTML Element References 
var mirror = $("#mirror")
var reflection = $("#reflection")
var jishoAnchor = $("#jisho-anchor")


document.addEventListener("DOMContentLoaded", () => {
	_onMirrorInput(mirror.value)
})


function _onMirrorInput(value) {
	reflection.innerText = value

	let userInput = encodeURIComponent(mirror.value)
	let newUrl = `https://jisho.org/search/${userInput}`
	jishoAnchor.href = newUrl
}


function _onReflectionClick() {
	// This is the text within Reflection because
	// this event only happens inside it.
	let selection = window.getSelection()
	let range = selection.getRangeAt(0) // it's always 1 i guess
	mirror.focus()
	mirror.setSelectionRange(range.startOffset, range.endOffset)
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


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
	_initWtfTabs()
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

// Tab functionality for wtf section
// *need a bit of improvement if i wanna use this more than once
function _initWtfTabs() {
	const tabs = document.querySelectorAll('#wtf-tabs li');
	const tabContent = document.querySelectorAll('.wtf-tab');

	tabs.forEach(tab => {
		tab.addEventListener('click', () => {
			// Remove active class from all tabs
			tabs.forEach(t => t.classList.remove('is-active'));
			// Hide all content
			tabContent.forEach(c => c.classList.add('is-hidden'));

			// Add active class to clicked tab
			tab.classList.add('is-active');
			// Show the related content
			const target = tab.dataset.tab;
			$("#"+target).classList.remove('is-hidden');

		});
	});
}

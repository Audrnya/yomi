// Shortcut for this long ass function name
function $(query) {
	return document.querySelector(query)
}


// HTML Element References 
var mirror = $("#mirror")
var mirrorImage = $("#mirrorImage")
var mirrorFileButton = $("#mirrorFileButton")
var mirrorTextButton = $("#mirrorTextButton")
var reflection = $("#reflection")
var jishoAnchor = $("#jisho-anchor")


document.addEventListener("DOMContentLoaded", () => {
	_onMirrorInput(mirror.value)
	_initWtfTabs()
	checkSavedTheme()
})


function setTheme(theme) {
	let themeButton = $("#theme-button")
	let themeIcon = $("#theme-icon")
	let literallyHtml = document.documentElement

	if (!theme) {
		// No value so reverse the theme
		theme = (literallyHtml.dataset.theme === "dark") ? "light" : "dark"
	}
	
	if (literallyHtml.dataset.theme === theme) {
		// It's already the same theme
		return
	}
	
	// Replace the theme for the whole page
	literallyHtml.dataset.theme = theme

	// Update button looks
	if (theme == "dark") {
		themeButton.classList.replace("is-warning", "is-link")
		themeIcon.classList.replace("fa-sun", "fa-moon")
	} else {
		themeButton.classList.replace("is-link", "is-warning")
		themeIcon.classList.replace("fa-moon", "fa-sun")
	}

	// Update theme for all other buttons on the page
	let ignoredIDs = ["theme-button"] 
	let oppositeTheme = (theme === "dark") ? "is-light" : "is-dark"
	let buttons = document.getElementsByClassName("button")
	for (let i = 0; i < buttons.length; i++) {
		if (ignoredIDs.includes(buttons[i].id)) {
			continue
		}
		buttons[i].classList.replace(oppositeTheme, `is-${theme}`)
	}

	localStorage.setItem("theme", theme)
}

function checkSavedTheme() {
	let theme = localStorage.getItem("theme")
	if (!theme) {
		let prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
		theme = (prefersDark) ? "dark" : "light"
	}
	setTheme(theme)
}

function showMirrorImage() {
	// Show the image and hide Mirror
	mirrorImage.parentElement.classList.remove("is-hidden")
	mirrorFileButton.classList.replace("is-flex", "is-hidden")
	mirrorTextButton.classList.replace("is-hidden", "is-flex")
	mirror.classList.add("is-hidden")
}

function hideMirrorImage() {
	// above but reverse
	mirrorImage.parentElement.classList.add("is-hidden")
	mirrorFileButton.classList.replace("is-hidden", "is-flex")
	mirrorTextButton.classList.replace("is-flex", "is-hidden")
	mirror.classList.remove( "is-hidden")
}

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

function _onThemeButtonClick() {
	setTheme()
}

// Tab functionality for wtf section
// *need a bit of improvement if i wanna use this more than once
function _initWtfTabs() {
	let tabs = document.querySelectorAll('#wtf-tabs li');
	let tabContent = document.querySelectorAll('.wtf-tab');

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

function _onMirrorFileButtonClicked() {
	$("#fileInput").click();
}

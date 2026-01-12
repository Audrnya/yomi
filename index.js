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

var jishoContainer = $("#jisho-container")
var jishoAnchor = $("#jisho-anchor")
var jishoLoadingSpin = $("#jisho-loading-spin")
var jishoFrame = $("#jisho-frame")


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
	mirror.classList.remove("is-hidden")
}

function isMirrorImageVisible() {
	return !mirrorImage.parentElement.classList.contains("is-hidden")
}

function toggleMirrorImage() {
	if (isMirrorImageVisible()) {
		hideMirrorImage()
	} else {
		showMirrorImage()
	}
}

function selectMirror(event) {
	if (document.activeElement !== mirror) {
		mirror.focus()
		event.preventDefault()
	}
}

function deselectMirror() {
	mirror.blur()
}


function _onMirrorInput(value) {
	reflection.innerText = value
}

function _onReflectionClick() {	
	if (!mirror.classList.contains("is-hidden")) {
		// This is the text within Reflection because
		// this event only happens inside it.
		let selection = window.getSelection()
		let range = selection.getRangeAt(0) // there is always only 1 range in this context i guess
		let offsets = _getCharacterOffsetWithin(range, reflection)

		mirror.focus()
		mirror.setSelectionRange(offsets.start, offsets.end)

	} else {
		// Focus on mirrorImage's container to listen for paste events 
		mirrorImage.parentElement.focus()
	}
}

function _onJishoButtonClick() {
	let rawUrl = `https://jisho.org/search/${mirror.value}`

	let userInput = encodeURIComponent(mirror.value)
	let encodedUrl = `https://jisho.org/search/${userInput}`

	jishoAnchor.href = encodedUrl
	jishoAnchor.innerHTML = `<i class="fa-solid fa-link"></i> ${rawUrl}`
	jishoFrame.src = encodedUrl

	// Show the iframe container
	jishoContainer.classList.remove("is-hidden")

	// Wait for the url to load
	jishoLoadingSpin.classList.remove("is-hidden")
	jishoFrame.classList.add("is-invisible")

	jishoContainer.scrollIntoView({ behavior: "smooth" })
}

function _onJishoFrameLoad() {
	jishoLoadingSpin.classList.add("is-hidden")
	jishoFrame.classList.remove("is-invisible")
}

function _onJishoCloseClick() {
	jishoContainer.classList.add("is-hidden")
}

function _onClearClick() {
	mirror.value = ""
	reflection.innerText = ""
	jishoContainer.classList.add("is-hidden")
	mirrorImage.src = "assets/images/gasp.jpg"
	hideMirrorImage()
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

// Utility: get character offset from a Range inside a node
function _getCharacterOffsetWithin(range, node) {
    let treeWalker = document.createTreeWalker(
        node,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

	// Count characters from text nodes
    let charCount = 0;
    while(treeWalker.nextNode()) {
        let currentNode = treeWalker.currentNode;
        if(currentNode === range.startContainer) {
            var start = charCount + range.startOffset;
        }
        if(currentNode === range.endContainer) {
            var end = charCount + range.endOffset;
            break;
        }
        charCount += currentNode.textContent.length;
    }

    // Fallback: if start or end weren't set (like on non-text nodes)
    if(start === undefined || end === undefined) {
        const fullText = node.textContent;
        const selectionText = range.toString();
        start = fullText.indexOf(selectionText);
        end = start + selectionText.length;
    }

    return {start, end};
}

function _onMirrorFileButtonClicked() {
	$("#fileInput").click();
}

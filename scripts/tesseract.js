const worker = await Tesseract.createWorker(
	"jpn", 
	2, // TESSERACT_LSTM_COMBINED: 2
	// {
	// 	logger: function(m) { console.log(m); }
	// }
); 
await worker.setParameters({
	tessedit_pageseg_mode: 1, // Automatic page segmentation with orientation and script detection. (OSD)
	preserve_interword_spaces: '1' /* I think this means don't */
})


async function scanAndReflect(image) {
	// Show the image and hide Mirror
	mirrorImage.src = URL.createObjectURL(image)
	showMirrorImage()

	// Scan the image and write result
	const result = await worker.recognize(image)

	mirror.value = result.data.text
	_onMirrorInput(result.data.text)
}


// Scan images from fileInput
$("#fileInput").addEventListener("change", async (event) => {
	if (event.target.files.length <= 0) {
		// no files for some reason?
		return
	}

	// Get the uploaded image
	const image = event.target.files[0]

	scanAndReflect(image)
})

function _handlePaste(event) {
    const items = event.clipboardData.items

    for (let i = 0; i < items.length; i++) {
        const item = items[i]

		// Image pasted
        if (item.type.indexOf("image") !== -1) {
            const file = item.getAsFile() // get the image as a File object
            scanAndReflect(file)

			return
        }
		// Plain text pasted in front of mirror image
		else if (isMirrorImageVisible() &&
				 item.type.indexOf("text/plain") !== -1
		) {
			item.getAsString((text) => {
				mirror.value = text
				_onMirrorInput(text)
			})
			hideMirrorImage()
			
			return
		}/* else {
			console.log(`Ignoring invalid pasted content: ${item.type}`)
			item.getAsString((s) => {
				console.log(s)
			})
		} */
    }
}

mirror.addEventListener("paste", _handlePaste)
mirrorImage.parentElement.addEventListener("paste", _handlePaste)

function _handleDrop(event) {
	const file = event.dataTransfer.files[0]
	if (!file) {
		return
	}

	// Only allow images
	if (!file.type.startsWith("image/")) {
		console.log(`Ignoring invalid dropped content: ${file.type}`)
		return
	}
	
	scanAndReflect(file)
}

["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
	document.body.addEventListener(eventName, e => e.preventDefault())
	// mirrorImage.addEventListener(eventName, e => e.preventDefault())
})
document.body.addEventListener("drop", _handleDrop)
// mirrorImage.parentElement.addEventListener("drop", _handleDrop)


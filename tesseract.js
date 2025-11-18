const worker = await Tesseract.createWorker(
	"jpn", 
	2, // TESSERACT_LSTM_COMBINED: 2
	// {
	// 	logger: function(m) { console.log(m); }
	// }
); 
await worker.setParameters({
	preserve_interword_spaces: '1' /* I think this means don't? */
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
        if (item.type.indexOf("image") !== -1) {
            const file = item.getAsFile() // get the image as a File object
            scanAndReflect(file)

			return
        }
    }
}

$("#mirror").addEventListener("paste", _handlePaste)
$("#mirrorImage").parentElement.addEventListener("paste", _handlePaste)

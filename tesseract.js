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


// Scan images from fileInput
$("#fileInput").addEventListener("change", async (e) => {
	if (e.target.files.length <= 0) {
		// no files for some reason?
		return
	}

	// Get the uploaded image
	const image = e.target.files[0]

	// Show the image and hide Mirror
	mirrorImage.src = URL.createObjectURL(image)
	showMirrorImage()

	// Scan the image and write result
	const result = await worker.recognize(image);

	mirror.value = result.data.text
	_onMirrorInput(result.data.text);
})

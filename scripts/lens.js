const FILE_STORAGE_API = "https://litterbox.catbox.moe/resources/internals/api.php"
const GOOGLE_LENS_URL = "https://lens.google.com/uploadbyurl?url="


async function openGoogleLens(image) {
	let cdn_url = await upload(image)
	forward(cdn_url)
}

async function upload(file, time = '1h') {
	// Validate time parameter
	const validTimes = ['1h', '12h', '24h', '72h'];
	if (!validTimes.includes(time)) {
		throw new Error('Time must be 1h, 12h, 24h, or 72h');
	}

	// Create FormData object
	const formData = new FormData();
	formData.append('reqtype', 'fileupload');
	formData.append('time', time);
	formData.append('fileToUpload', file);

	try {
		const response = await fetch(FILE_STORAGE_API, {
		method: 'POST',
		body: formData
		});

		if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
		}

		// The response is the direct URL to the uploaded file
		const url = await response.text();
		return url.trim();

	} catch (error) {
		console.error('Upload failed:', error);
		throw error;
	}
}

function forward(image_url) {
	var destination = GOOGLE_LENS_URL + image_url
	window.open(destination, "_blank");
}

// Scan images from fileInput
$("#fileInput").addEventListener("change", async (event) => {
	if (event.target.files.length <= 0) {
		// no files for some reason?
		return
	}

	// Get the uploaded image
	const image = event.target.files[0]

	openGoogleLens(image)
})

function _handlePaste(event) {
    const items = event.clipboardData.items

    for (let i = 0; i < items.length; i++) {
        const item = items[i]

		// Image pasted
        if (item.type.indexOf("image") !== -1) {
            const file = item.getAsFile() // get the image as a File object
            openGoogleLens(file)

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
	
	openGoogleLens(file)
}

["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
	document.body.addEventListener(eventName, e => e.preventDefault())
	// mirrorImage.addEventListener(eventName, e => e.preventDefault())
})
document.body.addEventListener("drop", _handleDrop)
// mirrorImage.parentElement.addEventListener("drop", _handleDrop)


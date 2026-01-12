/* Actions defined in index.js */

// A wrapper function that takes a function
// and calls it along with preventing default
// actions. It returns a function that takes an 
// event as an argument. 
function preventDefault(callable) {
	return (event) => {
		callable()
		event.preventDefault()
	}
}

// Keymap object: maps keys to functions
const keyMap = {
    "Enter": selectMirror,
    "Escape": deselectMirror,
	"F1": _onClearClick, 
	"F3": toggleMirrorImage,
	"F4": preventDefault(_onJishoButtonClick),
};

// Listen for keydown events on the whole page
document.addEventListener("keydown", (event) => {
    const key = event.key; // gets the key pressed (case-sensitive)
	// console.log(key)
    if (keyMap[key]) {
        keyMap[key](); // call the corresponding function
        // event.preventDefault(); // optional: prevents default action
    }
});

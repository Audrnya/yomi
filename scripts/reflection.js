/**
 * long ass code for Reflection to send the range of selection
 * to mirror
 */

function getCharacterOffsetWithin(range, node) {
    let treeWalker = document.createTreeWalker(
        node,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    let charCount = 0;
    let start, end;
    let previousTextNode = null;
    
    while(treeWalker.nextNode()) {
        let currentNode = treeWalker.currentNode;
        
        // Check if we need to add a newline for block elements between text nodes
        if(previousTextNode) {
            let needsNewline = false;
            let walker = previousTextNode;
            
            // Walk up and check if there's a block boundary
            while(walker && walker !== node) {
                let next = walker.nextSibling;
                if(next) {
                    // Check if next sibling is a block element or if we're exiting a block
                    if(next.nodeType === Node.ELEMENT_NODE && isBlockElement(next)) {
                        needsNewline = true;
                        break;
                    }
                    if(next.contains(currentNode)) {
                        break;
                    }
                }
                walker = walker.parentNode;
                
                // Check if we're moving to next block sibling
                if(walker && walker !== node) {
                    let nextBlock = walker.nextSibling;
                    if(nextBlock && nextBlock.contains(currentNode)) {
                        if(isBlockElement(walker) || isBlockElement(nextBlock)) {
                            needsNewline = true;
                            break;
                        }
                    }
                }
            }
            
            if(needsNewline) {
                charCount += 1; // Add newline
            }
        }
        
        if(currentNode === range.startContainer) {
            start = charCount + range.startOffset;
        }
        if(currentNode === range.endContainer) {
            end = charCount + range.endOffset;
            break;
        }
        
        charCount += currentNode.textContent.length;
        previousTextNode = currentNode;
    }
    
    // Fallback: if start or end weren't set
    if(start === undefined || end === undefined) {
        const fullText = node.textContent;
        const selectionText = range.toString();
        start = fullText.indexOf(selectionText);
        end = start + selectionText.length;
    }
    
    return {start, end};
}

function isBlockElement(element) {
    if(!element || element.nodeType !== Node.ELEMENT_NODE) return false;
    const blockElements = ['DIV', 'P', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BR'];
    return blockElements.includes(element.tagName);
}
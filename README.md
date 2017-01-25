# privacy-field

The purpose of this file is to hide (mask) the text or value of elements (spans, divs, input fields, etc...) that should not show
there data by default.  An "eye" button is created next to these elements that can toggle the masking on/off.

This js file searches through the dom to find elements to find class with "all-seeing-eye-text".
If found the element is either masked with the innerHTML or a clone is created (for input fields) and the clone masks the value.

When the file is loaded it creates a global (all_seeing_eye).  Once it has been parsed it will execute the setup function to find
and masks the targeted elements.

all_seeing_eye exposes
setup() -> attach events to the document & document.body, find all the elements, create the eye buttons and cloned inputs
clean() -> undo setup
super_secrets -> what's been stored in memory (value, id of oringal element, id of clone element)


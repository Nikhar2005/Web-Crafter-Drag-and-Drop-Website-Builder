//These lines declare variables to reference HTML elements and to keep track of the currently selected element on the canvas.
const canvas = document.getElementById('canvas');
const properties = document.getElementById('properties');
const formDropdownBtn = document.getElementById('form-dropdown-btn');
const formDropdownContent = document.getElementById('form-dropdown-content');
const cssDropdownBtn = document.getElementById('css-dropdown-btn');
const cssDropdownContent = document.getElementById('css-dropdown-content');
let selectedElement = null;

// Create a form wrapper inside the canvas
const form = document.createElement('form');
form.id = 'form-wrapper';
form.style.position = 'relative';
canvas.appendChild(form);

// Store applied CSS for export
const appliedCSS = new Map(); //A Map object to store CSS styles that have been applied to elements

// Toggle the dropdown on click
formDropdownBtn.addEventListener('click', () => {
  formDropdownContent.style.display =
    formDropdownContent.style.display === 'block' ? 'none' : 'block';
});
cssDropdownBtn.addEventListener('click', () => {
  cssDropdownContent.style.display =
    cssDropdownContent.style.display === 'block' ? 'none' : 'block';
});

// Enable drag-and-drop for tools
document.querySelectorAll('.tool').forEach(tool => {
  tool.addEventListener('dragstart', e => {
    e.dataTransfer.setData('type', tool.getAttribute('data-type'));
  });
});

// Add event listeners for form dropdown elements
document.querySelectorAll('.form-element').forEach(button => {//queryselector , that select all element with form-element class name
  button.addEventListener('click', () => {// for-each, that use like jetla pan element select tya hoy e badha mate,
    //  this is for if user click on any button of selectd element's
    const type = button.getAttribute('data-type');// fect type of selected button like, input,checkox,radio,.... 
    const element = createFormElement(type);//to create selected type form element  
    if (element) {// check if elemet is created
      makeDraggable(element);//  make it dragable so that user ca drag-drop into canvas
      selectElement(element); // this is for to delete function & to add css properties
    }
  });
});

// Allow dropping on canvas
canvas.addEventListener('dragover', e => e.preventDefault()); //dragover - this will occure when user drop element into canvas
canvas.addEventListener('drop', e => {
  e.preventDefault();
  const type = e.dataTransfer.getData('type');//type of dragged element
  const element = createElement(type);// create elment   in canvas  of dragged element type
  if (element) {
    //this is for if user drag-drop an element so this will prevent alignment , 
    //like if user drop an element in center this 3 line will remain that element in center in generated code,using offsetx &y
    element.style.position = 'absolute';  
    element.style.left = `${e.offsetX}px`;//px difference btw screen let side to element(X-axes)
    element.style.top = `${e.offsetY}px`;//same as uper bu it will take px from top(Y-axixs)
    makeDraggable(element);//as uper mentioned
    selectElement(element);//as uper mentioned
  }
});

// to select element in canvas to apply css , change position and to delete
canvas.addEventListener('click', e => {
  if (e.target !== canvas && e.target !== form) {
    selectedElement = e.target;
  }
});

// Create general elements
function createElement(type) {//to create  div based element
  let element;
  switch (type) {
    case 'text':
      element = document.createElement('div');
      element.contentEditable = true;
      element.innerText = 'Editable Text';
      break;
    case 'image':
      element = document.createElement('img'); // this will done in img tag , it take url of an img online
      element.src = prompt('Enter image URL:') || '';
      element.alt = 'Image';
      break;
    case 'button':
      element = document.createElement('button');//button with default text
      element.innerText = 'Click Me';
      break;
    case 'section':
      element = document.createElement('div');
      element.style.width = '200px';
      element.style.height = '100px';
      element.style.border = '1px solid #000';
      break;
    default:
      alert('Unsupported element type');
      return null;
  }
  element.className = 'draggable'; // to make them draggable
  canvas.appendChild(element); // Append outside the form
  return element;// return 
}

// Create form elements
function createFormElement(type) { // this is for form element 
  let element;
  const labelText = prompt('Enter label text:', 'Label');//take lable for from element eg: username , password , male ,female etc...
  if (!labelText) return;

  switch (type) {
    case 'input': // input with type 
      const inputType = prompt('Enter input type (e.g., text, email, number):', 'text');
      if (!inputType) return;
      element = createLabeledInput(labelText, 'input', inputType);
      break;
    case 'checkbox': 
      element = createLabeledInput(labelText, 'input', 'checkbox');
      break;
    case 'radio':
      const groupName = prompt('Enter radio button group name:', 'group');
      if (!groupName) return;
      element = createLabeledInput(labelText, 'input', 'radio', groupName);
      break;
    case 'textarea':
      element = createLabeledInput(labelText, 'textarea');
      break;
    case 'submit':
    case 'reset':
      element = document.createElement('button');
      element.type = type;
      element.innerText = labelText;
      break;
    default:
      alert('Invalid form element type');
      return null;
  }
  form.appendChild(element); // Append to the form , this will append this code in form tag
  return element;
}

// Handle CSS dropdown options
document.querySelectorAll('.css-option').forEach(option => { // fetch from html page 
  option.addEventListener('click', () => {//click event wen user click on this this block of code will occur
    if (!selectedElement) { // this is for check if no element is selected  then raise an alert
      alert('Please select an element on the canvas first.');
      return;
    }
    const property = option.getAttribute('data-css');// check for atribute of clicked event like bg-color, hover ,color from html
    let value;

    switch (property) {
      case 'hover': // to add hover effect on seleced element
        // Add hover effect
        const hoverEffect = `
          transition: all 0.3s ease;
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        `;
        const hoverClass = 'hover-effect';
        addHoverEffect(selectedElement, hoverEffect, hoverClass);//calling function to add hover effect
        break;

      case 'bg-color': // for back-ground of selected element
        value = prompt('Enter a background color (e.g., red, #f00):');
        if (value) selectedElement.style.backgroundColor = value;
        break;

      case 'color': // for text-color of selected element
        value = prompt('Enter a text color (e.g., blue, #00f):');
        if (value) selectedElement.style.color = value;
        break;

      default:
        alert('Unknown CSS property.');
    }

    // Save applied styles
    // after applineing style add style in map
    const currentStyles = appliedCSS.get(selectedElement) || '';
    appliedCSS.set(selectedElement, `${currentStyles}${property}: ${value};\n`);
  });
});

// Add hover effect
/*
element - The DOM element to which the hover effect should be applied.
hoverEffect - containing the CSS styles that define the hover effect.
hoverClass -  A class name that will be added to the element to activate the hover effect.
*/
function addHoverEffect(element, hoverEffect, hoverClass) {
  // Ensure the hover class is added

  // this is to check if dynamic-hover-style is created in <style> if not , then it will create
  const styleTag = document.getElementById('dynamic-hover-style') || document.createElement('style');
  if (!styleTag.id) {
    styleTag.id = 'dynamic-hover-style';
    document.head.appendChild(styleTag);//
  }

  const styleSheet = styleTag.sheet; // to access stylesheet of <style>
  const rule = `.${hoverClass}:hover { ${hoverEffect} }`; // this will create css rule with the given class name

  // Add the rule to the stylesheet
  styleSheet.insertRule(rule, styleSheet.cssRules.length);

  // Add hover effect data for export
  element.classList.add(hoverClass);//add class to selected element
  element.dataset.hoverEffect = hoverEffect; // Store the hover effect for export
}
// Toggle heading dropdown
document.getElementById('headingDropdownBtn').addEventListener('click', () => {
  const headingDropdownContent = document.getElementById('headingDropdownContent');
  headingDropdownContent.style.display = 
    headingDropdownContent.style.display === 'block' ? 'none' : 'block';
});

// Add event listeners for heading options
document.querySelectorAll('.heading-option').forEach(button => {
  button.addEventListener('click', () => {
    const type = button.getAttribute('data-type');
    const element = createHeadingElement(type);
    if (element) {
      makeDraggable(element);
      selectElement(element);
    }
  });
});

// Create heading elements
function createHeadingElement(type) {
  const element = document.createElement(type);//create heading with type ,like h1,h2 ..h6
  element.contentEditable = true; // make sure so that user can chage default text
  element.innerText = `Heading ${type}`;
  element.className = 'draggable';// to makae it dragable
  canvas.appendChild(element);
  return element;
}
// Export code function
function exportCode() {
  // Remove the placeholder paragraph from the canvas
  const placeholder = document.querySelector('#canvas p');
  if (placeholder) placeholder.remove(); // to remove default line - drag element here

  // Collect hover styles
  const hoverStyles = []; // use to store css rules for hover effect
  const generatedCSS = [];// use to store css rules for other propertis

  appliedCSS.forEach((styles, element) => { // loop for each entry in applied css
    const className = `export-${element.tagName.toLowerCase()}-${Math.random().toString(36).substr(2, 5)}`; 
    // ^ uper line is to generate class name with element's tag name with some random string for easy to aceess
    element.classList.add(className);// add  classname from uper in element

    // Normal styles
    generatedCSS.push(`.${className} { ${styles} }`); // add css rule for normal style {bg-color , color}

    // Hover styles
    const hoverEffect = element.dataset.hoverEffect; // add css rules for hover style 
    if (hoverEffect) {
      hoverStyles.push(`.${className}:hover { ${hoverEffect} }`);
    }
  });

  // Generate complete CSS
  const fullCSS = [...generatedCSS, ...hoverStyles].join('\n'); // this line combines both general & hover css and give fll css

  // Generate HTML
  /*
  here div with id canvas will work as main div like container
  form.outerHTML - include all form tage html {input , cb, raido...}
  just below line of that is for non- form {text , hadings, buttons...}
  */
  const generatedHTML = `
    <div id="canvas"> 
      ${form.outerHTML}
      ${[...canvas.children].map(child => (child !== form ? child.outerHTML : '')).join('\n')}
    </div>
  `;

  // Create the full HTML export
  /*
  as we show this will give fill code with boliercode , css and body {final html code with css}
  */
  const output = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Exported Design</title>
      <style>${fullCSS}</style>
    </head>
    <body>
      ${generatedHTML}
    </body>
    </html>
  `;

  // Allow download as an HTML file
  /*
  blob - Binary Large Object > is a built-in JavaScript object that represents immutable data of variable size
  text/html - this is show that text data is a HTML Document
  URL.createObjectURL -> give url link to blob
  document.createElement('a') -> to make anchor tag
  link.href = URL.createObjectURL(blob) - Sets the href attribute of the anchor element to the URL of the Blob
  link.download = 'design.html' - Sets the download attribute to specify the filename for the download
  link.click() = Programmatically clicks the anchor element, triggering the download of the HTML file named design.html
  */
  const blob = new Blob([output], { type: 'text/html' });//create new BOLB object & store output as text/html to export
  const link = document.createElement('a'); // create a new anchor tag {<a>}
  link.href = URL.createObjectURL(blob);//Creates a URL that points to the Blob
  link.download = 'design.html'; //  set dowloadto specific name
  link.click();
}

document.getElementById('deleteButton').addEventListener('click', () => { // secect button with deletbutton id and when user click on that button this will occure
  if (selectedElement) { // check  for if any element is selected or not
    if (selectedElement.parentNode) { // check if selected element has paratn node.we can only deleted that element which has parnt node.
      selectedElement.parentNode.removeChild(selectedElement); // remove the selected element  from its paratn node
      selectedElement = null; // Clear the selectedElement reference
      alert('Element deleted');
    }
  } else {
    alert('Please select an element to delete.');
  }
});

// crating export button using js 
const exportButton = document.createElement('button');
exportButton.innerText = 'Export Code';
exportButton.style.marginTop = '300px';
exportButton.style.padding = '10px';
exportButton.style.height = '50px';
exportButton.style.backgroundColor = '#28a745';
exportButton.style.color = '#fff';
exportButton.style.border = 'none';
exportButton.style.borderRadius = '5px';
exportButton.style.cursor = 'pointer';
exportButton.addEventListener('click', exportCode);
document.body.appendChild(exportButton);

// Helper function to create labeled inputs
/*
this is only for form element's
lableText - lable for for elements
tagName - like input,textarea ,button from...
inputType - for form elemnt type of input tag like text, email, password...
groupName - groupname for radio buton 
*/
function createLabeledInput(labelText, tagName, inputType = '', groupName = '') {
  const wrapper = document.createElement('div'); // create a div 
  wrapper.className = 'form-field';// change class name of div to form-filed .. this contain input or any ags

  const label = document.createElement('label');// create label
  label.innerText = labelText; // set the text content of the label to the provided labelText

  const input = document.createElement(tagName);  // create element
  if (inputType) input.type = inputType;//  assign type line raido , checkbox, input etc..
  if (inputType === 'radio' && groupName) input.name = groupName;
  //^ above line for to check first if type is radio and groupname is assign properly so this will set name of that tag to groupname , so radio button will work properly {1 option at a time}

  wrapper.appendChild(label);//Appends the label element to the wrapper div
  wrapper.appendChild(input);//Appends the input element to the wrapper div
  return wrapper;
}

// Make element draggable
function makeDraggable(element) { // pass that element  that you want to make draggable
  element.style.position = 'absolute'; // it is compalsary , so that user can easily move element in entire canvas
  element.addEventListener('mousedown', e => { // it will occur when  mouse button press doen on an element 
    const offsetX = e.offsetX;
    const offsetY = e.offsetY;
    //^ above both line give value of pointer

    function onMouseMove(event) { // update position as user move mouse 
      /*
      event.pageX & event.pageY  give coordinates of the mouse , conatain entire document
      canvas.offsetLeft & canvas.offsetTop  give position of canwas
      */
      element.style.left = `${event.pageX - canvas.offsetLeft - offsetX}px`;
      element.style.top = `${event.pageY - canvas.offsetTop - offsetY}px`;
      //^ above 2 lines set the value according to equation 
    }
    // this 3 line is  helps to drag elemt into entire document using mouse..
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', onMouseMove);
    }, { once: true });
  });
}

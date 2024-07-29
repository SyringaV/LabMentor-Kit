const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');
const imageContainer = document.querySelector('.image-container'); // Select the image container
const uploadedImage = document.querySelector('.uploaded-image'); // Select the uploaded image
const imageUpload = document.getElementById('image-upload'); // Select the image upload input

registerLink.addEventListener('click', () => { wrapper.classList.add('active'); });

loginLink.addEventListener('click', () => { wrapper.classList.remove('active'); });

btnPopup.addEventListener('click', () => { wrapper.classList.add('active-popup'); });

iconClose.addEventListener('click', () => { wrapper.classList.remove('active-popup'); });

// Function to handle file upload
function handleFileUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  // Check if a file is selected
  if (file) {
    reader.onload = function () {
      const img = new Image();
      img.src = reader.result;
      img.onload = function () {
        uploadedImage.innerHTML = ''; // Clear previous content
        uploadedImage.appendChild(img); // Append the uploaded image
      };
    };
    reader.readAsDataURL(file);

    // Hide the file input field after uploading the image
    imageUpload.style.visibility = 'hidden';
    imageUpload.style.pointerEvents = 'none';
  }
}

let isDragging = false;
let startX, startY, translateX = 0, translateY = 0, scale = 1;

imageContainer.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
});

imageContainer.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    translateX += deltaX;
    translateY += deltaY;
    updateTransform();
    startX = e.clientX;
    startY = e.clientY;
  }
});

imageContainer.addEventListener('mouseup', () => {
  isDragging = false;
});

imageContainer.addEventListener('mouseleave', () => {
  isDragging = false;
});

imageContainer.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (e.deltaY < 0) {
    zoomIn();
  } else {
    zoomOut();
  }
});

function zoomIn() {
  scale += 0.1;
  updateTransform();
}

function zoomOut() {
  scale -= 0.1;
  updateTransform();
}

function updateTransform() {
  uploadedImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}


const cellCountsContainer = document.getElementById('cell-counts');

function updateSquaresCount(value) {
  const squaresCounted = parseInt(value);
  squaresCountedContainer.innerHTML = ''; // Clear previous content
  cellCountsContainer.innerHTML = ''; // Clear previous cell counts

  for (let i = 1; i <= squaresCounted; i++) {
    const squareRow = document.createElement('tr');
    squareRow.innerHTML = `
      <td>Square ${i}#</td>
      <td><input type="number" id="viable-cells-${i}" value="0"></td>
      <td><input type="number" id="non-viable-cells-${i}" value="0"></td>
    `;
    cellCountsContainer.appendChild(squareRow);
  }

  if (squaresCounted === 5) {
    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
      <td>Total</td>
      <td><input type="number" id="total-viable-cells" value="0" disabled></td>
      <td><input type="number" id="total-non-viable-cells" value="0" disabled></td>
    `;
    cellCountsContainer.appendChild(totalRow);
  }
}


// script.js

function toggleSection(sectionId) {
  var section = document.getElementById(sectionId);
  section.classList.toggle("active");
}

function calculateDilution() {
  const C1 = parseFloat(document.getElementById('initial-concentration').value);
  const C1Unit = document.getElementById('initial-unit').value;
  const C2 = parseFloat(document.getElementById('final-concentration').value);
  const C2Unit = document.getElementById('final-unit').value;
  const V2 = parseFloat(document.getElementById('final-volume').value);
  const VolumeUnit = document.getElementById('volume-unit').value;

  const unitConversions = {
    'M': 1,
    'mM': 0.001,
    'μM': 0.000001,
    'g/L': 1,
    'L': 1,
    'mL': 0.001,
    'μL': 0.000001
  };

  if (!isNaN(C1) && !isNaN(C2) && !isNaN(V2) && C1 > 0 && C2 > 0 && V2 > 0) {
    const C1Converted = C1 * unitConversions[C1Unit];
    const C2Converted = C2 * unitConversions[C2Unit];
    const V2Converted = V2 * unitConversions[VolumeUnit];

    const V1 = (C2Converted * V2Converted) / C1Converted;
    calculatedV1 = V1;
    currentVolumeUnit = VolumeUnit;
    
    const V1Converted = V1 / unitConversions[VolumeUnit];
    
    document.getElementById('dilution-result').textContent = `You need to dilute ${V1Converted.toFixed(2)} ${VolumeUnit} of the initial solution to reach the desired concentration.`;
    document.getElementById('result-conversion').style.display = 'block';
    convertResult();
  } else {
    document.getElementById('dilution-result').textContent = 'Please enter valid, positive numbers for all fields.';
    document.getElementById('result-conversion').style.display = 'none';
  }
}

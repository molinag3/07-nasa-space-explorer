// Paste your personal NASA API key inside the quotes below:
const NASA_API_KEY = 'RdhQmQkGHLKMzhTFhcBTBjRzMHWpHBH7mzmdrrTN';

// Find date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Initialize date restriction logic from dateRange.js
setupDateInputs(startInput, endInput);

// Select DOM elements
const fetchBtn = document.getElementById('fetchBtn');
const galleryContainer = document.getElementById('gallery');
const loadingMessage = document.getElementById('loadingMessage');
const spaceFactContainer = document.getElementById('spaceFact');

// Modal Elements
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');
const closeModalBtn = document.getElementById('closeModal');

// LevelUp: Random Space Fact (10 pts)
const spaceFacts = [
  "One day on Venus is longer than one year on Earth.",
  "Neutron stars can spin 600 times per second.",
  "There is a giant cloud of alcohol in the Sagittarius B2 cloud.",
  "Footprints left on the Moon will stay there for millions of years.",
  "One million Earths could fit inside the Sun.",
  "Jupiter has 95 officially recognized moons."
];

// Display a random space fact on page load
document.addEventListener('DOMContentLoaded', () => {
  if (spaceFactContainer) {
    const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
    spaceFactContainer.textContent = `💡 Did You Know? ${randomFact}`;
  }
});

// Fetch photos from NASA API
async function fetchSpacePhotos() {
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (!startDate || !endDate) {
    alert('Please select both a start date and an end date.');
    return;
  }

  // Show loading message
  if (loadingMessage) loadingMessage.style.display = 'block';
  galleryContainer.innerHTML = '';

  // Use NASA_API_KEY (or fallback to DEMO_KEY if not yet replaced)
  const keyToUse = (NASA_API_KEY && NASA_API_KEY !== 'YOUR_NASA_API_KEY_HERE') ? NASA_API_KEY : 'DEMO_KEY';
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${keyToUse}&start_date=${startDate}&end_date=${endDate}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`NASA API status ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    // Hide loading message once data arrives
    if (loadingMessage) loadingMessage.style.display = 'none';

    if (Array.isArray(data)) {
      renderGallery(data);
    } else {
      galleryContainer.innerHTML = `<p class="error">Error: ${data.msg || 'Unable to fetch data from NASA.'}</p>`;
    }
  } catch (error) {
    console.error('Error fetching NASA data:', error);
    if (loadingMessage) loadingMessage.style.display = 'none';
    galleryContainer.innerHTML = `
      <p class="error">
        ⚠️ Unable to load space images right now.<br>
        Please check your API key string in script.js or try selecting a 2-3 day date range.
      </p>`;
  }
}

// Render Gallery Cards
function renderGallery(items) {
  galleryContainer.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('gallery-card');

    // LevelUp: Handle YouTube Video entries vs Images (10 pts)
    let mediaHTML = '';
    if (item.media_type === 'image') {
      mediaHTML = `<img src="${item.url}" alt="${item.title}" class="gallery-img">`;
    } else if (item.media_type === 'video') {
      mediaHTML = `
        <div class="video-card">
          <p>🎥 Video Entry</p>
          <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="video-link" onclick="event.stopPropagation();">Watch Video 🚀</a>
        </div>`;
    }

    card.innerHTML = `
      ${mediaHTML}
      <h3>${item.title}</h3>
      <p class="card-date">${item.date}</p>
    `;

    // Click handler to open Modal View
    card.addEventListener('click', () => openModal(item));
    galleryContainer.appendChild(card);
  });
}

// Open Modal Window
function openModal(item) {
  modalTitle.textContent = item.title;
  modalDate.textContent = item.date;
  modalExplanation.textContent = item.explanation;

  if (item.media_type === 'image') {
    modalImg.src = item.hdurl || item.url;
    modalImg.alt = item.title;
    modalImg.style.display = 'block';
  } else {
    modalImg.style.display = 'none';
  }

  modal.style.display = 'flex';
}

// Close Modal when 'X' is clicked
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

// Close Modal when clicking outside the modal content
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

// Event Listener for button click
fetchBtn.addEventListener('click', fetchSpacePhotos);

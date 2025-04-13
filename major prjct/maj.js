// Get references to DOM elements
const textInput = document.getElementById('textInput');
const speakButton = document.getElementById('speakButton');
const voiceSelect = document.getElementById('voiceSelect');
const volumeControl = document.getElementById('volumeControl');
const rateControl = document.getElementById('rateControl');
const pdfUpload = document.getElementById('pdfUpload');
const extractTextButton = document.getElementById('extractTextButton');
const extractedText = document.getElementById('extractedText');

// Initialize voices array
let voices = [];

// Load available voices
function loadVoices() {
  voices = window.speechSynthesis.getVoices();
  voiceSelect.innerHTML = '';
  voices.forEach((voice, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
}

// Populate voices dropdown when voices are loaded
window.speechSynthesis.onvoiceschanged = loadVoices;

// Convert text to speech
speakButton.addEventListener('click', () => {
  const text = textInput.value;

  if (text.trim() === '') {
    alert('Please enter some text!');
    return;
  }

  const speech = new SpeechSynthesisUtterance(text);

  // Set voice, volume, and rate
  const selectedVoice = voices[voiceSelect.value];
  if (selectedVoice) speech.voice = selectedVoice;
  speech.volume = parseFloat(volumeControl.value);
  speech.rate = parseFloat(rateControl.value);

  // Speak the text
  window.speechSynthesis.speak(speech);
});

// Extract text from uploaded PDF
extractTextButton.addEventListener('click', async () => {
  const file = pdfUpload.files[0];
  if (!file) {
    alert('Please upload a PDF file!');
    return;
  }

  try {
    // Load the PDF.js library
    const pdfjsLib = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.6.172/build/pdf.min.js');
    const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;

    let text = '';

    // Loop through all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      // Extract text items and combine them
      const pageText = content.items.map(item => item.str).join(' ');
      text += pageText + '\n';
    }

    // Display the extracted text
    extractedText.textContent = text.trim();
    textInput.value = text.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    alert('Failed to extract text from the PDF. Please try another file.');
  }
});

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


// Extract text from PDF
async function extractTextFromPDF(pdfFile) {
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    const pdf = await pdfjsLib.getDocument(URL.createObjectURL(pdfFile)).promise;
    
    let extractedText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items.map(item => item.str).join(' ');
        extractedText += pageText + '\n';
    }
    
    return extractedText;
}

// Handle file upload and extract text
document.getElementById('pdfUpload').addEventListener('change', async function (event) {
    const file = event.target.files[0];
    
    if (file) {
        const extractedText = await extractTextFromPDF(file);
        document.querySelector('textarea').value = extractedText; // Display extracted text in the textarea

        // Automatically speak the extracted text if required
        speech.text = extractedText;
        window.speechSynthesis.speak(speeh);
    }
});

const textInput = document.getElementById('textInput');
const speakButton = document.getElementById('speakButton');
const voiceSelect = document.getElementById('voiceSelect');
const volumeControl = document.getElementById('volumeControl');
const rateControl = document.getElementById('rateControl');
const pdfUpload = document.getElementById('pdfUpload');
const extractTextButton = document.getElementById('extractTextButton');
const extractedText = document.getElementById('extractedText');

let voices = [];

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

window.speechSynthesis.onvoiceschanged = loadVoices;

speakButton.addEventListener('click', () => {
  const text = textInput.value;

  if (text.trim() === '') {
    alert('Please enter some text!');
    return;
  }

  const speech = new SpeechSynthesisUtterance(text);

  const selectedVoice = voices[voiceSelect.value];
  if (selectedVoice) speech.voice = selectedVoice;
  speech.volume = parseFloat(volumeControl.value);
  speech.rate = parseFloat(rateControl.value);

  window.speechSynthesis.speak(speech);
});

extractTextButton.addEventListener('click', async () => {
  const file = pdfUpload.files[0];
  if (!file) {
    alert('Please upload a PDF file!');
    return;
  }

  try {
    const pdfjsLib = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.6.172/build/pdf.min.js');
    const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;

    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const pageText = content.items.map(item => item.str).join(' ');
      text += pageText + '\n';
    }

    extractedText.textContent = text.trim();
    textInput.value = text.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    alert('Failed to extract text from the PDF. Please try another file.');
  }
});

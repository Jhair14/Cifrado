document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      const content = e.target.result;
      document.getElementById('fileContent').textContent = content;
      document.getElementById('inputText').value = content;
    };
    reader.readAsText(file);
  });
  
  function toggleKeyInput() {
    const operation = document.getElementById('operationSelect').value;
    const keyInput = document.getElementById('keyInput');
    keyInput.style.display = operation === 'decipher' ? 'block' : 'none';
  }
  
  function processText() {
    const text = document.getElementById('inputText').value;
    const cipherBits = parseInt(document.getElementById('cipherSelect').value);
    const operation = document.getElementById('operationSelect').value;
    let processedText = '';
    
    if (operation === 'cipher') {
      for (let i = 0; i < text.length; i++) {
        const char = text.charAt(i);
        const ascii = char.charCodeAt(0);
        const ciphered = (ascii + cipherBits) % 256;
        processedText += String.fromCharCode(ciphered);
      }
    } else {
      const key = document.getElementById('keyInput').value;
      if (!key) {
        alert('Por favor, ingrese una llave de descifrado');
        return;
      }
      for (let i = 0; i < text.length; i++) {
        const char = text.charAt(i);
        const ascii = char.charCodeAt(0);
        const deciphered = (ascii - cipherBits + 256) % 256;
        processedText += String.fromCharCode(deciphered);
      }
    }
    
    document.getElementById('outputText').value = processedText;
    generateASCIITable(cipherBits, operation);
  }
  
  function generateASCIITable(cipherBits, operation) {
    const table = document.getElementById('asciiTable');
    table.innerHTML = '';
    const headerRow = table.insertRow();
    const headers = operation === 'cipher' 
      ? ['Original', 'ASCII Original', 'Cifrado', 'ASCII Cifrado']
      : ['Cifrado', 'ASCII Cifrado', 'Descifrado', 'ASCII Descifrado'];
    
    headers.forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      headerRow.appendChild(th);
    });
    
    for (let i = 32; i < 127; i++) {
      const row = table.insertRow();
      if (operation === 'cipher') {
        const originalChar = String.fromCharCode(i);
        const cipheredChar = String.fromCharCode((i + cipherBits) % 256);
        [originalChar, i, cipheredChar, (i + cipherBits) % 256].forEach(value => {
          const cell = row.insertCell();
          cell.textContent = value;
        });
      } else {
        const cipheredChar = String.fromCharCode(i);
        const decipheredChar = String.fromCharCode((i - cipherBits + 256) % 256);
        [cipheredChar, i, decipheredChar, (i - cipherBits + 256) % 256].forEach(value => {
          const cell = row.insertCell();
          cell.textContent = value;
        });
      }
    }
  }
  
  function saveProcessedText() {
    const processedText = document.getElementById('outputText').value;
    const cipherBits = document.getElementById('cipherSelect').value;
    const operation = document.getElementById('operationSelect').value;
    const fileName = `jja${cipherBits}_${operation}.txt`;
    
    const blob = new Blob([processedText], {type: 'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  }
  
  function saveAsciiTable() {
    const cipherBits = document.getElementById('cipherSelect').value;
    const operation = document.getElementById('operationSelect').value;
    let content = operation === 'cipher'
      ? 'ASCII Original,Caracter Original,ASCII Cifrado,Caracter Cifrado\n'
      : 'ASCII Cifrado,Caracter Cifrado,ASCII Descifrado,Caracter Descifrado\n';
    
    for (let i = 32; i < 127; i++) {
      if (operation === 'cipher') {
        const originalChar = String.fromCharCode(i);
        const cipheredAscii = (i + parseInt(cipherBits)) % 256;
        const cipheredChar = String.fromCharCode(cipheredAscii);
        content += `${i},${originalChar},${cipheredAscii},${cipheredChar}\n`;
      } else {
        const cipheredChar = String.fromCharCode(i);
        const decipheredAscii = (i - parseInt(cipherBits) + 256) % 256;
        const decipheredChar = String.fromCharCode(decipheredAscii);
        content += `${i},${cipheredChar},${decipheredAscii},${decipheredChar}\n`;
      }
    }
    
    const fileName = `jja${cipherBits}_${operation}_ascii.txt`;
    const blob = new Blob([content], {type: 'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  }
  
  // Generate initial ASCII table
  generateASCIITable(2, 'cipher');
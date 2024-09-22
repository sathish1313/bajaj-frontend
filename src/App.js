import React, { useState } from "react";
import axios from "axios";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDropdownChange = (e) => {
    const options = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedOptions(options);
  };

  const handleSubmit = async () => {
    try {
      // Validate JSON input
      const jsonData = JSON.parse(jsonInput);

      // Convert file to Base64
      const fileBase64 = file ? await toBase64(file) : null;

      // Prepare request body
      const requestBody = {
        data: jsonData.data,
        file_b64: fileBase64 || ""
      };

      const result = await axios.post("https://your-backend-url.com/bfhl", requestBody);
      setResponse(result.data);
      setError(null);
    } catch (err) {
      setError("Invalid JSON or API request failed");
      setResponse(null);
    }
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // Split out Base64 portion
      reader.onerror = (error) => reject(error);
    });
  };

  const renderResponse = () => {
    if (!response) return null;

    let displayData = {};
    if (selectedOptions.includes("Numbers")) {
      displayData.numbers = response.numbers;
    }
    if (selectedOptions.includes("Alphabets")) {
      displayData.alphabets = response.alphabets;
    }
    if (selectedOptions.includes("Highest Lowercase Alphabet")) {
      displayData.highestLowercaseAlphabet = response.highest_lowercase_alphabet;
    }

    return (
      <div>
        <h3>Response:</h3>
        <pre>{JSON.stringify(displayData, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>JSON Input Form</h1>
      
      <textarea
        value={jsonInput}
        onChange={handleJsonChange}
        placeholder='Enter JSON like {"data": ["M", "1", "2"]}'
        rows="8"
        cols="50"
      />
      <br />
      
      <input type="file" onChange={handleFileChange} />
      <br />

      <label htmlFor="responseSelect">Select Response Options:</label>
      <select multiple={true} id="responseSelect" onChange={handleDropdownChange}>
        <option value="Numbers">Numbers</option>
        <option value="Alphabets">Alphabets</option>
        <option value="Highest Lowercase Alphabet">Highest Lowercase Alphabet</option>
      </select>
      <br />

      <button onClick={handleSubmit}>Submit</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {renderResponse()}
    </div>
  );
}

export default App;

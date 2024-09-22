import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import './App.css'; // For custom styles

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const filterOptions = [
    { value: "numbers", label: "Numbers" },
    { value: "alphabets", label: "Alphabets" },
    { value: "highest_lowercase_alphabet", label: "Highest Lowercase Alphabet" },
  ];

  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleDropdownChange = (selected) => {
    setSelectedOptions(selected);
  };

  const handleSubmit = async () => {
    try {
      // Validate JSON input
      const jsonData = JSON.parse(jsonInput);

      // Prepare request body
      const requestBody = {
        data: jsonData.data,
      };

      const result = await axios.post("https://bajaj-backend-e6k46xext-sathishs-projects-37aa0aa2.vercel.app/bfhl", requestBody);
      setResponse(result.data);
      console.log(result);
      setError(null);
    } catch (err) {
      setError("Invalid JSON or API request failed");
      setResponse(null);
    }
  };

  const renderResponse = () => {
    if (!response) return null;

    let displayData = {};
    selectedOptions.forEach((option) => {
      if (option.value === "numbers") {
        displayData.numbers = response.numbers;
      }
      if (option.value === "alphabets") {
        displayData.alphabets = response.alphabets;
      }
      if (option.value === "highest_lowercase_alphabet") {
        displayData.highest_lowercase_alphabet = response.highest_lowercase_alphabet;
      }
    });

    return (
      <div className="response-box">
        <h3>Response:</h3>
        <pre>{JSON.stringify(displayData, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <h1>JSON Input Form</h1>
        
        <textarea
          value={jsonInput}
          onChange={handleJsonChange}
          placeholder='Enter JSON like {"data": ["M", "1", "2"]}'
          rows="8"
          cols="50"
        />
        <br />

        <label htmlFor="responseSelect">Select Response Options:</label>
        <Select
          isMulti
          options={filterOptions}
          value={selectedOptions}
          onChange={handleDropdownChange}
          className="multi-select"
          placeholder="Select options"
        />
        <br />

        <button onClick={handleSubmit} className="submit-btn">Submit</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {renderResponse()}
      </div>
    </div>
  );
}

export default App;

import React from "react";
import FileUpload from "./components/FileUpload";
import "./App.css";

const App = () => {
  return (
    <div className="container mt-4">
      <h4 className="display-4 text-center mb-4">
        <i className="fas fa-file-csv" /> File Upload
      </h4>
      <p>Please upload both PDF and CSV files here</p>

      <FileUpload />
    </div>
  );
};

export default App;

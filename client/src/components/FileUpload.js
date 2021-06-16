import React, { Fragment, useState } from "react";
import Message from "./Message";
import Progress from "./Progress";
import axios from "axios";

import "./FileUpload.css";

const FileUpload = () => {
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose File");
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    
    console.log(text, subject, file);

    try {
      const res = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );
        },
      });

      // Clear percentage
      setTimeout(() => setUploadPercentage(0), 5000);

      const { fileName, filePath } = res.data;

      console.log(fileName, filePath);

      setUploadedFile({ fileName, filePath });

      setMessage("File Uploaded");
      setFile("");
      setFilename("Choose File");
      setText("");
      setSubject("");
    } catch (err) {
      if (err.response.status === 500) {
        setMessage("There was a problem with the server");
      } else {
        setMessage(err.response.data.msg);
      }
      setUploadPercentage(0);
    }
  };

  return (
    <Fragment>
      <div className="body">
        {message ? <Message msg={message} /> : null}
        <form onSubmit={onSubmit}>
          <div className="custom-file mb-4">
            <input
              type="file"
              className="custom-file-input "
              id="customFile"
              onChange={onChange}
            />
            <label
              className="custom-file-label form-control"
              htmlFor="customFile"
            >
              {filename}
            </label>
          </div>
          <div className="custom-file mb-4">
            <input
              value={subject}
              required
              type="text"
              className="form-control"
              placeholder="Enter Subject"
              style={{ width: "100%" }}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="custom-file mb-4">
            <textarea
              value={text}
              className="form-control height"
              required
              type="text"
              placeholder="Enter Email Body"
              style={{ width: "100%" }}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <Progress percentage={uploadPercentage} />

          <button type="submit" className=" btn  btn-block mt-4">
            Upload
          </button>
        </form>
        {uploadedFile ? (
          <div className="row mt-5">
            <div className="col-md-6 m-auto">
              <h3 className="text-center">{uploadedFile.fileName}</h3>
              <img
                style={{ width: "100%" }}
                src={uploadedFile.filePath}
                alt=""
              />
            </div>
          </div>
        ) : null}
      </div>
    </Fragment>
  );
};

export default FileUpload;

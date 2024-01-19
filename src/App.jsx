import React, {useState} from "react";
import axios from "axios";
import "./App.css";
import Footer from "./Footer";

export default function App() {
  const [imageFile, setImageFile] = useState(null);
  const [upscaledImage, setUpscaledImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const upscaleImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('sizeFactor', '2');
    formData.append('imageStyle', 'default');
    formData.append('noiseCancellationFactor', '0');

    const options = {
      method: 'POST',
      url: 'https://ai-picture-upscaler.p.rapidapi.com/supersize-image',
      headers: {
        'X-RapidAPI-Key': 'dc4b530d9bmsh90e50d3c38c7c70p156467jsn088bf1521ed9',
        'X-RapidAPI-Host': 'ai-picture-upscaler.p.rapidapi.com',
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
      responseType: 'arraybuffer',
    };
    try {
      setLoading(true);
      const response = await axios.request(options);
      const base64Image = btoa(
        new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      setUpscaledImage(base64Image);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = () => {
    const url = window.URL.createObjectURL(new Blob([upscaledImage]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'upscaled_image.jpg');
    document.body.appendChild(link);
    link.click();
  };
  return (
    <div className="container">
      <h1>AI Image Upscaler</h1>
      <form onSubmit={upscaleImage}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button className="btn" type="submit">
          Upscale Image
        </button>
      </form>
      {loading && (
        <div className="loading">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
      {upscaledImage && (
        <div className="imageContainer">
          <img src={`data:image/jpeg;base64,${upscaledImage}`}
            alt="Upscaled" required
          />
          <button className="btn" onClick={handleDownload}>Download</button>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import './Downloader.css';

function Downloader() {
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadType, setDownloadType] = useState('video');

  const fetchVideoInfo = async () => {
    if (!url) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setError('');
    setVideoInfo(null);

    try {
      const response = await fetch('https://circuital-chantel-needful.ngrok-free.dev/api/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch video info');
      }

      const data = await response.json();
      setVideoInfo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const downloadUrl = `https://circuital-chantel-needful.ngrok-free.dev/api/download?url=${encodeURIComponent(url)}&type=${downloadType}&quality=highest`;
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="downloader-container">
      <h1>🎬 YouTube Downloader</h1>
      
      <div className="input-section">
        <input
          type="text"
          placeholder="Paste YouTube URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="url-input"
        />
        <button onClick={fetchVideoInfo} disabled={loading} className="fetch-btn">
          {loading ? 'Loading...' : 'Get Info'}
        </button>
      </div>

      {error && <div className="error">❌ {error}</div>}

      {videoInfo && (
        <div className="video-info">
          <img src={videoInfo.thumbnail} alt={videoInfo.title} className="thumbnail" />
          <h3>{videoInfo.title}</h3>
          <p>Duration: {Math.floor(videoInfo.duration / 60)}:{(videoInfo.duration % 60).toString().padStart(2, '0')}</p>

          <div className="download-options">
            <label>
              <input
                type="radio"
                value="video"
                checked={downloadType === 'video'}
                onChange={(e) => setDownloadType(e.target.value)}
              />
              🎥 Video (MP4)
            </label>
            <label>
              <input
                type="radio"
                value="audio"
                checked={downloadType === 'audio'}
                onChange={(e) => setDownloadType(e.target.value)}
              />
              🎵 Audio Only (MP3)
            </label>
          </div>

          <button onClick={handleDownload} className="download-btn">
            ⬇️ Download {downloadType === 'audio' ? 'Audio' : 'Video'}
          </button>
        </div>
      )}
    </div>
  );
}

export default Downloader;

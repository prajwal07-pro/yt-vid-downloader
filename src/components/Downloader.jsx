import React, { useState } from 'react';
import './Downloader.css';

const API_URL = 'https://circuital-chantel-needful.ngrok-free.dev'; // Update with your ngrok URL

function Downloader() {
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadType, setDownloadType] = useState('video');
  const [selectedQuality, setSelectedQuality] = useState('best');
  const [selectedFormat, setSelectedFormat] = useState('mp4');
  const [isPlaylist, setIsPlaylist] = useState(false);

  const fetchVideoInfo = async () => {
    if (!url) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setError('');
    setVideoInfo(null);

    try {
      const response = await fetch(`${API_URL}/api/info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch video info');
      }

      const data = await response.json();
      setVideoInfo(data);
      setIsPlaylist(data.type === 'playlist');
      
      // Set default format based on type
      if (data.type === 'video') {
        if (downloadType === 'video' && data.video_formats.length > 0) {
          setSelectedQuality(data.video_formats[0].quality);
          setSelectedFormat(data.video_formats[0].ext);
        } else if (downloadType === 'audio' && data.audio_formats.length > 0) {
          setSelectedQuality(data.audio_formats[0].quality);
          setSelectedFormat(data.audio_formats[0].ext);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (isPlaylist) {
      downloadPlaylist();
    } else {
      downloadSingle();
    }
  };

  const downloadSingle = () => {
    const downloadUrl = `${API_URL}/api/download?url=${encodeURIComponent(url)}&type=${downloadType}&quality=${selectedQuality}&format=${selectedFormat}`;
    window.open(downloadUrl, '_blank');
  };

  const downloadPlaylist = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/download-playlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          type: downloadType,
          quality: selectedQuality,
          format: selectedFormat
        })
      });

      if (!response.ok) {
        throw new Error('Playlist download failed');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `playlist.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableQualities = () => {
    if (!videoInfo || videoInfo.type === 'playlist') return [];
    
    if (downloadType === 'video') {
      return videoInfo.video_formats || [];
    } else {
      return videoInfo.audio_formats || [];
    }
  };

  const getAvailableFormats = () => {
    const qualities = getAvailableQualities();
    return [...new Set(qualities.map(f => f.ext))];
  };

  return (
    <div className="downloader-container">
      <h1>🎬 YouTube Downloader Pro</h1>
      <p className="subtitle">Download videos & playlists in any quality</p>
      
      <div className="input-section">
        <input
          type="text"
          placeholder="Paste YouTube video or playlist URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="url-input"
        />
        <button onClick={fetchVideoInfo} disabled={loading} className="fetch-btn">
          {loading ? '⏳ Loading...' : '🔍 Get Info'}
        </button>
      </div>

      {error && <div className="error">❌ {error}</div>}

      {videoInfo && videoInfo.type === 'playlist' && (
        <div className="playlist-info">
          <h2>📁 {videoInfo.title}</h2>
          <p>Total videos: {videoInfo.video_count}</p>
          
          <div className="videos-grid">
            {videoInfo.videos.slice(0, 6).map((video, idx) => (
              <div key={idx} className="video-card">
                <img src={video.thumbnail} alt={video.title} />
                <p>{video.title.substring(0, 50)}...</p>
              </div>
            ))}
          </div>
          {videoInfo.video_count > 6 && (
            <p className="more-videos">...and {videoInfo.video_count - 6} more videos</p>
          )}
        </div>
      )}

      {videoInfo && videoInfo.type === 'video' && (
        <div className="video-info">
          <img src={videoInfo.thumbnail} alt={videoInfo.title} className="thumbnail" />
          <h3>{videoInfo.title}</h3>
          <p>👤 {videoInfo.author} • 👁️ {videoInfo.view_count?.toLocaleString()} views</p>
          <p>⏱️ Duration: {Math.floor(videoInfo.duration / 60)}:{(videoInfo.duration % 60).toString().padStart(2, '0')}</p>
        </div>
      )}

      {videoInfo && (
        <div className="download-controls">
          <div className="download-options">
            <label className="radio-option">
              <input
                type="radio"
                value="video"
                checked={downloadType === 'video'}
                onChange={(e) => {
                  setDownloadType(e.target.value);
                  setSelectedFormat('mp4');
                }}
              />
              <span>🎥 Video</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                value="audio"
                checked={downloadType === 'audio'}
                onChange={(e) => {
                  setDownloadType(e.target.value);
                  setSelectedFormat('mp3');
                }}
              />
              <span>🎵 Audio Only</span>
            </label>
          </div>

          {videoInfo.type === 'video' && (
            <div className="format-selectors">
              <div className="selector-group">
                <label>Quality:</label>
                <select 
                  value={selectedQuality} 
                  onChange={(e) => setSelectedQuality(e.target.value)}
                  className="quality-select"
                >
                  <option value="best">Best Available</option>
                  {getAvailableQualities().map((fmt, idx) => (
                    <option key={idx} value={fmt.quality}>
                      {fmt.quality} {fmt.filesize > 0 && `(${(fmt.filesize / 1024 / 1024).toFixed(1)} MB)`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="selector-group">
                <label>Format:</label>
                <select 
                  value={selectedFormat} 
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="format-select"
                >
                  {getAvailableFormats().map((fmt, idx) => (
                    <option key={idx} value={fmt}>{fmt.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {isPlaylist && (
            <div className="playlist-options">
              <div className="selector-group">
                <label>Quality:</label>
                <select 
                  value={selectedQuality} 
                  onChange={(e) => setSelectedQuality(e.target.value)}
                  className="quality-select"
                >
                  <option value="best">Best</option>
                  {downloadType === 'video' ? (
                    <>
                      <option value="2160p">4K (2160p)</option>
                      <option value="1440p">2K (1440p)</option>
                      <option value="1080p">Full HD (1080p)</option>
                      <option value="720p">HD (720p)</option>
                      <option value="480p">SD (480p)</option>
                      <option value="360p">360p</option>
                    </>
                  ) : (
                    <>
                      <option value="320kbps">320 kbps</option>
                      <option value="256kbps">256 kbps</option>
                      <option value="192kbps">192 kbps</option>
                      <option value="128kbps">128 kbps</option>
                    </>
                  )}
                </select>
              </div>

              <div className="selector-group">
                <label>Format:</label>
                <select 
                  value={selectedFormat} 
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="format-select"
                >
                  {downloadType === 'video' ? (
                    <>
                      <option value="mp4">MP4</option>
                      <option value="webm">WEBM</option>
                      <option value="mkv">MKV</option>
                    </>
                  ) : (
                    <>
                      <option value="mp3">MP3</option>
                      <option value="m4a">M4A</option>
                      <option value="opus">OPUS</option>
                      <option value="wav">WAV</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          )}

          <button onClick={handleDownload} className="download-btn" disabled={loading}>
            {loading ? '⏳ Processing...' : `⬇️ Download ${isPlaylist ? 'Playlist' : downloadType === 'audio' ? 'Audio' : 'Video'}`}
          </button>
          
          {isPlaylist && (
            <p className="playlist-note">
              ℹ️ Playlist will be downloaded as a ZIP file. This may take several minutes.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Downloader;

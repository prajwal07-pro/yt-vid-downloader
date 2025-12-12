# 🎬 YouTube Downloader Pro

A full-stack web application for downloading YouTube videos and playlists in multiple formats and qualities.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.10+-green.svg)
![React](https://img.shields.io/badge/react-18-61dafb.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

---

## 🎯 Project Overview

**YouTube Downloader Pro** is a full-stack web application that allows users to:

- ✅ Download YouTube videos in multiple qualities (144p to 4K)
- ✅ Download audio in multiple formats (MP3, M4A, OPUS, WAV, FLAC)
- ✅ Download entire playlists as ZIP files
- ✅ Support for multiple video formats (MP4, WEBM, MKV)
- ✅ Real-time format detection and quality selection

---

### Components

1. **Frontend (React)**: User interface for URL input, format selection, and download initiation
2. **Backend (Flask)**: REST API that handles video info extraction and downloads
3. **yt-dlp**: Python library that extracts video metadata and downloads content
4. **ngrok**: Tunnel service that exposes local backend to the internet

---

## 💻 Technologies Used

### Frontend
- **React 18** - UI framework
- **JavaScript (ES6+)** - Programming language
- **CSS3** - Styling with gradients and animations
- **Fetch API** - HTTP requests to backend

### Backend
- **Python 3.10+** - Programming language
- **Flask** - Web framework
- **flask-cors** - CORS handling
- **yt-dlp** - YouTube video/audio extraction
- **FFmpeg** - Audio/video processing

### DevOps
- **ngrok** - Local server tunneling
- **npm** - Frontend package manager
- **pip** - Python package manager

---

## ⚙️ How It Works

### 1. Video Information Extraction Flow

User enters URL → React Frontend → POST /api/info
↓
Flask Backend validates URL
↓
yt-dlp extracts metadata
↓
Returns: Title, thumbnail, formats, duration
↓
React displays info + options

text

### 2. Single Video Download Flow

User clicks Download → GET /api/download?url=...&type=...&quality=...
↓
Flask downloads using yt-dlp
↓
Converts to requested format (FFmpeg)
↓
Streams file back to browser
↓
Browser triggers download

text

### 3. Playlist Download Flow

User clicks Download Playlist → POST /api/download-playlist
↓
Flask downloads all videos to temp folder
↓
Compresses all files into ZIP
↓
Returns ZIP file
↓
Browser downloads ZIP

text

---

## ✨ Features

### Core Features

| Feature | Description |
|---------|-------------|
| **Single Video Download** | Download individual YouTube videos |
| **Playlist Download** | Download entire playlists as ZIP |
| **Multiple Qualities** | 144p, 240p, 360p, 480p, 720p, 1080p, 1440p, 4K |
| **Multiple Video Formats** | MP4, WEBM, MKV |
| **Multiple Audio Formats** | MP3, M4A, OPUS, WAV, FLAC |
| **Audio Quality Options** | 64kbps - 320kbps, Lossless |
| **Smart Format Detection** | Shows only available formats for each video |
| **Playlist Preview** | Shows first 20 videos with thumbnails |
| **Error Handling** | Graceful error messages and retry logic |

### Technical Features

- ✅ **CORS Enabled**: Cross-origin requests from React frontend
- ✅ **Streaming Downloads**: Efficient file transfer
- ✅ **Temporary File Cleanup**: Automatic cleanup of downloaded files
- ✅ **Format Conversion**: FFmpeg-powered audio/video conversion
- ✅ **Responsive Design**: Works on desktop and mobile
- ✅ **Loading States**: Real-time feedback during operations

---

## 🚀 Setup & Installation

### Prerequisites

Check versions
node --version # v14.0.0 or higher
python3 --version # v3.10 or higher
pip3 --version

text

### Backend Setup

1. Create project directory
mkdir youtube-downloader
cd youtube-downloader

2. Create server folder
mkdir server
cd server

3. Create virtual environment (optional but recommended)
python3 -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate

4. Install dependencies
pip3 install flask flask-cors yt-dlp

5. Create app.py (copy from repository)
6. Run server
python3 app.p

### Frontend Setup

1. Create React app
cd .. # Go back to youtube-downloader directory
npx create-react-app client

2. Navigate to client
cd client

3. Create component structure
mkdir src/components

4. Create Downloader.jsx and Downloader.css (copy from repository)
5. Update src/App.js (copy from repository)
6. Start React app
npm start

text

### Ngrok Setup

1. Sign up at ngrok.com
2. Install ngrok
npm install -g ngrok

3. Add authtoken
ngrok config add-authtoken YOUR_TOKEN

4. Start tunnel (in new terminal)
ngrok http 5000

5. Copy HTTPS URL and update API_URL in Downloader.jsx
text

---

## 📡 API Documentation

### Base URL

Local: http://localhost:5000
Ngrok: https://circuital-chantel-needful.ngrok-free.dev

### Endpoints

#### 1. Health Check

GET /

text

**Response:**
{
"status": "running",
"message": "🚀 Backend is live!"
}

text

#### 2. Get Video/Playlist Info

POST /api/info
Content-Type: application/json

{
"url": "https://youtube.com/watch?v=..."
}

**Response (Single Video):**
{
"type": "video",
"title": "Video Title",
"thumbnail": "https://...",
"duration": 180,
"author": "Channel Name",
"view_count": 1000000,
"video_formats": [
{
"format_id": "137",
"quality": "1080p",
"ext": "mp4",
"filesize": 52428800,
"has_audio": true,
"type": "video"
}
],
"audio_formats": [
{
"format_id": "bestaudio",
"quality": "320kbps",
"ext": "mp3",
"type": "audio"
}
]
}

#### 3. Download Single Video

GET /api/download?url=...&type=video&quality=720p&format=mp4

**Parameters:**
- `url` (required): YouTube video URL
- `type` (required): `video` or `audio`
- `quality` (optional): `best`, `720p`, `1080p`, `320kbps`, etc.
- `format` (optional): `mp4`, `mp3`, `webm`, etc.

**Response:** Binary file stream

#### 4. Download Playlist

POST /api/download-playlist
Content-Type: application/json

{
"url": "https://youtube.com/playlist?list=...",
"type": "video",
"quality": "720p",
"format": "mp4"
}

**Response:** ZIP file containing all videos

---

## 🔧 Configuration

### Environment Variables (`.env`)

Frontend (.env in client folder)
REACT_APP_API_URL=https://your-ngrok-url.ngrok-free.app

### Backend Configuration

In app.py
TEMP_DIR = Path('/tmp/youtube_downloads') # Download directory
PORT = 5000 # Server port
DEBUG = True # Debug mode

---

## 🐛 Troubleshooting

### Common Issues

**1. "Loading..." stuck on playlist**
- **Cause**: Playlist extraction timeout
- **Fix**: YouTube Mixes are hard to extract; use regular playlists

**2. "Download failed" error**
- **Cause**: yt-dlp couldn't find requested format
- **Fix**: Try "Best" quality or different format

**3. CORS errors**
- **Cause**: Backend not allowing frontend requests
- **Fix**: Ensure `CORS(app)` is in app.py

**4. ngrok URL not working**
- **Cause**: Wrong URL or ngrok session expired
- **Fix**: Check ngrok terminal for correct URL

---

## 🎯 Key Learnings

### What This Project Teaches

1. **Full-Stack Development**: Frontend-backend integration
2. **REST APIs**: Designing and consuming RESTful endpoints
3. **Async Programming**: Handling async operations in JavaScript
4. **File Handling**: Streaming files, creating ZIPs
5. **Third-Party Libraries**: Integrating yt-dlp, FFmpeg
6. **Error Handling**: Graceful error management
7. **State Management**: React hooks (useState)
8. **HTTP Requests**: Fetch API, POST/GET requests
9. **CORS**: Cross-origin resource sharing
10. **Deployment**: Local development with ngrok

---

## 🚀 Future Enhancements

Possible improvements:
- [ ] Progress bar for downloads
- [ ] Queue system for multiple downloads
- [ ] Download history tracking
- [ ] User authentication
- [ ] Cloud storage integration (AWS S3, Google Drive)
- [ ] Subtitle download support
- [ ] Video trimming feature
- [ ] Batch URL input
- [ ] Dark/Light theme toggle
- [ ] Mobile app version

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Your Name**
- GitHub: [@prajwal07-pro](https://github.com/prajwal07-pro)
- Email: prajwalprawoot@gmail.com

---

## 🙏 Acknowledgments

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - YouTube download library
- [Flask](https://flask.palletsprojects.com/) - Python web framework
- [React](https://react.dev/) - JavaScript UI library
- [ngrok](https://ngrok.com/) - Secure tunneling service

---

## ⚠️ Disclaimer

This tool is for educational purposes only. Please respect YouTube's Terms of Service and copyright laws. Only download content you have permission to download.

---

**Made with ❤️ for learning full-stack development**

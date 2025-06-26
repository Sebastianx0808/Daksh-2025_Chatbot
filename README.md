# DAKSH 2025 Chatbot

A 3D virtual assistant chatbot for CHRIST University's BCA program, featuring an interactive 3D avatar with voice capabilities and lip-sync animations.

![DAKSH 2025 Logo](./daksh_2025-frontend/public/favicon.ico)

## 🌟 Features

- **3D Virtual Avatar**: Interactive 3D character with realistic animations
- **Voice Interaction**: Speech-to-text and text-to-speech capabilities
- **Lip Sync**: Real-time lip synchronization with audio using Rhubarb Lip Sync
- **AI-Powered Responses**: Powered by Google's Gemini AI for intelligent conversations
- **Multiple Animations**: Various emotional states and gestures (idle, talking, laughing, crying, etc.)
- **Modern UI**: Beautiful and responsive interface built with React and Tailwind CSS
- **Real-time Communication**: WebSocket-based real-time chat functionality

## 🏗️ Architecture

The project consists of two main components:

### Frontend (`daksh_2025-frontend`)
- **React 18** with **Three.js** and **React Three Fiber**
- **3D Avatar System** with FBX animations
- **Voice Recording** and playback capabilities
- **Responsive UI** with Tailwind CSS
- **Real-time Chat Interface**

### Backend (`daksh_2025-backend`)
- **Node.js** with Express server
- **Google Cloud Speech-to-Text** API
- **Google Cloud Text-to-Speech** API
- **Google Gemini AI** for intelligent responses
- **Audio Processing** and lip-sync generation
- **RESTful API** endpoints

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Cloud Platform account with enabled APIs:
  - Speech-to-Text API
  - Text-to-Speech API
  - Gemini AI API

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Daksh_2025
   ```

2. **Backend Setup**
   ```bash
   cd daksh_2025-backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../daksh_2025-frontend
   npm install
   ```

4. **Environment Configuration**
   - Copy `daksh_2025-backend/daksh-447009-20ff32f1a756.json.example` to `daksh-447009-20ff32f1a756.json`
   - Copy `daksh_2025-backend/secret-key.json.example` to `secret-key.json`
   - Fill in your actual Google Cloud credentials and API keys
   - See `SETUP.md` for detailed configuration instructions
   - Ensure your Gemini API key is configured in the secret-key.json file

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd daksh_2025-backend
   npm start
   # or for development
   npm run dev
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd daksh_2025-frontend
   npm run dev
   ```

3. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`

## 🎮 Usage

1. **Text Chat**: Type messages in the chat interface to interact with DAKSH
2. **Voice Chat**: Click the microphone button to speak directly to the avatar
3. **3D Interaction**: The avatar responds with appropriate animations and expressions
4. **Voice Responses**: DAKSH speaks back with synthesized voice and lip-sync

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Google Cloud Speech-to-Text** - Speech recognition
- **Google Cloud Text-to-Speech** - Voice synthesis
- **Google Gemini AI** - Conversational AI
- **Rhubarb Lip Sync** - Automatic lip-sync generation

### 3D Assets
- **FBX Models** - 3D character animations
- **GLB Models** - Optimized 3D models
- **Audio Processing** - WAV/MP3 audio handling

## 📁 Project Structure

```
Daksh_2025/
├── daksh_2025-backend/                 # Backend server
│   ├── index.js                        # Main server file
│   ├── package.json                    # Backend dependencies
│   ├── audios/                         # Generated audio files
│   ├── Lipsync/                        # Rhubarb lip-sync tool
│   └── *.json                          # Configuration files
├── daksh_2025-frontend/                # Frontend application
│   ├── src/
│   │   ├── components/                 # React components
│   │   │   ├── Avatar.jsx              # 3D avatar component
│   │   │   ├── Experience.jsx          # 3D scene setup
│   │   │   └── UI.jsx                  # User interface
│   │   ├── hooks/
│   │   │   └── useChat.jsx             # Chat functionality
│   │   └── App.jsx                     # Main app component
│   ├── public/
│   │   ├── animations/                 # FBX animation files
│   │   └── models/                     # 3D model files
│   └── package.json                    # Frontend dependencies
└── README.md                           # This file
```

## 🎯 Key Components

### Avatar System
- Real-time 3D character rendering
- Multiple animation states (idle, talking, emotional expressions)
- Smooth transitions between animations
- Lip-sync integration for natural speech

### AI Integration
- Context-aware conversations about CHRIST University BCA program
- Natural language processing with Gemini AI
- Personality-driven responses as "DAKSH"
- Educational content delivery

### Voice System
- Real-time speech recognition
- Natural voice synthesis
- Audio processing and optimization
- Lip-sync generation for realistic speech

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is part of the DAKSH 2025 initiative for CHRIST University's BCA program.

## 🙏 Acknowledgments

- **CHRIST University** - For the educational context and requirements
- **Google Cloud Platform** - For AI and speech services
- **Three.js Community** - For 3D web graphics capabilities
- **Rhubarb Lip Sync** - For automatic lip-sync generation
- **React Three Fiber** - For bringing Three.js to React

## 🐛 Known Issues

- Large audio files may cause processing delays
- 3D model loading might be slow on low-end devices
- Voice recognition accuracy depends on microphone quality

## 🔮 Future Enhancements

- [ ] Multi-language support
- [ ] Enhanced emotional intelligence
- [ ] Mobile app version
- [ ] Advanced 3D interactions
- [ ] Personalized learning paths
- [ ] Integration with university systems

---

**Made with ❤️ for CHRIST University BCA Program - DAKSH 2025**

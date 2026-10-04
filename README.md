# Paw Pal 🐾

An AI-powered mobile and web application built using React, Vite, Tailwind CSS, and Google's Gemini AI. The app is bundled for Android using Capacitor.

## 🌟 Features
- **AI Integration**: Powered by Google's Gemini AI (`@google/genai`).
- **Cross-Platform**: Runs on the web and natively on Android.
- **Modern UI**: Styled with Tailwind CSS and animated using Framer Motion and canvas-confetti.
- **Lightning Fast**: Built with Vite and React 19.

## 🚀 Tech Stack
- **Frontend**: React 19, Tailwind CSS, Vite
- **AI**: Gemini API (`@google/genai`)
- **Mobile**: Capacitor (Android)
- **Styling & Animation**: Tailwind CSS, `motion`, `canvas-confetti`, `lucide-react`

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- Android Studio (if you wish to run/build the Android app locally)
- A Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/paw-pal.git
   cd paw-pal
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
   *(Note: You can use `.env.example` as a template)*

### Running the App

**For Web:**
```bash
npm run dev
```

**For Android:**
1. Sync web assets with the Capacitor project:
   ```bash
   npm run cap:sync
   ```
2. Open the project in Android Studio:
   ```bash
   npm run cap:open
   ```
*(Alternatively, you can build the APK using the provided `build-apk.ps1` script)*

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.

# Movie Ticket Booking Website with ChatGPT AI Assistant

A beautiful, responsive movie ticket booking website with an integrated AI chatbot powered by ChatGPT.

## Features

- 🎬 **Movie Catalog**: Browse and book tickets for the latest movies
- 🎭 **Interactive Seat Selection**: Choose multiple seats with visual feedback
- 🏢 **Multiple Theaters**: Book at different theater locations
- 🎫 **Ticket Download**: Download printable tickets after booking
- 🤖 **AI Assistant**: ChatGPT-powered chatbot for booking assistance
- 🎤 **Voice Input**: Speak to the chatbot using your microphone
- 🎨 **Beautiful UI**: Modern, responsive design with animations

## Quick Start

### Option 1: Using Python (Recommended)

1. **Install Python** (if not already installed)
   - Download from: https://www.python.org/downloads/
   - Make sure to check "Add Python to PATH" during installation

2. **Run the server**
   ```bash
   # Double-click the start_server.bat file
   # OR run manually:
   pip install -r requirements.txt
   python chatgpt_proxy.py
   ```

3. **Open your browser**
   - Go to: http://localhost:3001
   - The website will load with full ChatGPT integration

### Option 2: Using Node.js (Alternative)

If you have Node.js installed:

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the server**
   ```bash
   node openai-proxy.js
   ```

3. **Open your browser**
   - Go to: http://localhost:3001

## How to Use

1. **Browse Movies**: Scroll through the movie catalog
2. **Book Tickets**: Click "Book Now" on any movie
3. **Select Options**: Choose theater, date, time, and seats
4. **Confirm Booking**: Review and confirm your selection
5. **Download Ticket**: Get your printable ticket
6. **Chat with AI**: Use the chatbot for help and recommendations

## AI Assistant Features

- **Booking Help**: Get step-by-step booking guidance
- **Movie Recommendations**: Get personalized movie suggestions
- **Theater Information**: Learn about different theaters
- **Voice Input**: Speak to the chatbot using your microphone
- **Smart Responses**: Powered by ChatGPT for natural conversations

## File Structure

```
Movie Website/
├── index.html          # Main website file
├── styles.css          # All styling and animations
├── script.js           # JavaScript functionality
├── chatgpt_proxy.py    # Python backend server
├── openai-proxy.js     # Node.js backend server (alternative)
├── requirements.txt    # Python dependencies
├── package.json        # Node.js dependencies
├── start_server.bat    # Easy startup script
└── README.md           # This file
```


## API Key Security

⚠️ **Important**: The API key is currently hardcoded in the server files for demo purposes. In a production environment, you should:

1. Use environment variables
2. Implement proper authentication
3. Add rate limiting
4. Use HTTPS

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Python (Flask) or Node.js (Express)
- **AI**: OpenAI ChatGPT API
- **Voice**: Web Speech API
- **Styling**: Custom CSS with animations
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Poppins)

## License

This project is for educational and demonstration purposes. 

# Spot the Difference Game

A JSON-configurable "Spot the Difference" game built with HTML, CSS, and JavaScript. Players identify differences between two side-by-side images by clicking on them.

## 🎮 Features

- **JSON-Based Configuration**: All game data (images, differences, hints) are stored in JSON files
- **Multiple Levels**: Three different themed levels (Safari Animals, Mountain Landscape, Urban Cityscape)
- **Interactive Gameplay**: Click to spot differences with visual feedback
- **Scoring System**: Points awarded for finding differences, with penalties for using hints
- **Timer**: Track completion time for each level
- **Hint System**: Get hints for finding difficult differences
- **Progress Tracking**: Visual progress bar showing completion status
- **Responsive Design**: Works on desktop and mobile devices
- **Offline Support**: Service worker enables offline gameplay
- **Accessibility**: Keyboard shortcuts and screen reader support

## 🚀 How to Run

### Option 1: Local Development Server

1. Clone or download the repository
2. Navigate to the project directory
3. Start a local HTTP server:

   ```bash
   # Using Python 3
   python -m http.server 8000

   # Using Python 2
   python -m SimpleHTTPServer 8000

   # Using Node.js (if you have live-server installed)
   npx live-server

   # Using PHP
   php -S localhost:8000
   ```

4. Open your browser and go to `http://localhost:8000`

### Option 2: Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. In the project directory, run: `vercel`
3. Follow the prompts to deploy

### Option 3: Deploy to Netlify

1. Drag and drop the project folder to [Netlify Drop](https://app.netlify.com/drop)
2. Or connect your GitHub repository to Netlify for automatic deployments

## 📁 Project Structure

```
spot-the-difference-game/
├── index.html              # Main HTML file
├── styles.css              # Game styling
├── script.js               # Game logic
├── placeholder-images.css  # Placeholder image styles
├── sw.js                   # Service worker for offline support
├── README.md              # This file
├── data/                  # Game configuration files
│   ├── level1.json        # Safari Animals level
│   ├── level2.json        # Mountain Landscape level
│   └── level3.json        # Urban Cityscape level
├── images/                # Game images
│   ├── safari1.jpg        # Safari original image
│   ├── safari2.jpg        # Safari modified image
│   ├── mountain1.jpg      # Mountain original image
│   ├── mountain2.jpg      # Mountain modified image
│   ├── city1.jpg          # City original image
│   └── city2.jpg          # City modified image
└── sounds/                # Sound effects (optional)
    ├── click.mp3          # Click sound
    ├── success.mp3        # Success sound
    └── complete.mp3       # Completion sound
```

## 🎯 How the Game Uses JSON Configuration

The game dynamically loads configuration from JSON files in the `data/` directory. Each level has its own JSON file with the following structure:

```json
{
  "gameTitle": "Spot the Difference - Level Name",
  "images": {
    "image1": "path/to/original/image.jpg",
    "image2": "path/to/modified/image.jpg"
  },
  "differences": [
    {
      "x": 100,
      "y": 200,
      "width": 50,
      "height": 50,
      "hint": "Optional hint text for this difference"
    }
  ]
}
```

### JSON Configuration Properties

- **gameTitle**: The title displayed for the level
- **images**: Object containing paths to both images
  - **image1**: Path to the original image
  - **image2**: Path to the modified image
- **differences**: Array of difference objects
  - **x**: X-coordinate of the difference (in pixels)
  - **y**: Y-coordinate of the difference (in pixels)
  - **width**: Width of the clickable area
  - **height**: Height of the clickable area
  - **hint**: Optional hint text shown when player requests a hint

## 🎮 Game Controls

- **Start Game**: Begin the current level
- **Reset**: Reset the current level
- **Hint**: Get a hint for finding a difference (costs points)
- **Level Select**: Choose between different levels
- **Keyboard Shortcuts**:
  - `H`: Show hint
  - `R`: Reset game
  - `ESC`: Close hint modal

## 🎨 Adding New Levels

To add a new level:

1. Create a new JSON file in the `data/` directory (e.g., `level4.json`)
2. Add your images to the `images/` directory
3. Configure the JSON with image paths and difference coordinates
4. Update the level selector in `index.html`:
   ```html
   <option value="level4">Level 4 - Your Theme</option>
   ```

## 🖼️ Image Requirements

- **Format**: JPG, PNG, or SVG
- **Size**: Recommended 500x400 pixels for consistency
- **Differences**: Should be clear but not too obvious
- **Accessibility**: Ensure good contrast for visibility

## 🎯 Scoring System

- **Base Score**: 100 points per difference found
- **Hint Penalty**: -25 points per hint used
- **Score Reduction**: -10 points per hint used from future differences
- **Completion Bonus**: Up to 500 points based on performance

## 🌟 Features Breakdown

### Core Features

- ✅ JSON-based configuration
- ✅ Side-by-side image comparison
- ✅ Click-to-spot differences
- ✅ Visual difference marking
- ✅ Score tracking
- ✅ Timer functionality
- ✅ Success modal on completion

### Bonus Features

- ✅ Timer tracking
- ✅ Mobile responsive design
- ✅ Sound effects support
- ✅ Hint system
- ✅ Progress bar
- ✅ Multiple levels
- ✅ Keyboard shortcuts
- ✅ Offline support via service worker
- ✅ Confetti animation on completion

## 🛠️ Technical Implementation

### Technologies Used

- **HTML5**: Structure and semantics
- **CSS3**: Styling, animations, and responsive design
- **JavaScript (ES6+)**: Game logic and interactivity
- **Service Worker**: Offline support
- **JSON**: Configuration and data storage

### Key JavaScript Features

- **Class-based architecture**: Modular and maintainable code
- **Async/await**: Modern JavaScript for API calls
- **Event delegation**: Efficient event handling
- **Promise-based image loading**: Smooth user experience
- **Local storage**: Could be extended for save states

## 🎨 Customization

### Changing Images

1. Replace image files in the `images/` directory
2. Update the JSON configuration files with new coordinates
3. Ensure images are the same size for consistency

### Modifying Styles

- Edit `styles.css` to change colors, fonts, or layout
- The game uses CSS custom properties for easy theming
- Responsive breakpoints can be adjusted for different devices

### Adding Sound Effects

1. Add MP3 files to the `sounds/` directory
2. Update the audio elements in `index.html`
3. The game will automatically play sounds when available

## 🐛 Troubleshooting

### Common Issues

1. **Images not loading**: Ensure image paths in JSON are correct
2. **Click areas not working**: Check coordinate values in JSON
3. **Sounds not playing**: Browser may block autoplay; user interaction required

### Browser Compatibility

- **Modern browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile browsers**: iOS Safari, Android Chrome
- **Features**: ES6+ support required

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 🎉 Credits

- Game concept: Classic "Spot the Difference" puzzle
- Images: Custom SVG illustrations
- Fonts: Google Fonts (Poppins)
- Icons: Custom CSS shapes and animations

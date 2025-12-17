# Claude Terminal

A next-generation, dual-interface terminal application powered by AI. Built for developers and creators who want both powerful command-line tools and intuitive visual design capabilities.

## 🌟 Features

### Dual Interface Modes

**Code Mode** - Professional Terminal Emulator
- Full-featured terminal with xterm.js
- Native PTY integration (portable-pty)
- Supports all your favorite command-line tools
- Responsive terminal with automatic resize detection
- Cross-platform: macOS, Windows, Linux

**Modular Mode** - AI-Powered Visual Constructor
- Drag-and-drop UI builder with live preview
- Create buttons, containers, text, cards, and input fields
- Real-time property editing (colors, sizes, fonts, etc.)
- Hierarchical layer system with parent-child nesting
- Zoom controls (25%-200%) with keyboard shortcuts

### Visual Constructor Features

**Canvas Tools**
- **Drag & Drop**: Move elements freely on infinite canvas
- **Resize**: Corner handles for precise sizing (min: 50x30px)
- **Select & Edit**: Click to select, live property updates
- **Zoom**: Cmd/Ctrl +/- to zoom, Cmd/Ctrl 0 to reset
- **Grid**: Visual grid overlay for alignment

**Layer Management**
- **Hierarchical Layers**: See all elements organized by z-index
- **Expand/Collapse**: Containers show nested children with indentation
- **Drag to Reorder**: Change stacking order by dragging layers
- **Nest Elements**: Hold Shift while dropping to nest into containers
- **Show/Hide**: Toggle element visibility with eye icon
- **Parent-Child Movement**: Moving containers moves all nested children

**Properties Panel**
- **Position & Size**: Precise X/Y coordinates and width/height
- **Text Content**: Edit element labels and content
- **Colors**: Visual color pickers for background and text
- **Border Radius**: Slider control (0-50px)
- **Padding**: Slider control (0-50px)
- **Typography**: Font size (10-48px) and weight options

**Conversation History**
- Track your creative process with Claude
- Review past interactions and decisions
- Toggle visibility with chat icon

## 🎯 Demo

### Getting Started

1. **Launch the app** - You'll see the welcome screen in Code Mode
2. **Switch to Modular Mode** - Click the toggle in the top-right
3. **Create your first element** - Type "create a button" in the input
4. **Experiment with the tools**:
   - Click an element to select it
   - Drag elements around the canvas
   - Use resize handles to adjust size
   - Edit properties in the right panel
   - Try keyboard shortcuts for zoom

### Example Workflow: Building a Login Form

```
1. Create a container → "create a container"
2. Create input fields → "create an input field" (twice)
3. Create a button → "create a submit button"
4. Organize in layers:
   - Drag button over container
   - Hold Shift and drop to nest inside
   - Repeat for input fields
5. Style your components:
   - Select container, adjust background color
   - Select button, change to green with white text
   - Adjust sizes using resize handles
6. Move as a group:
   - Drag the container
   - All nested elements move together!
```

## 🚀 Installation

### Prerequisites

- **Node.js** 18+ and npm
- **Rust** 1.70+ (for Tauri)
- **System Dependencies**:
  - macOS: Xcode Command Line Tools
  - Windows: Microsoft C++ Build Tools
  - Linux: libwebkit2gtk, libgtk-3

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/claude-terminal.git
cd claude-terminal

# Install dependencies
npm install

# Run development server
npm run tauri dev
```

The app will launch with hot-module reloading enabled.

## ⌨️ Keyboard Shortcuts

### Global
- **Cmd/Ctrl + Plus (+)** - Zoom in
- **Cmd/Ctrl + Minus (-)** - Zoom out
- **Cmd/Ctrl + 0** - Reset zoom to 100%

### Canvas (Modular Mode)
- **Click** - Select element
- **Click + Drag** - Move element
- **Drag handle (⋮⋮)** - Reorder layers
- **Shift + Drop on container** - Nest element inside

## 🏗️ Architecture

### Tech Stack

**Frontend**
- React 19 with TypeScript
- TailwindCSS for styling
- Zustand for state management
- xterm.js for terminal emulation
- Phosphor Icons for UI

**Backend**
- Tauri v2 (Rust)
- portable-pty for cross-platform PTY
- Native window management

**Build**
- Vite for fast development
- Rust cargo for native compilation
- ~8MB final bundle (vs 120MB for Electron)

### Project Structure

```
claude-terminal/
├── src/
│   ├── components/
│   │   ├── CodeMode/          # Terminal emulator
│   │   │   └── Terminal.tsx
│   │   ├── ModularMode/        # Visual constructor
│   │   │   ├── Canvas.tsx      # Main canvas with zoom
│   │   │   ├── DraggableElement.tsx  # Draggable/resizable elements
│   │   │   ├── LayersPanel.tsx       # Hierarchical layer list
│   │   │   ├── PropertiesPanel.tsx   # Property editor
│   │   │   ├── ConversationPanel.tsx # Chat history
│   │   │   └── WelcomeScreen.tsx     # Getting started
│   │   └── shared/
│   │       └── Header.tsx      # App header with mode toggle
│   ├── hooks/
│   │   └── useTerminal.ts      # Terminal lifecycle management
│   ├── lib/
│   │   └── claude.ts           # Mock Claude API client
│   ├── store/
│   │   └── appStore.ts         # Global state
│   ├── types/
│   │   └── modular.ts          # TypeScript types
│   └── main.tsx                # App entry point
├── src-tauri/
│   ├── src/
│   │   ├── main.rs             # Tauri app initialization
│   │   ├── terminal.rs         # PTY management
│   │   └── commands.rs         # Tauri commands
│   └── tauri.conf.json         # Tauri configuration
└── package.json
```

## 🔧 Building for Production

### Create Production Build

```bash
# Build for your current platform
npm run tauri build
```

This creates:
- **macOS**: `.dmg` installer in `src-tauri/target/release/bundle/dmg/`
- **Windows**: `.msi` installer in `src-tauri/target/release/bundle/msi/`
- **Linux**: `.deb` or `.AppImage` in `src-tauri/target/release/bundle/`

### Build Configuration

Edit `src-tauri/tauri.conf.json` to customize:
- App name and version
- Window dimensions
- Bundle identifier
- System permissions
- Icon paths

## 🎨 Customization

### Changing Theme Colors

Edit `tailwind.config.js`:

```js
extend: {
  colors: {
    'claude-purple': '#a78bfa',  // Code mode accent
    'claude-green': '#34d399',   // Modular mode accent
    'terminal-bg': '#0f1419',
    'terminal-surface': '#1a1f29',
  }
}
```

### Adding New Element Types

1. Add type to `src/types/modular.ts`:
```typescript
type: 'button' | 'container' | 'text' | 'image' | 'input' | 'card' | 'your-new-type'
```

2. Implement rendering in `src/components/ModularMode/DraggableElement.tsx`:
```typescript
case 'your-new-type':
  return <YourCustomElement />;
```

## 🐛 Troubleshooting

### Terminal shows 3 prompts
- Fixed: React Strict Mode disabled in production

### Elements won't drag/resize
- Ensure you're clicking the drag handle (⋮⋮) for layer reordering
- For canvas dragging, click anywhere on the element

### Zoom not working
- Check that you're in Modular Mode (not Code Mode)
- Try clicking directly on the +/- buttons

### Build fails on macOS
```bash
# Install Xcode Command Line Tools
xcode-select --install
```

### Build fails on Linux
```bash
# Install required dependencies
sudo apt-get install libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
```

## 🤝 Contributing

This project was built as a demo for Anthropic job application. Feel free to fork and experiment!

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Anthropic** - For Claude AI and the inspiration
- **Tauri Team** - For the amazing desktop app framework
- **xterm.js** - For robust terminal emulation
- **React Team** - For the best UI framework

---

**Built with ❤️ for the Anthropic team**

*Showcasing Claude Terminal - Where code meets creativity*

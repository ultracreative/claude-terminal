# Claude Code

**AI-Powered Development Environment** - A next-generation IDE combining terminal power, intelligent code editing, and visual UI building in one seamless application.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Overview

Claude Code is a revolutionary development environment that brings together three powerful modes:

- **Terminal Mode** - Full-featured terminal emulator
- **Editor Mode** - Monaco editor with AI assistance
- **Modular Mode** - Visual UI builder with drag-and-drop

Built with React, TypeScript, Tauri, and powered by Claude AI.

---

## 💡 The Vision

> **"Code is for machines. Creation is for humans."**

### A Revolutionary Approach to AI-Assisted Creation

Claude Code reimagines AI-assisted creation by recognizing a fundamental truth: **different users need different interaction models**. Not different visual themes—different ways of thinking, working, and creating.

This project serves everyone—from experienced developers to anyone with a problem to solve—through dual interaction models and the groundbreaking **Allowance Control** methodology.

### The Problem

Current AI coding tools force everyone into the same interaction model:

- Developers get tools that assume coding knowledge
- Non-developers get "dumbed down" versions that limit capability
- No one gets an interface optimized for how they naturally think

**The result?** AI's transformative potential reaches only a fraction of the people who could benefit from it.

### The Solution: Dual Interaction Models

#### ⚡ Claude Code - Terminal Interface

**Who:** Experienced developers
**Why:** They live in the terminal - it's their native environment
**How:** Keyboard-driven TUI, technical language, direct control
**Philosophy:** Speed, efficiency, respect for expertise

#### 🎯 Claude Modular - Visual Constructor

**Who:** Anyone with a problem to solve
**Why:** Visual thinking is universal - code is not
**How:** Guided visual builder, AI-assisted, mouse-friendly
**Philosophy:** Accessible, empowering, no barriers to entry

### The Innovation: Allowance Control

**Allowance Control** is a design pattern that breaks any creative task into logical, manageable steps that work for everything.

#### The Seven Stages

1. **ALLOW** → Grant permission/establish possibility
2. **CREATE** → Generate the element/motion/behavior
3. **CONTROL** → Define parameters and constraints
4. **CALIBRATE** → Fine-tune the behavior
5. **PLACE** → Position in space/context
6. **ADJUST** → Refine the positioning
7. **FEATURE** → Lock in as production-ready code

#### Why This Works

- **Progressive Complexity:** Start simple, add sophistication gradually
- **Universal Application:** Same steps work for buttons, animations, forms, layouts
- **Natural Thinking:** Mirrors how humans actually approach design
- **AI-Guidable:** Each step is a clear prompt for AI assistance
- **Scales Infinitely:** Works for simple buttons or complex systems

### The Visual Constructor

The visual constructor is the heart of Modular Mode. It's where ideas become tangible.

#### Core Principles

- **Visual First:** See what you're building in real-time
- **AI-Guided:** Claude walks you through Allowance Control
- **Progressive Disclosure:** Complexity appears when needed, not before
- **Professional Output:** Generates production-ready code
- **Accessible to Anyone:** No coding knowledge required

### Why This Matters

We're at an inflection point. AI can generate code, but that's not enough.

**The real breakthrough is making creation accessible to everyone while maintaining professional quality.**

That's what Claude Code does.

### The Ask

This started as a job application demo for Anthropic's Product Designer, Claude Code role.

It became something bigger: **a vision for the future of human-AI collaboration in creation.**

This is just the beginning.

The question isn't "Can this be built?"
**The question is "Who will build it first?"**

I hope it's us. I hope it's Anthropic.

---

## ✨ Features

### 🖥️ Terminal Mode

Professional terminal emulator with modern features:

- **Full PTY Integration** - Native shell experience with portable-pty
- **xterm.js** - Industry-standard terminal rendering
- **Responsive Sizing** - Automatic resize detection with ResizeObserver
- **Rich Colors** - 256-color and true-color support
- **Shell Support** - Works with bash, zsh, fish, PowerShell, etc.
- **Cross-Platform** - macOS, Windows, Linux

### 📝 Editor Mode (NEW!)

Monaco-powered code editor with integrated AI assistance:

**Code Editor Features:**
- **Monaco Editor** - Same engine as VS Code
- **Syntax Highlighting** - Support for TypeScript, JavaScript, Python, Rust, and more
- **File Explorer** - Tree view with expand/collapse
- **Multi-File Tabs** - Open multiple files simultaneously
- **Dirty State Tracking** - Visual indicators for unsaved changes (green dot)
- **Real File Operations** - Read and write to disk via Tauri
- **Smart Filtering** - Auto-hides node_modules, .git, target, dist

**AI Chat Assistant:**
- **Context-Aware** - Claude sees your entire file content
- **Quick Actions** - One-click for common tasks:
  - 💡 Explain this code
  - 🛡️ Add error handling
  - ⚡ Optimize this code
  - 📘 Add TypeScript types
- **Conversation History** - Maintains context throughout your session
- **General Chat** - Ask programming questions anytime, even without a file open
- **Code Suggestions** - Get complete implementations, refactoring ideas, debugging help

**File System Integration:**
- Browse project directory structure
- Open files with syntax detection
- Save changes with Cmd/Ctrl+S
- Automatic language detection from file extension

### 🎨 Modular Mode

Visual UI builder for rapid prototyping:

**Canvas Tools:**
- **Drag & Drop** - Move elements freely on infinite canvas
- **Multi-Resize** - 4 corner handles for precise sizing (min: 50x30px)
- **Select & Edit** - Click to select, live property updates
- **Zoom** - 25%-200% with Cmd/Ctrl +/-
- **Visual Grid** - Alignment guides

**Layer Management:**
- **Hierarchical Layers** - See all elements organized by z-index
- **Expand/Collapse** - Containers show nested children with indentation
- **Drag to Reorder** - Change stacking order by dragging layers
- **Nest Elements** - Hold Shift while dropping to nest into containers
- **Show/Hide** - Toggle element visibility with eye icon
- **Parent-Child Movement** - Moving containers moves all nested children
- **Cascade Delete** - Deleting parents removes all children

**Properties Panel:**
- Position & Size (X, Y, width, height)
- Text Content editing
- Color pickers (background, text)
- Border Radius (0-50px)
- Padding (0-50px)
- Typography (font size 10-48px, weight)

**Element Types:**
- Buttons
- Containers
- Text labels
- Input fields
- Cards

---

## ⌨️ Keyboard Shortcuts

### Mode Switching
- **Cmd/Ctrl + Shift + T** → Terminal Mode
- **Cmd/Ctrl + Shift + E** → Editor Mode
- **Cmd/Ctrl + Shift + M** → Modular Mode

### Editor Mode
- **Cmd/Ctrl + S** → Save current file
- **Cmd/Ctrl + K** → Toggle AI Assistant panel

### Modular Mode
- **Cmd/Ctrl + Plus (+)** → Zoom in
- **Cmd/Ctrl + Minus (-)** → Zoom out
- **Cmd/Ctrl + 0** → Reset zoom to 100%
- **Click** → Select element
- **Click + Drag** → Move element
- **Drag handle (⋮⋮)** → Reorder layers
- **Shift + Drop on container** → Nest element inside

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18+ and npm
- **Rust** 1.70+ (for Tauri)
- **System Dependencies**:
  - macOS: Xcode Command Line Tools (`xcode-select --install`)
  - Windows: Microsoft C++ Build Tools
  - Linux: libwebkit2gtk, libgtk-3

### Development Setup

```bash
# Clone the repository
git clone https://github.com/ultracreative/claude-terminal.git
cd claude-terminal

# Install dependencies
npm install

# Run development server
npm run tauri dev
```

The app will launch with hot-module reloading enabled.

### Download Pre-Built App

**macOS (Apple Silicon):**
1. Go to [Releases](https://github.com/ultracreative/claude-terminal/releases)
2. Download `Claude Code_0.1.0_aarch64.dmg`
3. Open the DMG and drag to Applications
4. Launch Claude Code!

---

## 🎯 Usage Examples

### Example 1: Terminal Workflow

```bash
1. Launch Claude Code
2. Press Cmd+Shift+T (switch to Terminal)
3. Run your favorite commands:
   - npm install
   - git status
   - python script.py
```

### Example 2: Code Editing with AI

```bash
1. Press Cmd+Shift+E (switch to Editor)
2. Open a file from the file explorer
3. Press Cmd+K to open AI chat
4. Ask: "Explain this code"
5. Ask: "Add error handling for edge cases"
6. Copy the suggestions and apply them
7. Press Cmd+S to save
```

### Example 3: Building a Login Form Visually

```bash
1. Press Cmd+Shift+M (switch to Modular)
2. Type: "create a container"
3. Type: "create an input field" (twice for email & password)
4. Type: "create a button"
5. In the Layers panel:
   - Drag button over container
   - Hold Shift and drop to nest inside
   - Repeat for input fields
6. Style your components:
   - Select container, change background color
   - Select button, change to green
   - Adjust sizes with resize handles
7. Move the container - all nested elements move together!
```

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 19 with TypeScript
- TailwindCSS v3 for styling
- Zustand for state management
- xterm.js for terminal emulation
- Monaco Editor for code editing
- Phosphor Icons for UI

**Backend:**
- Tauri v2 (Rust-based)
- portable-pty for cross-platform PTY
- Native file system operations
- Native window management

**Build:**
- Vite for fast development
- TypeScript strict mode
- Rust cargo for native compilation
- ~3.5MB final bundle (vs 120MB+ for Electron)

### Project Structure

```
claude-code/
├── src/
│   ├── components/
│   │   ├── CodeMode/          # Terminal emulator
│   │   │   └── Terminal.tsx
│   │   ├── EditorMode/         # Code editor with AI
│   │   │   ├── EditorMode.tsx      # Main editor container
│   │   │   ├── FileExplorer.tsx    # File tree sidebar
│   │   │   ├── FileTabs.tsx        # Open file tabs
│   │   │   ├── Toolbar.tsx         # Editor toolbar
│   │   │   └── AIChatPanel.tsx     # AI assistant panel
│   │   ├── ModularMode/        # Visual UI builder
│   │   │   ├── Canvas.tsx          # Main canvas with zoom
│   │   │   ├── DraggableElement.tsx # Draggable/resizable elements
│   │   │   ├── LayersPanel.tsx      # Hierarchical layer list
│   │   │   ├── PropertiesPanel.tsx  # Property editor
│   │   │   ├── ConversationPanel.tsx # Chat history
│   │   │   └── WelcomeScreen.tsx    # Getting started
│   │   └── shared/
│   │       └── Header.tsx      # App header with 3-mode toggle
│   ├── hooks/
│   │   └── useTerminal.ts      # Terminal lifecycle management
│   ├── lib/
│   │   └── claude.ts           # Claude API client
│   ├── store/
│   │   └── appStore.ts         # Global state (Zustand)
│   ├── types/
│   │   ├── index.ts            # Global types
│   │   └── modular.ts          # Modular mode types
│   └── main.tsx                # App entry point
├── src-tauri/
│   ├── src/
│   │   ├── main.rs             # Tauri app initialization
│   │   ├── lib.rs              # Library exports
│   │   ├── terminal.rs         # PTY management
│   │   ├── commands.rs         # Terminal commands
│   │   └── filesystem.rs       # File system operations
│   └── tauri.conf.json         # Tauri configuration
├── package.json
└── README.md
```

---

## 🔧 Building for Production

### Create Production Build

```bash
# Build for your current platform
npm run tauri build
```

**Output locations:**
- **macOS**: `src-tauri/target/release/bundle/dmg/Claude Code_0.1.0_aarch64.dmg`
- **Windows**: `src-tauri/target/release/bundle/msi/`
- **Linux**: `src-tauri/target/release/bundle/deb/` or `.AppImage`

### Build Configuration

Edit `src-tauri/tauri.conf.json` to customize:
- App name and version
- Window dimensions (default: 1400x900)
- Bundle identifier
- System permissions
- Icon paths

---

## 🎨 Customization

### Changing Theme Colors

Edit `tailwind.config.js`:

```javascript
extend: {
  colors: {
    'claude-purple': '#a78bfa',    // Terminal mode accent
    'claude-green': '#34d399',     // Modular mode accent
    'terminal-bg': '#0a0e14',
    'terminal-surface': '#1a1f29',
    'terminal-border': '#2d3748',
  }
}
```

### Adding Monaco Editor Languages

In `EditorMode.tsx`, the language is auto-detected from file extension:

```typescript
const getLanguageFromPath = (path: string): string => {
  const ext = path.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'ts': case 'tsx': return 'typescript';
    case 'js': case 'jsx': return 'javascript';
    case 'py': return 'python';
    case 'rs': return 'rust';
    // Add your language here
    default: return 'plaintext';
  }
};
```

---

## 🐛 Troubleshooting

### Editor shows black screen
- **Fix**: Ensure file paths are valid
- Check browser console for errors
- Try switching modes and back

### Terminal not responsive
- **Fix**: Terminal auto-resizes with ResizeObserver
- Try switching to another mode and back
- Restart the app

### File operations not working
- **Fix**: Ensure Tauri has file system permissions
- Check that file paths are absolute
- Verify files aren't locked by other processes

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

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/ultracreative/claude-terminal/issues).

### Development Workflow

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Anthropic** - For Claude AI and the inspiration
- **Tauri Team** - For the amazing desktop app framework
- **xterm.js** - For robust terminal emulation
- **Monaco Editor** - For VS Code's editor engine
- **React Team** - For the best UI framework

---

## 📊 Stats

- **Lines of Code**: 13,382+
- **Components**: 20+
- **Bundle Size**: ~3.5MB (DMG)
- **Platforms**: macOS, Windows, Linux
- **Languages Supported**: TypeScript, JavaScript, Python, Rust, JSON, CSS, HTML, Markdown, and more

---

## 📬 Contact

**Dan Rodriguez**
Email: [danultracreative@gmail.com](mailto:danultracreative@gmail.com)

For inquiries, collaboration opportunities, or to discuss the vision behind Claude Code, feel free to reach out.

---

**Built with ❤️ by Dan Rodriguez**

*"Code is for machines. Creation is for humans."*

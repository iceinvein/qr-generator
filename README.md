# QR Magic ✨

A modern, feature-rich QR code generator built with React, TypeScript, and HeroUI. Create customizable QR codes for various data types with logo branding, color customization, and multiple export formats.

🌐 **Live Demo**: [qr-magic.netlify.app](https://qr-magic.netlify.app)

![React](https://img.shields.io/badge/React-19.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![Vite](https://img.shields.io/badge/Vite-7.x-purple) ![HeroUI](https://img.shields.io/badge/HeroUI-v2-orange) [![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/qr-magic/deploys)

## ✨ Features

### 🎯 Multiple QR Code Types
- **Text** - Plain text content
- **URL** - Website links
- **Email** - Email addresses (opens default email client)
- **Phone** - Phone numbers (opens dialer)
- **WiFi** - WiFi network credentials (auto-connect)
- **Contact** - vCard contact information
- **Event** - Calendar events with timezone support
- **Location** - GPS coordinates (geo URI)

### 🎨 Customization Options
- **Colors** - Custom foreground and background colors with live preview
- **Size** - Adjustable QR code dimensions (128px - 1024px)
- **Margin** - Configurable quiet zone (0-10 modules)
- **Error Correction** - Four levels (L, M, Q, H) with automatic optimization
- **Logo Branding** - Add your logo to the center of QR codes
  - Supports PNG, JPG, and SVG formats
  - Adjustable logo size (10-30%)
  - Automatic error correction level adjustment

### 📥 Export Formats
- **PNG** - High-quality raster images
- **SVG** - Scalable vector graphics
- Timestamped filenames for easy organization

### 🛡️ Smart Features
- **Real-time Validation** - Instant feedback on input errors
- **Debounced Generation** - Smooth performance during editing
- **Timezone Awareness** - Calendar events use local timezone
- **Accessibility** - ARIA labels and keyboard navigation
- **Dark Mode** - Full dark mode support
- **Responsive Design** - Works on desktop and mobile

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (recommended) or Node.js 18+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd qr-code-generator

# Install dependencies
bun install

# Start development server
bun run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Build the application
bun run build

# Preview production build
bun run preview
```

## 🏗️ Tech Stack

### Core
- **React 19.2** - UI framework
- **TypeScript 5.9** - Type safety
- **Vite 7.x** - Build tool and dev server

### UI & Styling
- **HeroUI v2** - Component library
- **Tailwind CSS 4.x** - Utility-first CSS
- **Framer Motion** - Animations
- **Lucide React** - Icon library

### QR Code Generation
- **qr-code-styling** - QR code rendering with customization
- **@internationalized/date** - Date/time handling with timezone support

### Code Quality
- **Biome** - Fast linter and formatter
- **TypeScript Strict Mode** - Enhanced type checking

## 📁 Project Structure

```
src/
├── components/
│   └── qr/                    # QR code components
│       ├── qr-input-panel.tsx       # Main input panel with type selector
│       ├── data-input-form.tsx      # Type-specific input forms
│       ├── style-configurator.tsx   # Color, size, margin controls
│       ├── branding-panel.tsx       # Logo upload and configuration
│       ├── qr-preview-canvas.tsx    # QR code preview with loading states
│       ├── qr-code-renderer.tsx     # Core QR rendering logic
│       └── export-controls.tsx      # Export format and download
├── utils/
│   ├── qr-encoding.ts         # Data encoding functions
│   ├── qr-validation.ts       # Input validation
│   └── qr-utils.ts            # Utility functions
├── types/
│   └── qr.ts                  # TypeScript type definitions
├── pages/
│   └── qr-generator.tsx       # Main QR generator page
├── layouts/
│   └── default.tsx            # App layout with navbar
└── config/
    └── site.ts                # Site configuration
```

## 🎯 Usage Examples

### Creating a WiFi QR Code
1. Select "WiFi" from the bottom navigation
2. Enter your network name (SSID)
3. Choose encryption type (WPA/WEP/None)
4. Enter password (if encrypted)
5. Scan with your phone to auto-connect!

### Adding a Logo
1. Create any QR code type
2. Scroll to "Logo Branding" section
3. Drag & drop or click to upload your logo
4. Adjust logo size (recommended: 10-25%)
5. Error correction automatically sets to High (H)

### Creating a Calendar Event
1. Select "Event" from the bottom navigation
2. Enter event title
3. Pick start and end date/time (uses your timezone)
4. Add location and description (optional)
5. Export and share!

## ⚙️ Configuration

### Error Correction Levels
- **L (Low - 7%)** - Smallest QR code, minimal damage recovery
- **M (Medium - 15%)** - Balanced size and recovery
- **Q (Quartile - 25%)** - Good damage recovery
- **H (High - 30%)** - Maximum recovery, required for logos

### Logo Guidelines
- **Supported formats**: PNG, JPG, SVG
- **Max file size**: 2MB
- **Recommended size**: 10-25% of QR code
- **Best practices**: 
  - Use simple, high-contrast logos
  - Avoid very detailed images
  - Keep logo centered

## 🔧 Development

### Available Scripts

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Run linter with auto-fix
bun run lint
```

### Code Style
- **Indentation**: Tabs
- **Quotes**: Double quotes
- **Import sorting**: Automatic via Biome
- **TypeScript**: Strict mode enabled

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- [HeroUI](https://heroui.com/) - Beautiful React component library
- [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) - QR code generation
- [Lucide](https://lucide.dev/) - Icon library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ using React, TypeScript, and HeroUI

**QR Magic** - Create magical QR codes in seconds! ✨

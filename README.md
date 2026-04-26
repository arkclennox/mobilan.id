# Mobilan.id - Indonesian Travel Cost Calculator

A modern, production-ready travel cost calculator website that helps users calculate fuel costs for road trips between Indonesian cities.

## Features

- 🚗 **Smart Fuel Calculator** - Calculate fuel costs based on vehicle type, distance, and current fuel prices
- 🏙️ **Indonesian Cities Database** - Comprehensive database of major Indonesian cities with coordinates
- 🚙 **Vehicle Database** - 50+ Indonesian car models with real fuel efficiency data
- 🌓 **Dark/Light Mode** - Theme toggle with system preference detection
- 📱 **Fully Responsive** - Mobile-first design that works on all devices
- ⚡ **Fast Performance** - Optimized with Next.js 14 and modern web technologies
- 🔍 **SEO Optimized** - Complete meta tags, sitemap, and structured data
- 🎨 **Modern Design** - Clean, professional UI with subtle animations

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Theme**: Next-themes for dark/light mode
- **Font**: Inter from Google Fonts
- **Deployment**: Vercel-ready configuration

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/mobilan-id.git
cd mobilan-id
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── blog/              # Blog pages
│   ├── destinasi/         # Destinations page
│   ├── kalkulator/        # Calculator page
│   ├── kontak/            # Contact page
│   ├── tentang/           # About page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── calculator/        # Calculator-specific components
│   ├── layout/           # Layout components (header, footer)
│   ├── ui/               # Shadcn/ui components
│   └── theme-provider.tsx # Theme context provider
├── data/                 # JSON data files
│   ├── cities.json       # Indonesian cities database
│   └── cars.json         # Vehicle database
├── lib/                  # Utility functions
│   ├── calculator.ts     # Calculation logic
│   └── utils.ts          # General utilities
└── public/              # Static assets
```

## Key Components

### Travel Calculator
- Real-time fuel cost calculation
- Distance calculation using Haversine formula
- Support for 50+ Indonesian car models
- Comprehensive city database

### Responsive Design
- Mobile-first approach
- Breakpoints: 768px (tablet), 1024px (desktop)
- Touch-friendly interface
- Optimized for all screen sizes

### Theme System
- Light/dark mode toggle
- System preference detection
- Smooth transitions
- Consistent color system

## Data Files

### cities.json
Contains Indonesian cities with:
- Coordinates (latitude, longitude)
- Province information
- City descriptions
- Hero images

### cars.json
Contains vehicle data with:
- Brand and model information
- Fuel efficiency (km/L)
- Vehicle categories
- Real Indonesian car models

## SEO Features

- Complete meta tags for all pages
- Open Graph and Twitter Card support
- Structured data markup
- XML sitemap generation
- Robots.txt configuration
- Optimized page titles and descriptions

## Performance Optimizations

- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Optimized fonts loading
- Minimal bundle size
- Fast page transitions

## Deployment

The application is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

For custom domain setup:
1. Add your domain in Vercel dashboard
2. Configure DNS settings
3. Enable HTTPS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- Website: [https://mobilan.id](https://mobilan.id)
- Email: info@mobilan.id
- GitHub: [https://github.com/yourusername/mobilan-id](https://github.com/yourusername/mobilan-id)

## Acknowledgments

- Images from [Pexels](https://pexels.com)
- Icons from [Lucide](https://lucide.dev)
- UI components from [Shadcn/ui](https://ui.shadcn.com)
# Portfolio Website

A minimal, modern portfolio website built with React, TypeScript, and Tailwind CSS. Features a clean monospace design with dark/light mode support.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)

## Features

- **Responsive Design** – Optimized for all screen sizes
- **Dark/Light Mode** – System preference detection with manual toggle
- **Timeline Section** – Showcase experience and education
- **Project Grid** – Filterable project showcase with tabs
- **Monospace Aesthetic** – Clean, developer-focused typography
- **Accessible** – Built with Radix UI primitives

## ️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS 4 + shadcn/ui components
- **Build Tool:** Vite
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/amolvyas-6/portfolio-website.git
cd portfolio-website

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── HeroSection.tsx
│   ├── ProjectCard.tsx
│   ├── ProjectGrid.tsx
│   ├── ProjectSection.tsx
│   ├── ThemeToggle.tsx
│   ├── TimelineList.tsx
│   └── TimelineSection.tsx
├── data/
│   └── portfolio.ts  # Portfolio content (edit this!)
├── lib/
│   └── utils.ts
├── App.tsx
├── index.css
└── main.tsx
```

## ️ Customization

Edit `src/data/portfolio.ts` to update:

- **Personal Details** – Name, headline, bio, contact info
- **Skills** – Technical skills with icons
- **Social Links** – GitHub, LinkedIn, etc.
- **Timeline** – Work experience and education
- **Projects** – Featured and personal projects

## 📄 License

MIT License – feel free to use this for your own portfolio!

---

Built by [Amol Vyas](https://github.com/amolvyas-6)

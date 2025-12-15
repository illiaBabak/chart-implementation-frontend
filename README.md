# 📊 Chart Implementation Frontend

> A frontend pet project for visualizing user data with interactive custom charts

## 📸 Project Preview

![View](https://docs.google.com/uc?id=1V9LWgOscQjTdbVXdQrkO7vVFZvB-Lfkp)

## 🎯 Project Goal

This project was built as a **frontend for my own backend API**, with the main purpose to:

- **Learn Jest** for unit testing in a real-world React/TypeScript project
- **Learn React Testing Library (RTL)** and test UI from the user perspective
- **Implement charts manually** (pie and bar charts) using **SVG and CSS**, without relying on chart libraries such as Chart.js or D3.js

## 🚀 Tech Stack

### Core Technologies

- **React 19** — UI library for building the application
- **TypeScript** — typed superset of JavaScript
- **Vite** — fast dev server and bundler
- **Tailwind CSS** — utility-first CSS framework

### Additional Tools

- **TanStack Query (React Query)** — server state management and caching
- **pdfmake** — PDF generation
- **Motion** — animations

### Testing

- **Jest** — test runner and assertion library
- **React Testing Library (RTL)** — testing React components through user interactions

## ✨ Features

### 📈 Data Visualization

- **Pie Chart** — implemented with SVG `<circle>` elements and `stroke-dasharray`/`stroke-dashoffset` to build segments
- **Bar Chart** — implemented using flexbox and dynamic height calculation based on data

### 🎨 Functionality

- Category selection via dropdown (age, gender, workplace, industry, location, birth date)
- Interactive tooltips on hover over chart elements
- Responsive layout for different screen sizes
- Legend component for better readability of chart data

### 📤 Data Export

- Export data to **CSV**
- Generate **PDF** reports with charts
- Export data to **archive (ZIP)**

### 🔄 Backend Integration

- Uses **my own backend API** to fetch user data
- **React Query** is used to handle requests, caching, loading states and errors

## 🛠 Setup and Scripts

### Prerequisites

- Node.js (recommended **v18+**)
- **pnpm** (or npm/yarn)

### Install dependencies

```bash
pnpm install
```

### Start development server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

### Build for production

```bash
pnpm build
```

### Run tests

```bash
pnpm test
```

## 📁 Project Structure

```text
src/
├── api/                 # API clients and data fetching
├── components/          # React components
│   ├── BarChart/        # Bar chart component
│   ├── PieChart/        # Pie chart component
│   ├── Dropdown/        # Dropdown component
│   ├── Legend/          # Legend component
│   ├── Tooltip/         # Tooltip component
│   └── ...
├── contexts/            # React contexts
├── types/               # TypeScript types
├── utils/               # Helper utilities
└── __tests__/           # Test files
```

## 🧪 Testing

The project uses **Jest** and **React Testing Library** for unit and integration tests. Test coverage includes:

- Chart components (correct rendering of segments and bars)
- Interactive elements (dropdown, tooltips)
- Data calculation logic for charts

Example test run:

```bash
pnpm test
```

---

This project is a **learning pet project** that connects a custom backend with a modern React frontend and focuses on **testing (Jest + RTL)** and **hand-crafted chart visualizations**.

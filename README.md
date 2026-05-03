# Telemoz - Enterprise Digital Marketing Platform

A high-level, interactive, and enterprise-grade digital marketing platform built with Next.js, featuring AI-powered tools, white-label reporting, and seamless client-agency collaboration.

## 🚀 Features

### For Digital Marketing Professionals (Pros)
- **Comprehensive Dashboard**: Real-time business metrics, project tracking, and performance analytics
- **DigitalBOX Suite**: Complete CRM, invoicing, project management, and AI-powered tools
- **AI-Powered Tools**: SEO analysis, ad copy generation, content optimization, and more
- **White-Label Reporting**: Automated, branded reports with aggregated analytics
- **Marketplace Integration**: Connect with clients and manage inquiries

### For Clients
- **Client Dashboard**: Track campaign performance, view reports, and communicate with Pros
- **Project Management**: Monitor project progress, milestones, and deliverables
- **Performance Metrics**: Real-time KPIs, traffic, leads, and ROI tracking
- **Secure Messaging**: Internal communication system with Pros

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom component library with Framer Motion animations
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Database**: PostgreSQL (Prisma ORM)
- **Payments**: Stripe (ready for integration)
- **Storage**: MinIO (ready for integration)

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Design System

The platform features a modern, enterprise-grade design system with:
- **Color Palette**: Professional gradient-based theme with primary, accent, and neutral colors
- **Animations**: Smooth, fluid animations using Framer Motion
- **Glass Morphism**: Modern glassmorphic UI elements
- **Responsive Design**: Fully responsive across all device sizes
- **Dark Theme**: Optimized dark theme for professional use

## 📁 Project Structure

```
telemoz/
├── app/                    # Next.js App Router
│   ├── (protected)/        # Protected dashboard routes
│   │   ├── pro/           # Pro dashboard pages
│   │   └── client/        # Client dashboard pages
│   └── page.tsx           # Homepage
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   └── layout/       # Layout components
│   └── lib/              # Utility functions
└── public/                # Static assets
```

## 🎯 Key Pages

- `/` - Marketing homepage
- `/pro` - Pro dashboard overview
- `/pro/projects` - Project management
- `/pro/digitalbox/*` - DigitalBOX tools (CRM, Invoicing, AI Tools, Reporting)
- `/client` - Client dashboard
- `/client/my-pros` - Client's Pros list
- `/marketplace` - Marketplace discovery

## 🔐 Authentication

Authentication is ready for integration with NextAuth.js. Protected routes are set up in the `(protected)` route group.

## 💳 Pricing Tiers

- **Starter**: Free - Basic profile and marketplace access
- **DigitalBOX Standard**: £49/month - Full CRM, invoicing, and basic AI tools
- **DigitalBOX Pro**: £99/month - Advanced AI tools, white-label reports, team accounts

## 🚧 Next Steps

1. Optimize PostgreSQL database schema for enterprise scale
2. Set up Stripe for payment processing
3. Implement NextAuth.js for authentication
4. Connect external APIs (Google Analytics, Google Ads, Meta Ads)
5. Set up MinIO for asset storage
6. Implement AI tool integrations (OpenAI/Gemini)

## 📝 License

Private - All rights reserved

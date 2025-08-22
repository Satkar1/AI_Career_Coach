# AI Career Coach Platform

An enhanced AI-powered career coaching platform that helps professionals accelerate their career growth through personalized assessments, resume optimization, mock interviews, and comprehensive career planning.

## 🚀 Features

### Core Functionality
- **AI Career Assessment** - Comprehensive analysis of skills, interests, and personality
- **Resume Optimization** - AI-powered resume analysis and improvement suggestions
- **Mock Interviews** - Practice interviews with AI-generated questions and feedback
- **Career Path Mapping** - Personalized roadmaps for career transitions
- **Skill Gap Analysis** - Identify and bridge skill gaps for target roles
- **Progress Tracking** - Comprehensive analytics and milestone tracking

### Enhanced User Experience
- **Modern Glassmorphism UI** - Beautiful, modern interface with glass-like effects
- **Dark/Light Theme** - Seamless theme switching with smooth transitions
- **Responsive Design** - Optimized for all devices and screen sizes
- **Smooth Animations** - Enhanced micro-interactions and loading states
- **Real-time Analytics** - Live progress tracking and insights

### AI-Powered Intelligence
- **Google Gemini Integration** - Advanced AI for career analysis and recommendations
- **Personalized Insights** - Tailored advice based on user profile and goals
- **Industry-Specific Guidance** - Specialized recommendations for different sectors
- **Continuous Learning** - AI adapts to user progress and feedback

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with latest features
- **React 19** - Latest React with concurrent features
- **Tailwind CSS** - Utility-first CSS framework with custom design system
- **Shadcn UI** - High-quality, accessible component library
- **Framer Motion** - Smooth animations and transitions
- **React Hook Form** - Performant forms with easy validation
- **TanStack Query** - Powerful data synchronization
- **Zustand** - Simple state management

### Backend
- **Express.js** - Fast, minimalist web framework
- **Drizzle ORM** - TypeScript ORM with excellent developer experience
- **Neon PostgreSQL** - Serverless PostgreSQL database
- **Google Gemini AI** - Advanced AI for career analysis
- **Zod** - TypeScript-first schema validation

### Development Tools
- **TypeScript** - Type-safe development
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Vite** - Fast build tool and dev server

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Neon recommended)
- Google Gemini API key

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ai-career-coach.git
   cd ai-career-coach
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL=your_neon_database_url
   
   # AI Service
   GEMINI_API_KEY=your_gemini_api_key
   
   # Application
   NODE_ENV=development
   PORT=5000
   ```

4. **Database Setup**
   ```bash
   # Push schema to database
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions including:
- Vercel deployment steps
- Environment variable configuration
- Database setup and migrations
- Domain configuration
- Performance optimization

## 📁 Project Structure


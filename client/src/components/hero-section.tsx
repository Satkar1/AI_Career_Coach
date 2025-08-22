import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Zap } from "lucide-react";
import { Link } from "wouter";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Gradient */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Grid Background */}
      <div className="absolute inset-0 grid-background opacity-20" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          {/* Badge */}
          <div 
            className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white mb-8"
            data-testid="hero-badge"
          >
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Career Transformation
          </div>
          
          {/* Main Heading */}
          <h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            data-testid="hero-title"
          >
            Accelerate Your
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent block">
              Career Growth
            </span>
          </h1>
          
          {/* Subtitle */}
          <p 
            className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed"
            data-testid="hero-subtitle"
          >
            Transform your professional journey with AI-powered coaching, personalized guidance, 
            and comprehensive career development tools designed for the modern workforce.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/assessment">
              <Button 
                size="lg"
                className="px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 animate-pulse-glow"
                data-testid="start-assessment-button"
              >
                Start Free Assessment
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button 
              size="lg"
              variant="outline"
              className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 bg-transparent"
              data-testid="watch-demo-button"
            >
              Watch Demo
              <Play className="w-5 h-5 ml-2" />
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center" data-testid="stat-professionals">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-white/70">Professionals Coached</div>
            </div>
            <div className="text-center" data-testid="stat-success-rate">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-white/70">Success Rate</div>
            </div>
            <div className="text-center" data-testid="stat-support">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/70">AI Support</div>
            </div>
            <div className="text-center" data-testid="stat-industries">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">100+</div>
              <div className="text-white/70">Industries</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-6 text-white/70">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}

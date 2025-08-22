import { HeroSection } from "@/components/hero-section";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, FileText, MessageSquare, TrendingUp, Target, Zap,
  CheckCircle, Star, ArrowRight, Users, Award, Clock
} from "lucide-react";
import { Link } from "wouter";

const features = [
  {
    icon: <BarChart3 className="w-8 h-8 text-blue-500" />,
    title: "AI Career Assessment",
    description: "Comprehensive analysis of your skills, interests, and personality to identify optimal career paths and growth opportunities."
  },
  {
    icon: <FileText className="w-8 h-8 text-green-500" />,
    title: "Resume Optimization",
    description: "AI-powered analysis and suggestions to make your resume stand out to recruiters and applicant tracking systems."
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-purple-500" />,
    title: "Mock Interviews",
    description: "Practice with AI-powered mock interviews tailored to your industry and role, with detailed feedback and improvement tips."
  },
  {
    icon: <Zap className="w-8 h-8 text-orange-500" />,
    title: "Skill Gap Analysis",
    description: "Identify skills needed for your target roles and receive personalized learning recommendations to bridge the gaps."
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-pink-500" />,
    title: "Career Path Mapping",
    description: "Visualize multiple career progression paths and receive strategic guidance on steps to achieve your professional goals."
  },
  {
    icon: <Target className="w-8 h-8 text-indigo-500" />,
    title: "Progress Tracking",
    description: "Monitor your career development with comprehensive analytics, goal tracking, and milestone achievements."
  }
];

const testimonials = [
  {
    name: "Michael Chen",
    role: "Senior Software Engineer",
    company: "Google",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    quote: "The AI Career Coach helped me transition from a mid-level developer to a senior role at Google. The personalized interview prep and skill gap analysis were game-changers."
  },
  {
    name: "Sarah Johnson",
    role: "Marketing Director", 
    company: "Microsoft",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face",
    quote: "I loved how the platform provided personalized career paths and helped me pivot from operations to marketing. The AI insights were incredibly accurate."
  },
  {
    name: "David Rodriguez",
    role: "Product Manager",
    company: "Apple", 
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    quote: "The resume optimization and interview practice features were outstanding. I went from 0 to 3 job offers in just 2 months!"
  }
];

const steps = [
  {
    number: "1",
    title: "Complete Assessment",
    description: "Take our comprehensive AI-powered assessment to understand your strengths, interests, and career preferences."
  },
  {
    number: "2", 
    title: "Get Personalized Plan",
    description: "Receive a customized career development plan with specific goals, timelines, and actionable steps."
  },
  {
    number: "3",
    title: "Develop Skills", 
    description: "Access personalized learning resources, practice interviews, and build the skills you need to succeed."
  },
  {
    number: "4",
    title: "Track Progress",
    description: "Monitor your advancement with detailed analytics and celebrate milestones as you achieve your career goals."
  }
];

export default function Home() {
  return (
    <div className="grid-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-background/50 backdrop-blur-sm" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Powerful Features for
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {" "}Career Excellence
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive tools and AI-powered insights to guide your professional journey from assessment to achievement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <GlassCard key={index} hover className="text-center" data-testid={`feature-${index}`}>
                <div className="flex flex-col items-center">
                  <div className="mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground mb-6">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-primary font-semibold">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30" data-testid="stats-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-foreground">50+</h3>
              <p className="text-muted-foreground">Industries Covered</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-foreground">1000+</h3>
              <p className="text-muted-foreground">Interview Questions</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-foreground">95%</h3>
              <p className="text-muted-foreground">Success Rate</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-foreground">24/7</h3>
              <p className="text-muted-foreground">AI Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background/50" data-testid="how-it-works-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Four simple steps to transform your career with AI-powered guidance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center" data-testid={`step-${index}`}>
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">{step.number}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary to-secondary hidden lg:block" 
                         style={{ transform: 'translateX(50%)', width: 'calc(100% - 40px)' }} />
                  )}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">{step.title}</h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real professionals sharing their transformative career journeys with AI Career Coach
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <GlassCard key={index} hover data-testid={`testimonial-${index}`}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <p className="text-sm text-primary">{testimonial.company}</p>
                    </div>
                  </div>
                  <blockquote>
                    <p className="text-muted-foreground italic relative">
                      <span className="text-3xl text-primary absolute -top-4 -left-2">"</span>
                      {testimonial.quote}
                      <span className="text-3xl text-primary absolute -bottom-4">"</span>
                    </p>
                  </blockquote>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" data-testid="cta-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassCard className="hero-gradient text-center p-12">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Join thousands of professionals who have accelerated their career growth with AI-powered guidance. 
              Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/assessment">
                <Button 
                  size="lg"
                  className="px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
                  data-testid="cta-assessment-button"
                >
                  Start Your Free Assessment
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button 
                size="lg"
                variant="outline"
                className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 bg-transparent"
                data-testid="cta-demo-button"
              >
                Schedule a Demo
                <Users className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <p className="text-white/70">No credit card required • Get results in 5 minutes</p>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}

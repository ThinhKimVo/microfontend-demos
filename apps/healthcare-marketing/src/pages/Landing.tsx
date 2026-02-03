import { Link } from 'react-router-dom';
import {
  Heart,
  Shield,
  Clock,
  Video,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  Smartphone,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

// Hero Section
function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-300 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="container-custom section-padding relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900 leading-tight">
              Your Mental Health{' '}
              <span className="gradient-text">Matters</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-secondary-600 max-w-xl mx-auto lg:mx-0">
              Connect with licensed therapists from the comfort of your home. Affordable, confidential, and convenient mental health support.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#download" className="btn-primary">
                <Smartphone className="w-5 h-5 mr-2" />
                Download App
              </a>
              <Link to="/how-it-works" className="btn-secondary">
                Learn More
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-600" />
                <span className="text-sm text-secondary-600">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary-600" />
                <span className="text-sm text-secondary-600">Licensed Therapists</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative">
            <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8">
              <div className="aspect-square bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto bg-primary-600 rounded-full flex items-center justify-center mb-6">
                    <Heart className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary-900">Start Your Journey</h3>
                  <p className="mt-2 text-secondary-600">Connect with a therapist today</p>
                </div>
              </div>
            </div>
            {/* Floating cards */}
            <div className="absolute -left-4 top-1/4 bg-white rounded-xl shadow-lg p-4 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Video className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-secondary-900">Video Sessions</p>
                  <p className="text-xs text-secondary-500">Available 24/7</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 bottom-1/4 bg-white rounded-xl shadow-lg p-4 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-secondary-900">Chat Support</p>
                  <p className="text-xs text-secondary-500">Instant messaging</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Features Section
const features = [
  {
    icon: Shield,
    title: 'Private & Secure',
    description: 'Your conversations are protected with end-to-end encryption. HIPAA compliant platform ensuring your privacy.',
  },
  {
    icon: Clock,
    title: 'Flexible Scheduling',
    description: 'Book sessions that fit your schedule. Morning, evening, or weekends - therapy on your terms.',
  },
  {
    icon: Video,
    title: 'Video & Chat',
    description: 'Connect via HD video calls or text chat. Choose the communication method you\'re most comfortable with.',
  },
  {
    icon: Users,
    title: 'Expert Therapists',
    description: 'All our therapists are licensed professionals with verified credentials and years of experience.',
  },
];

function FeaturesSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900">
            Why Choose <span className="gradient-text">Hopefull</span>
          </h2>
          <p className="mt-4 text-lg text-secondary-600">
            We make mental health support accessible, affordable, and convenient for everyone.
          </p>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} hover className="text-center">
              <div className="w-16 h-16 mx-auto bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                <feature.icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900">{feature.title}</h3>
              <p className="mt-3 text-secondary-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works Section
const steps = [
  {
    number: '01',
    title: 'Register',
    description: 'Create your account in minutes. Tell us about yourself and your therapy goals.',
    icon: Smartphone,
  },
  {
    number: '02',
    title: 'Book',
    description: 'Browse therapists, read profiles, and book a session that fits your schedule.',
    icon: Calendar,
  },
  {
    number: '03',
    title: 'Connect',
    description: 'Start your therapy journey via video call or chat. Get the support you deserve.',
    icon: Video,
  },
];

function HowItWorksSection() {
  return (
    <section className="section-padding bg-secondary-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="mt-4 text-lg text-secondary-600">
            Getting started with Hopefull is simple. Here's how it works.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-full h-0.5 bg-primary-200" />
              )}
              <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-secondary-100">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-5xl font-bold text-primary-200">{step.number}</span>
                  <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900">{step.title}</h3>
                <p className="mt-3 text-secondary-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/how-it-works" className="btn-primary">
            Learn More
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
const testimonials = [
  {
    name: 'Sarah M.',
    role: 'User',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    quote: 'Hopefull changed my life. I was hesitant about online therapy, but my therapist made me feel comfortable from the first session.',
    rating: 5,
  },
  {
    name: 'Dr. James K.',
    role: 'Therapist',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    quote: 'As a therapist, this platform allows me to help more people while maintaining work-life balance. The tools are excellent.',
    rating: 5,
  },
  {
    name: 'Michael T.',
    role: 'User',
    image: 'https://randomuser.me/api/portraits/men/67.jpg',
    quote: 'The flexibility to schedule sessions around my work has been incredible. I finally prioritized my mental health.',
    rating: 5,
  },
  {
    name: 'Emily R.',
    role: 'User',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    quote: 'I love that I can message my therapist between sessions. It helps me feel supported throughout the week.',
    rating: 5,
  },
];

function TestimonialsSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900">
            What People <span className="gradient-text">Say</span>
          </h2>
          <p className="mt-4 text-lg text-secondary-600">
            Hear from our community of users and therapists.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} hover>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-secondary-600 italic">"{testimonial.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-secondary-900">{testimonial.name}</p>
                  <p className="text-sm text-secondary-500">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Stats Section
const stats = [
  { value: '50,000+', label: 'Active Users' },
  { value: '2,000+', label: 'Licensed Therapists' },
  { value: '500,000+', label: 'Sessions Completed' },
  { value: '4.9', label: 'Average Rating' },
];

function StatsSection() {
  return (
    <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-700">
      <div className="container-custom">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-4xl sm:text-5xl font-bold text-white">{stat.value}</p>
              <p className="mt-2 text-primary-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Therapist CTA Section
function TherapistCTASection() {
  return (
    <section className="section-padding bg-secondary-50">
      <div className="container-custom">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900">
                Are You a <span className="gradient-text">Therapist</span>?
              </h2>
              <p className="mt-4 text-lg text-secondary-600">
                Join our network of licensed professionals and help people from anywhere. Enjoy flexible hours, competitive earnings, and a supportive platform.
              </p>
              <ul className="mt-6 space-y-3">
                {['Set your own schedule', 'Earn competitive rates', 'Secure platform', 'Full admin support'].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-600" />
                    <span className="text-secondary-700">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link to="/for-therapists" className="btn-primary">
                  Join as Therapist
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-8 lg:p-12 flex items-center justify-center">
              <div className="text-center text-white">
                <Users className="w-24 h-24 mx-auto mb-6 opacity-80" />
                <p className="text-2xl font-bold">2,000+ Therapists</p>
                <p className="mt-2 text-primary-100">Already on our platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Download CTA Section
function DownloadCTASection() {
  return (
    <section id="download" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900">
            Start Your Journey <span className="gradient-text">Today</span>
          </h2>
          <p className="mt-4 text-lg text-secondary-600">
            Download the Hopefull app and connect with a licensed therapist. Your mental health journey begins with one step.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
            >
              <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-left">
                <p className="text-xs">Download on the</p>
                <p className="text-lg font-semibold">App Store</p>
              </div>
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
            >
              <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
              <div className="text-left">
                <p className="text-xs">Get it on</p>
                <p className="text-lg font-semibold">Google Play</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main Landing Page Component
export default function Landing() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <StatsSection />
      <TherapistCTASection />
      <DownloadCTASection />
    </>
  );
}

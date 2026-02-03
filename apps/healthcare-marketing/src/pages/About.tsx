import { Link } from 'react-router-dom';
import {
  Heart,
  Target,
  Eye,
  Users,
  Shield,
  Award,
  ArrowRight,
  CheckCircle,
  Linkedin,
  Twitter,
} from 'lucide-react';
import Card from '@/components/ui/Card';

// Hero Section
function AboutHero() {
  return (
    <section className="section-padding bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="container-custom">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900">
            About <span className="gradient-text">Hopefull</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-secondary-600">
            We're on a mission to make mental health support accessible to everyone, everywhere. Our platform connects you with licensed therapists who care.
          </p>
        </div>
      </div>
    </section>
  );
}

// Story Section
function StorySection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900">
              Our <span className="gradient-text">Story</span>
            </h2>
            <div className="mt-6 space-y-4 text-secondary-600">
              <p>
                Hopefull was founded in 2020 during a time when mental health support became more critical than ever. We recognized that traditional therapy wasn't accessible to everyone - whether due to location, cost, or stigma.
              </p>
              <p>
                Our founders, having experienced the transformative power of therapy firsthand, set out to create a platform that would break down barriers to mental health care. We believe everyone deserves access to quality mental health support.
              </p>
              <p>
                Today, we've helped over 50,000 people connect with licensed therapists, completing more than 500,000 therapy sessions. But we're just getting started.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl p-8 aspect-square flex items-center justify-center">
              <div className="text-center">
                <Heart className="w-24 h-24 text-primary-600 mx-auto mb-6" />
                <p className="text-2xl font-bold text-secondary-900">Founded in 2020</p>
                <p className="mt-2 text-secondary-600">San Francisco, CA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Mission, Vision, Values Section
const values = [
  {
    icon: Target,
    title: 'Mission',
    description: 'To make quality mental health care accessible, affordable, and convenient for everyone who needs it.',
  },
  {
    icon: Eye,
    title: 'Vision',
    description: 'A world where seeking mental health support is as normal as seeing a doctor, and everyone has access to the care they need.',
  },
  {
    icon: Heart,
    title: 'Values',
    description: 'Compassion, accessibility, privacy, excellence, and continuous improvement guide everything we do.',
  },
];

function MissionVisionValues() {
  return (
    <section className="section-padding bg-secondary-50">
      <div className="container-custom">
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((item, index) => (
            <Card key={index} className="text-center">
              <div className="w-16 h-16 mx-auto bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                <item.icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900">{item.title}</h3>
              <p className="mt-3 text-secondary-600">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Team Section
const team = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Co-Founder & CEO',
    bio: 'Former clinical psychologist with 15 years of experience. Passionate about democratizing mental health care.',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Michael Roberts',
    role: 'Co-Founder & CTO',
    bio: 'Tech entrepreneur with experience at Google and Meta. Building secure, scalable health platforms.',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Dr. James Wilson',
    role: 'Chief Medical Officer',
    bio: 'Board-certified psychiatrist leading our clinical standards and therapist vetting process.',
    image: 'https://randomuser.me/api/portraits/men/75.jpg',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Emily Martinez',
    role: 'Head of Operations',
    bio: 'Healthcare operations expert ensuring seamless experience for users and therapists alike.',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    linkedin: '#',
    twitter: '#',
  },
];

function TeamSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900">
            Meet Our <span className="gradient-text">Team</span>
          </h2>
          <p className="mt-4 text-lg text-secondary-600">
            Dedicated professionals working to transform mental health care.
          </p>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <Card key={index} hover className="text-center">
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto object-cover"
              />
              <h3 className="mt-4 text-lg font-semibold text-secondary-900">{member.name}</h3>
              <p className="text-primary-600 font-medium">{member.role}</p>
              <p className="mt-3 text-sm text-secondary-600">{member.bio}</p>
              <div className="mt-4 flex justify-center gap-3">
                <a href={member.linkedin} className="text-secondary-400 hover:text-primary-600 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href={member.twitter} className="text-secondary-400 hover:text-primary-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Why Choose Us Section
const reasons = [
  'Licensed and verified therapists only',
  'HIPAA-compliant platform',
  'End-to-end encrypted sessions',
  'Flexible scheduling options',
  'Affordable pricing plans',
  'Dedicated customer support',
];

function WhyChooseUs() {
  return (
    <section className="section-padding bg-secondary-50">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900">
              Why Choose <span className="gradient-text">Hopefull</span>
            </h2>
            <p className="mt-4 text-lg text-secondary-600">
              We're committed to providing the best mental health support experience.
            </p>
            <ul className="mt-8 space-y-4">
              {reasons.map((reason, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-primary-600 flex-shrink-0" />
                  <span className="text-secondary-700">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="text-center">
              <Users className="w-10 h-10 text-primary-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-secondary-900">50K+</p>
              <p className="text-secondary-600">Users</p>
            </Card>
            <Card className="text-center">
              <Award className="w-10 h-10 text-primary-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-secondary-900">2K+</p>
              <p className="text-secondary-600">Therapists</p>
            </Card>
            <Card className="text-center">
              <Heart className="w-10 h-10 text-primary-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-secondary-900">500K+</p>
              <p className="text-secondary-600">Sessions</p>
            </Card>
            <Card className="text-center">
              <Shield className="w-10 h-10 text-primary-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-secondary-900">100%</p>
              <p className="text-secondary-600">Secure</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

// Certifications Section
const certifications = [
  { name: 'HIPAA Compliant', description: 'Healthcare data protection' },
  { name: 'GDPR Compliant', description: 'EU data privacy standards' },
  { name: 'PCI DSS', description: 'Payment card security' },
  { name: 'SOC 2 Type II', description: 'Security & availability' },
];

function CertificationsSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900">
            Certifications & <span className="gradient-text">Compliance</span>
          </h2>
          <p className="mt-4 text-lg text-secondary-600">
            Your security and privacy are our top priorities.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-8">
          {certifications.map((cert, index) => (
            <div key={index} className="flex items-center gap-4 bg-secondary-50 rounded-xl px-6 py-4">
              <Shield className="w-10 h-10 text-primary-600" />
              <div>
                <p className="font-semibold text-secondary-900">{cert.name}</p>
                <p className="text-sm text-secondary-600">{cert.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function AboutCTA() {
  return (
    <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-700">
      <div className="container-custom text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Ready to Start Your Journey?
        </h2>
        <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
          Download the app and connect with a licensed therapist today.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#download" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
            Download App
          </a>
          <Link to="/for-therapists" className="btn-secondary border-white text-white hover:bg-white/10">
            Join as Therapist
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Main About Page Component
export default function About() {
  return (
    <>
      <AboutHero />
      <StorySection />
      <MissionVisionValues />
      <TeamSection />
      <WhyChooseUs />
      <CertificationsSection />
      <AboutCTA />
    </>
  );
}

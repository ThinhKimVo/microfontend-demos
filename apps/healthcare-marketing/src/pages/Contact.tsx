import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';

// Contact Form
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>();

  const onSubmit = (data: ContactFormData) => {
    console.log('Form submitted:', data);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <Card className="bg-white">
      <h2 className="text-2xl font-bold text-secondary-900 mb-6">Send Us a Message</h2>

      {submitted && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-700">Thank you! We'll get back to you within 24 hours.</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          id="name"
          label="Your Name"
          placeholder="John Doe"
          error={errors.name?.message}
          {...register('name', { required: 'Name is required' })}
        />

        <Input
          id="email"
          type="email"
          label="Email Address"
          placeholder="john@example.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-secondary-700 mb-2">
            Subject
          </label>
          <select
            id="subject"
            className="w-full px-4 py-3 rounded-lg border border-secondary-300 bg-white text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            {...register('subject', { required: 'Please select a subject' })}
          >
            <option value="">Select a subject</option>
            <option value="general">General Inquiry</option>
            <option value="support">Technical Support</option>
            <option value="billing">Billing Question</option>
            <option value="therapist">Therapist Application</option>
            <option value="partnership">Partnership Inquiry</option>
            <option value="other">Other</option>
          </select>
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
          )}
        </div>

        <Textarea
          id="message"
          label="Message"
          placeholder="How can we help you?"
          rows={5}
          error={errors.message?.message}
          {...register('message', {
            required: 'Message is required',
            minLength: { value: 10, message: 'Message must be at least 10 characters' },
          })}
        />

        <Button type="submit" className="w-full">
          <Send className="w-5 h-5 mr-2" />
          Send Message
        </Button>
      </form>
    </Card>
  );
}

// Contact Info Section
const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    value: 'support@hopefull.app',
    link: 'mailto:support@hopefull.app',
  },
  {
    icon: Phone,
    title: 'Call Us',
    value: '1-800-HOPEFUL',
    link: 'tel:+18004673385',
  },
  {
    icon: MapPin,
    title: 'Office',
    value: '123 Wellness St, San Francisco, CA 94102',
    link: null,
  },
  {
    icon: Clock,
    title: 'Business Hours',
    value: 'Mon-Fri: 9AM - 6PM PST',
    link: null,
  },
];

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
];

function ContactInfo() {
  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <h2 className="text-2xl font-bold text-secondary-900 mb-6">Contact Information</h2>

        <div className="space-y-6">
          {contactInfo.map((info, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <info.icon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-secondary-900">{info.title}</p>
                {info.link ? (
                  <a href={info.link} className="text-primary-600 hover:underline">
                    {info.value}
                  </a>
                ) : (
                  <p className="text-secondary-600">{info.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div className="mt-8 pt-8 border-t border-secondary-100">
          <p className="font-medium text-secondary-900 mb-4">Follow Us</p>
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                aria-label={social.name}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </Card>

      {/* Map */}
      <Card className="bg-white p-0 overflow-hidden">
        <iframe
          title="Office Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0977769716896!2d-122.41941708468181!3d37.77492997975892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2sSan+Francisco%2C+CA!5e0!3m2!1sen!2sus!4v1234567890"
          width="100%"
          height="250"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Card>
    </div>
  );
}

// Quick FAQ Section
const quickFaqs = [
  {
    question: 'How quickly will I get a response?',
    answer: 'We typically respond to all inquiries within 24 hours during business hours. For urgent matters, please call our support line.',
  },
  {
    question: 'I\'m having technical issues. What should I do?',
    answer: 'First, try restarting the app. If issues persist, email us with your device type and a description of the problem, and we\'ll help resolve it.',
  },
  {
    question: 'How do I become a therapist on Hopefull?',
    answer: 'Visit our For Therapists page and click Apply Now. You\'ll need to provide your license information and credentials.',
  },
  {
    question: 'Can I request a refund?',
    answer: 'Yes, we offer refunds for sessions cancelled at least 24 hours in advance. Contact us for other refund inquiries.',
  },
];

function QuickFAQ() {
  return (
    <section className="section-padding bg-secondary-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion>
            {quickFaqs.map((faq, index) => (
              <AccordionItem key={index} title={faq.question}>
                {faq.answer}
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 text-center">
            <Link to="/faq" className="btn-outline">
              View All FAQs
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main Contact Page Component
export default function Contact() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-secondary-600">
              Have questions? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </section>

      {/* Quick FAQ */}
      <QuickFAQ />
    </>
  );
}

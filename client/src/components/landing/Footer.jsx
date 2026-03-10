import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart
} from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  const footerLinks = {
    platform: {
      title: 'Platform',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'User Types', href: '#user-types' },
        { name: 'Government Schemes', href: '#schemes' },
        { name: 'How It Works', href: '#how-it-works' }
      ]
    },
    support: {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Documentation', href: '/docs' },
        { name: 'Community Forum', href: '/forum' }
      ]
    },
    legal: {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Data Protection', href: '/data-protection' }
      ]
    }
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  PEHM System
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Poverty • Education • Hunger Management
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Empowering communities through technology-driven solutions for social welfare.
                  Connecting government, schools, NGOs, and citizens for effective social change.
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-gray-300">support@pehmsystem.gov.in</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="text-gray-300">+91 1800-XXX-XXXX</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-gray-300">New Delhi, India</span>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([key, section]) => (
              <div key={key}>
                <h4 className="text-lg font-semibold text-white mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-primary transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              <p>
                © 2024 PEHM System. All rights reserved. |
                <span className="inline-flex items-center ml-1">
                  Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> for social impact
                </span>
              </p>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="text-gray-400 hover:text-primary transition-colors duration-200"
                    aria-label={social.name}
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Government Disclaimer */}
        <div className="border-t border-gray-800 py-4">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              This is a government initiative for social welfare management.
              All data is handled in accordance with government privacy and security standards.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
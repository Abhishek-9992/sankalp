import React from 'react';
import { Button } from '../ui/button';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowRight, Heart, Users, MapPin, TrendingUp } from 'lucide-react';

const Hero = ({ onGetStartedClick }) => {
  const { t } = useLanguage();

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 py-20 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          {/* Content */}
          <div className="lg:col-span-6">
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Heart className="h-4 w-4 mr-2" />
                Making a Difference Together
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                <span className="text-primary">Poverty</span>,{' '}
                <span className="text-green-600">Education</span> &{' '}
                <span className="text-orange-600">Hunger</span>
                <br />
                <span className="text-gray-700">Management System</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                {t('landing.heroDescription')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={onGetStartedClick}
                  className="text-lg px-8 py-4 h-auto"
                >
                  {t('landing.getStarted')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4 h-auto"
                >
                  {t('landing.learnMore')}
                </Button>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6 text-center lg:text-left">
                <div>
                  <div className="text-2xl font-bold text-primary">1000+</div>
                  <div className="text-sm text-gray-600">Issues Resolved</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">500+</div>
                  <div className="text-sm text-gray-600">Schools Connected</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">50+</div>
                  <div className="text-sm text-gray-600">NGOs Active</div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="mt-12 lg:mt-0 lg:col-span-6">
            <div className="relative">
              {/* Main Image Placeholder */}
              <div className="relative bg-gradient-to-br from-primary/20 to-green-500/20 rounded-2xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  {/* Feature Cards */}
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Issue Tracking</span>
                    </div>
                    <div className="text-xs text-gray-600">Real-time location-based reporting</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium">Community</span>
                    </div>
                    <div className="text-xs text-gray-600">Connecting all stakeholders</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                      <span className="text-sm font-medium">Analytics</span>
                    </div>
                    <div className="text-xs text-gray-600">Data-driven insights</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      <span className="text-sm font-medium">Impact</span>
                    </div>
                    <div className="text-xs text-gray-600">Measurable social change</div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-primary text-white rounded-full p-3 shadow-lg">
                <Heart className="h-6 w-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-green-500 text-white rounded-full p-3 shadow-lg">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
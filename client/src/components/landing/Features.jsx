import React from 'react';
import { Card, CardContent } from '../ui/card';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  MapPin,
  Activity,
  GraduationCap,
  Users,
  BarChart3,
  Globe
} from 'lucide-react';

const Features = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: MapPin,
      title: t('landing.features.issueReporting.title'),
      description: t('landing.features.issueReporting.description'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Activity,
      title: t('landing.features.realTimeTracking.title'),
      description: t('landing.features.realTimeTracking.description'),
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: GraduationCap,
      title: t('landing.features.schoolManagement.title'),
      description: t('landing.features.schoolManagement.description'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Users,
      title: t('landing.features.ngoCoordination.title'),
      description: t('landing.features.ngoCoordination.description'),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: BarChart3,
      title: t('landing.features.governmentOversight.title'),
      description: t('landing.features.governmentOversight.description'),
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: Globe,
      title: t('landing.features.multiLanguage.title'),
      description: t('landing.features.multiLanguage.description'),
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('landing.features.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive tools and features designed to address social challenges effectively
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`h-6 w-6 ${feature.color}`} />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Integrated Ecosystem
            </h3>
            <p className="text-gray-600 mb-6">
              Our platform creates a seamless connection between all stakeholders in the social welfare ecosystem,
              ensuring transparency, accountability, and measurable impact.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">24/7</div>
                <div className="text-sm text-gray-600">Monitoring</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">Real-time</div>
                <div className="text-sm text-gray-600">Updates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">Multi-lingual</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">AI-powered</div>
                <div className="text-sm text-gray-600">Analytics</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  ExternalLink,
  FileText,
  Users,
  GraduationCap,
  Utensils,
  Home,
  ArrowRight
} from 'lucide-react';

const GovernmentSchemes = () => {
  const { t } = useLanguage();

  // Sample government schemes data
  const schemes = [
    {
      id: 1,
      name: 'Pradhan Mantri Garib Kalyan Yojana',
      category: 'poverty',
      description: 'Comprehensive welfare scheme for the poor and vulnerable sections of society',
      benefits: ['Free food grains', 'Cash transfers', 'Healthcare support'],
      eligibility: 'BPL families',
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 2,
      name: 'Mid Day Meal Scheme',
      category: 'education',
      description: 'Nutritious meals for school children to improve enrollment and nutrition',
      benefits: ['Free meals', 'Improved nutrition', 'Better attendance'],
      eligibility: 'Government school students',
      icon: Utensils,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 3,
      name: 'Sarva Shiksha Abhiyan',
      category: 'education',
      description: 'Universal elementary education program for all children',
      benefits: ['Free education', 'Infrastructure development', 'Teacher training'],
      eligibility: 'Children aged 6-14 years',
      icon: GraduationCap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 4,
      name: 'National Food Security Act',
      category: 'hunger',
      description: 'Legal entitlement to subsidized food grains for eligible households',
      benefits: ['Subsidized food grains', 'Nutritional support', 'Maternity benefits'],
      eligibility: 'Priority and AAY households',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const getCategoryBadge = (category) => {
    const categoryConfig = {
      poverty: { label: 'Poverty', color: 'bg-blue-100 text-blue-800' },
      education: { label: 'Education', color: 'bg-green-100 text-green-800' },
      hunger: { label: 'Hunger', color: 'bg-orange-100 text-orange-800' }
    };

    const config = categoryConfig[category] || categoryConfig.poverty;
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  return (
    <section id="schemes" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('landing.schemes.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t('landing.schemes.subtitle')}
          </p>
          <Button variant="outline" size="lg">
            {t('landing.schemes.viewAll')}
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {schemes.map((scheme) => {
            const IconComponent = scheme.icon;
            return (
              <Card key={scheme.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${scheme.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`h-6 w-6 ${scheme.color}`} />
                    </div>
                    {getCategoryBadge(scheme.category)}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 leading-tight">
                    {scheme.name}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-600 mb-4">
                    {scheme.description}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Benefits:</h4>
                      <ul className="space-y-1">
                        {scheme.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Eligibility:</h4>
                      <p className="text-sm text-gray-600">{scheme.eligibility}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button size="sm" className="flex-1">
                      {t('landing.schemes.learnMore')}
                      <FileText className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      {t('landing.schemes.applyNow')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Information */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                How to Apply for Government Schemes
              </h3>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Our platform simplifies the application process for various government welfare schemes.
                Get step-by-step guidance and track your application status.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                  <span className="font-bold">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Register</h4>
                <p className="text-sm text-gray-600">Create your account and verify your identity</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                  <span className="font-bold">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Apply</h4>
                <p className="text-sm text-gray-600">Fill out the application form with required documents</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                  <span className="font-bold">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Track</h4>
                <p className="text-sm text-gray-600">Monitor your application status and receive updates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GovernmentSchemes;
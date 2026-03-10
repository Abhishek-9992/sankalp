import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  User,
  Shield,
  GraduationCap,
  Heart,
  ArrowRight,
  Check
} from 'lucide-react';

const UserTypes = ({ onRegisterClick }) => {
  const { t } = useLanguage();

  const userTypes = [
    {
      type: 'public',
      icon: User,
      title: t('landing.userTypes.public.title'),
      description: t('landing.userTypes.public.description'),
      features: t('landing.userTypes.public.features'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      type: 'government',
      icon: Shield,
      title: t('landing.userTypes.government.title'),
      description: t('landing.userTypes.government.description'),
      features: t('landing.userTypes.government.features'),
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      featured: true
    },
    {
      type: 'school',
      icon: GraduationCap,
      title: t('landing.userTypes.school.title'),
      description: t('landing.userTypes.school.description'),
      features: t('landing.userTypes.school.features'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      buttonColor: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      type: 'ngo',
      icon: Heart,
      title: t('landing.userTypes.ngo.title'),
      description: t('landing.userTypes.ngo.description'),
      features: t('landing.userTypes.ngo.features'),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      buttonColor: 'bg-orange-600 hover:bg-orange-700'
    }
  ];

  return (
    <section id="user-types" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('landing.userTypes.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose your role and start making a difference in your community
          </p>
        </div>

        {/* User Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {userTypes.map((userType, index) => {
            const IconComponent = userType.icon;
            return (
              <Card
                key={index}
                className={`relative group hover:shadow-xl transition-all duration-300 ${
                  userType.featured ? 'ring-2 ring-green-500 scale-105' : ''
                } ${userType.borderColor}`}
              >
                {userType.featured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white">
                      Recommended
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${userType.bgColor} mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`h-8 w-8 ${userType.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {userType.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-gray-600 text-center mb-6">
                    {userType.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    {userType.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => onRegisterClick(userType.type)}
                    className={`w-full ${userType.buttonColor} text-white group-hover:shadow-lg transition-all duration-300`}
                  >
                    Join as {userType.title}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-green-500/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Not sure which role fits you?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Contact our support team to help you choose the right registration type based on your needs and goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg">
                Contact Support
              </Button>
              <Button size="lg" onClick={() => onRegisterClick()}>
                Start Registration
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserTypes;
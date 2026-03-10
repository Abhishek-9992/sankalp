import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useLanguage } from '../../contexts/LanguageContext';
import { Menu, X, Globe, User, LogIn } from 'lucide-react';

const Header = ({ onLoginClick, onRegisterClick }) => {
  const { t, currentLanguage, changeLanguage, getAvailableLanguages } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLanguageDropdown = () => setIsLanguageDropdownOpen(!isLanguageDropdownOpen);

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setIsLanguageDropdownOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-primary">
                PEHM System
              </h1>
              <p className="text-xs text-muted-foreground">
                Poverty • Education • Hunger Management
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-primary transition-colors">
              {t('landing.features.title')}
            </a>
            <a href="#user-types" className="text-gray-700 hover:text-primary transition-colors">
              {t('landing.userTypes.title')}
            </a>
            <a href="#schemes" className="text-gray-700 hover:text-primary transition-colors">
              {t('landing.schemes.title')}
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguageDropdown}
                className="flex items-center space-x-1"
              >
                <Globe className="h-4 w-4" />
                <span className="uppercase">{currentLanguage}</span>
              </Button>

              {isLanguageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
                  <div className="py-1">
                    {getAvailableLanguages().map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                          currentLanguage === lang.code ? 'bg-gray-50 text-primary' : 'text-gray-700'
                        }`}
                      >
                        {lang.nativeName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button variant="ghost" onClick={onLoginClick} className="flex items-center space-x-1">
              <LogIn className="h-4 w-4" />
              <span>{t('auth.login.signIn')}</span>
            </Button>

            <Button onClick={onRegisterClick} className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{t('auth.register.createAccount')}</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <a
                href="#features"
                className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('landing.features.title')}
              </a>
              <a
                href="#user-types"
                className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('landing.userTypes.title')}
              </a>
              <a
                href="#schemes"
                className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('landing.schemes.title')}
              </a>

              <div className="border-t pt-3 mt-3">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-700 mb-2">Language</p>
                  <div className="space-y-1">
                    {getAvailableLanguages().map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`block w-full text-left px-2 py-1 text-sm rounded ${
                          currentLanguage === lang.code ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {lang.nativeName}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="px-3 py-2 space-y-2">
                  <Button
                    variant="ghost"
                    onClick={() => { onLoginClick(); setIsMenuOpen(false); }}
                    className="w-full justify-start"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    {t('auth.login.signIn')}
                  </Button>
                  <Button
                    onClick={() => { onRegisterClick(); setIsMenuOpen(false); }}
                    className="w-full justify-start"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {t('auth.register.createAccount')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
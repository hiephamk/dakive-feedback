import { useState, useEffect } from 'react';
import { HStack, Select } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    // Load language from localStorage or default to browser language
    const savedLanguage = localStorage.getItem('language') || navigator.language.split('-')[0];
    if (['en', 'fi'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage).then(() => {
        console.log('Language initialized to:', savedLanguage);
      });
    } else {
      // Fallback to English if saved language is not supported
      setCurrentLanguage('en');
      i18n.changeLanguage('en');
    }
  }, [i18n]);

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setCurrentLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    i18n.changeLanguage(newLanguage).then(() => {
      console.log('Language changed to:', newLanguage);
    }).catch((error) => {
      console.error('Error changing language:', error);
    });
  };

  return (
    <HStack spacing={2}>
      <label htmlFor="language" style={{ display: 'none' }}>{t('select_language')}🇬🇧/🇫🇮</label>
      <select
        value={currentLanguage}
        onChange={handleLanguageChange}
        id="language"
        style={{
          backgroundColor: 'white',
          borderColor: '#E2E8F0',
        }}
      >
        <option value="en">🇬🇧 {t('english')}</option>
        <option value="fi">🇫🇮 {t('finnish')}</option>
      </select>
    </HStack>
  );
};

export default LanguageSelector;
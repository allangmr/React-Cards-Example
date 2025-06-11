import React, { useState } from 'react';
import OptionCard from '../OptionCard/OptionCard';
import styles from './OptionCardDemo.module.scss';

interface Option {
  id: string;
  title: string;
  description: string;
  image: string;
  imageType: 'rounded' | 'square' | 'wide';
}

const sampleOptions: Option[] = [
  {
    id: 'lock-digital',
    title: 'Premium Digital Lock',
    description: 'Electronic lock with digital code, fingerprint, and RFID card. Maximum security for your home with advanced technology.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    imageType: 'rounded'
  },
  {
    id: 'lock-biometric',
    title: 'Biometric Scanner',
    description: 'Advanced fingerprint recognition with backup key access. Ultra-fast scanning technology.',
    image: 'https://images.unsplash.com/photo-1609205264511-b80b10bf5382?w=400&h=400&fit=crop',
    imageType: 'rounded'
  },
  {
    id: 'lock-smart',
    title: 'Smart Lock Pro',
    description: 'Wi-Fi enabled smart lock with mobile app control. Remote access and monitoring capabilities.',
    image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=400&fit=crop',
    imageType: 'rounded'
  }
];

const materialOptions: Option[] = [
  {
    id: 'option-steel',
    title: 'Stainless Steel',
    description: 'Corrosion resistant, ideal for outdoors. Durable and modern finish.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop',
    imageType: 'square'
  },
  {
    id: 'option-aluminum',
    title: 'Aluminum Alloy',
    description: 'Lightweight yet strong option. Perfect balance of durability and design.',
    image: 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=400&h=400&fit=crop',
    imageType: 'square'
  },
  {
    id: 'option-bronze',
    title: 'Bronze Finish',
    description: 'Classic elegant appearance with excellent weather resistance.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    imageType: 'square'
  }
];

const securityOptions: Option[] = [
  {
    id: 'security-basic',
    title: 'Basic Security Package',
    description: 'Standard protection with reinforced frame and quality lock system.',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&h=280&fit=crop',
    imageType: 'wide'
  },
  {
    id: 'security-advanced',
    title: 'Advanced Security',
    description: 'Multi-point locking system with anti-drill protection and security certifications.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=280&fit=crop',
    imageType: 'wide'
  }
];

const OptionCardDemo: React.FC = () => {
  // Estado para selección simple (radio) - solo una opción
  const [selectedLock, setSelectedLock] = useState<string>('');
  
  // Estado para selección múltiple (checkbox) - múltiples opciones
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedSecurity, setSelectedSecurity] = useState<string[]>([]);

  // Maneja selección simple (radio buttons)
  const handleLockSelect = (optionId: string) => {
    setSelectedLock(optionId);
  };

  // Maneja selección múltiple (checkboxes)
  const handleOptionSelect = (optionId: string) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId); // Deseleccionar
      } else {
        return [...prev, optionId]; // Seleccionar
      }
    });
  };

  const handleSecuritySelect = (optionId: string) => {
    setSelectedSecurity(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  // Función para limpiar selecciones
  const clearAllSelections = () => {
    setSelectedLock('');
    setSelectedOptions([]);
    setSelectedSecurity([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Door Security Configurator</h1>
        <p className={styles.subtitle}>
          Configure your perfect security door by selecting options below
        </p>
        <button 
          className={styles.clearButton}
          onClick={clearAllSelections}
        >
          Clear All Selections
        </button>
      </div>

      {/* Sección de Cerraduras (Radio - Solo una opción) */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          🔐 Choose Your Lock Type 
          <span className={styles.selectionType}>(Select One)</span>
        </h2>
        <div className={styles.optionsGrid}>
          {sampleOptions.map(option => (
            <OptionCard
              key={option.id}
              option={option}
              isSelected={selectedLock === option.id}
              selectType="radio"
              onSelect={handleLockSelect}
            />
          ))}
        </div>
        <div className={styles.selectionStatus}>
          Selected Lock: <strong>{selectedLock || 'None'}</strong>
        </div>
      </section>

      {/* Sección de Optiones (Checkbox - Múltiples opciones) */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          🏗️ Choose Options 
          <span className={styles.selectionType}>(Multiple Selection)</span>
        </h2>
        <div className={styles.optionsGrid}>
          {materialOptions.map(option => (
            <OptionCard
              key={option.id}
              option={option}
              isSelected={selectedOptions.includes(option.id)}
              selectType="checkbox"
              onSelect={handleOptionSelect}
            />
          ))}
        </div>
        <div className={styles.selectionStatus}>
          Selected Options: <strong>
            {selectedOptions.length > 0 ? selectedOptions.join(', ') : 'None'}
          </strong>
        </div>
      </section>

      {/* Sección de Seguridad (Checkbox - Múltiples opciones) */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          🛡️ Security Features 
          <span className={styles.selectionType}>(Multiple Selection)</span>
        </h2>
        <div className={styles.optionsGrid}>
          {securityOptions.map(option => (
            <OptionCard
              key={option.id}
              option={option}
              isSelected={selectedSecurity.includes(option.id)}
              selectType="checkbox"
              onSelect={handleSecuritySelect}
            />
          ))}
        </div>
        <div className={styles.selectionStatus}>
          Selected Security: <strong>
            {selectedSecurity.length > 0 ? selectedSecurity.join(', ') : 'None'}
          </strong>
        </div>
      </section>

      {/* Resumen de Configuración */}
      <section className={styles.summary}>
        <h2 className={styles.sectionTitle}>📋 Configuration Summary</h2>
        <div className={styles.summaryContent}>
          <div className={styles.summaryItem}>
            <strong>Lock:</strong> {selectedLock || 'Not selected'}
          </div>
          <div className={styles.summaryItem}>
            <strong>Options:</strong> {selectedOptions.length > 0 ? selectedOptions.join(', ') : 'Not selected'}
          </div>
          <div className={styles.summaryItem}>
            <strong>Security:</strong> {selectedSecurity.length > 0 ? selectedSecurity.join(', ') : 'Not selected'}
          </div>
          <div className={styles.summaryItem}>
            <strong>Total Selections:</strong> {1 + selectedOptions.length + selectedSecurity.length} items
          </div>
        </div>
      </section>
    </div>
  );
};

export default OptionCardDemo; 
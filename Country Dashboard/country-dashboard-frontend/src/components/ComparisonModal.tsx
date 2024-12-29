import React, {useEffect} from 'react';
import styles from '../styles/ComparisonModal.module.css';
import Image from 'next/image';
import { Country } from '../types/Country';
import CountryMap from './CountryMap';

interface ComparisonModalProps {
  country: Country;
  country2: Country;
  onClose: () => void;
}

const CountryModal: React.FC<ComparisonModalProps> = ({ country, country2, onClose }) => {

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const CountryDetails: React.FC<{ country: Country }> = ({ country }) => (
    <div 
      className={styles.modalContent} 
      onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
    >
      <button className={styles.closeButton} onClick={onClose}>X</button>
      <h2>{country.name.common}</h2>
      <Image
        src={country.flags.svg}
        alt={`${country.name.common} flag`}
        layout="intrinsic"
        width={300}
        height={200}
        className={styles.flagImage}
      />

      <div className={styles.countryDetailsGrid}>
        <p><strong>Capital:</strong> {country.capital ? country.capital[0] : 'N/A'}</p>
        <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> {country.region}</p>
        <p><strong>Currencies:</strong> {Object.keys(country.currencies || {}).join(', ')}</p>
        <p><strong>Languages:</strong> {Object.values(country.languages || {}).join(', ')}</p>
        <p><strong>Timezones:</strong> {Object.values(country.timezones || {}).join(', ')}</p>
      </div>
      
      <CountryMap country={country} />
    </div>
  );

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <CountryDetails country={country} />
      <CountryDetails country={country2} />
    </div>
  );
};

export default CountryModal;
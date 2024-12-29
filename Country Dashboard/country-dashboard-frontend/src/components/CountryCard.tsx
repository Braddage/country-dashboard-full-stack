import React, { useState, useEffect } from 'react';
import { Country } from '../types/Country';
import Image from 'next/image';
import styles from '../styles/CountryCard.module.css';

interface CountryCardProps {
  country: Country;
  loggedInUser: string;
  setLoggedInUser: (username: string) => void;
  onClick: () => void;
}

const favorite = async (username: string, country: string) => {
  const response = await fetch('http://localhost:5000/favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, country }),
  });

  const data = await response.json();

  if (response.ok) {
    return true;
  } else {
    alert(data.error);
    return false;
  }
};

const unfavorite = async (username: string, country: string) => {
  const response = await fetch('http://localhost:5000/unfavorite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, country }),
  });

  const data = await response.json();

  if (response.ok) {
    return true;
  } else {
    alert(data.error);
    return false;
  }
};

const fetchFavorites = async (username: string): Promise<string[]> => {
  const response = await fetch(`http://localhost:5000/favorites?username=${username}`);
  if (response.ok) {
    const data = await response.json();
    return data.favorites;
  }
  return [];
};

const CountryCard: React.FC<CountryCardProps> = ({ country, loggedInUser, onClick }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const initializeFavoriteState = async () => {
      if (loggedInUser) {
        const userFavorites = await fetchFavorites(loggedInUser);
        setIsFavorited(userFavorites.includes(country.name.common));
      }
    };

    initializeFavoriteState();
  }, [loggedInUser, country.name.common]);

  const handleFavorite = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  
    if (isFavorited) {
      const success = await unfavorite(loggedInUser, country.name.common);
      if (success) {
        setIsFavorited(false);
      }
    } else {
      const success = await favorite(loggedInUser, country.name.common);
      if (success) {
        setIsFavorited(true);
      }
    }
  };

  return (
    <div className={styles.countryCard} onClick={onClick}>
      <div className={styles.flagWrapper}>
        <Image
          src={country.flags.svg}
          alt={`${country.name.common} flag`}
          layout="intrinsic"
          width={300}
          height={200}
          className={styles.flagImage}
        />
      </div>

      <div className={styles.countryDetails}>
        <h2>{country.name.common}</h2>
        <p><strong>Capital:</strong> {country.capital ? country.capital[0] : 'N/A'}</p>
        <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> {country.region}</p>

        {loggedInUser ? (
          <button
            className={`${styles.favoriteButton} ${
              isFavorited ? styles.favorited : ''
            }`}
            onClick={handleFavorite}
          >
            {isFavorited ? '★' : '☆'}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default CountryCard;
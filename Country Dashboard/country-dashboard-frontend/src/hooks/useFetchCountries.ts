import { useState, useEffect } from 'react';
import { Country } from '../types/Country';

const useFetchCountries = () => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchCountries = async () => {
        try {
          const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,population,region,flags,currencies,languages,timezones,latlng');
          console.log('Response:', response);
          if (!response.ok) throw new Error('Error - Cannot fetch countries');
          
          const data: Country[] = await response.json();
          setCountries(data);

        } 
        catch (err) {
          setError((err as Error).message);
        } 
        finally {
          setLoading(false);
        }
      };
  
      fetchCountries();
    }, []);
  
    return { countries, loading, error };
  };
  
  export default useFetchCountries;
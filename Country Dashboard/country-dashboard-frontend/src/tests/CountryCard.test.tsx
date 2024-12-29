import { render, screen, fireEvent } from '@testing-library/react';
import CountryCard from '../components/CountryCard';
import '@testing-library/jest-dom';
import React from 'react';


const testCountry = { 
  name: { common: 'United Kingdom' }, 
  population: 67000000, 
  capital: ['London'], 
  region: 'Europe', 
  flags: {svg: 'https://flagcdn.com/gb.svg'} 
};

test('renders CountryCard component', () => {
  render(<CountryCard country={testCountry} onClick={jest.fn()} />);
  
  expect(screen.getByText('United Kingdom')).toBeInTheDocument();
  expect(screen.getByText(/Europe/)).toBeInTheDocument();
  expect(screen.getByText(/67,000,000/)).toBeInTheDocument();
});

test('calls onClick when the card is clicked', () => {
  const handleClick = jest.fn();
  render(<CountryCard country={testCountry} onClick={handleClick} />);
  
  fireEvent.click(screen.getByText('United Kingdom'));
  expect(handleClick).toHaveBeenCalled();
});
import { render, screen } from '@testing-library/react';
import ComparisonModal from '../components/ComparisonModal';
import '@testing-library/jest-dom';
import React from 'react';


const testCountry1 = { 
  name: { common: 'United Kingdom' }, 
  population: 67000000, 
  capital: ['London'], 
  region: 'Europe', 
  flags: {svg: 'https://flagcdn.com/gb.svg'} 
};

const testCountry2 = { 
  name: { common: 'Barbados' }, 
  population: 287000, 
  capital: ['Bridgetown'], 
  region: 'Americas', 
  flags: {svg: 'https://flagcdn.com/bb.svg'} 
};


test('renders ComparisonModal component with two countries', () => {
  render(<ComparisonModal country={testCountry1} country2={testCountry2} onClose={jest.fn()} />);
  
  expect(screen.getByText('United Kingdom')).toBeInTheDocument();
  expect(screen.getByText('London')).toBeInTheDocument();

  expect(screen.getByText('Barbados')).toBeInTheDocument();
  expect(screen.getByText('Bridgetown')).toBeInTheDocument();

});
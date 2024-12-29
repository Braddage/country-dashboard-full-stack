import { render, screen, fireEvent } from '@testing-library/react';
import CountryModal from '../components/CountryModal';
import '@testing-library/jest-dom';
import React from 'react';


const testCountry = { 
  name: { common: 'United Kingdom' }, 
  population: 67000000, 
  capital: ['London'], 
  region: 'Europe', 
  flags: {svg: 'https://flagcdn.com/gb.svg'} 
};

test('renders CountryModal component with country information', () => {
  render(<CountryModal country={testCountry} onClose={jest.fn()} onCompare={jest.fn()} />);
  
  expect(screen.getByText('United Kingdom')).toBeInTheDocument();
  expect(screen.getByText(/Population/)).toBeInTheDocument();
  expect(screen.getByText('London')).toBeInTheDocument();
});

test('calls onClose when close button is clicked', () => {
  const handleClose = jest.fn();
  render(<CountryModal country={testCountry} onClose={handleClose} onCompare={jest.fn()} />);
  
  fireEvent.click(screen.getByRole('button', { name: /x/i }));
  expect(handleClose).toHaveBeenCalled();
});
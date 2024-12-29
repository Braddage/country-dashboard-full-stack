import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../components/Sidebar';
import '@testing-library/jest-dom';
import React from 'react';

const testRegions = ['Europe', 'Asia'];
const testTimezones = ['UTC+1', 'UTC+2'];

test('renders Sidebar component with filters and search', () => {
  render(
    <Sidebar
      regions={testRegions}
      timezones={testTimezones}
      onFilterRegion={jest.fn()}
      onFilterTimezone={jest.fn()}
      onSortByPopulation={jest.fn()}
      onSearch={jest.fn()}
    />
  );
  
  expect(screen.getByText('Europe')).toBeInTheDocument();
  expect(screen.getByText('Asia')).toBeInTheDocument();
});

test('calls onSearch when search input changes', () => {
  const handleSearch = jest.fn();
  render(
    <Sidebar
      regions={testRegions}
      timezones={testTimezones}
      onFilterRegion={jest.fn()}
      onFilterTimezone={jest.fn()}
      onSortByPopulation={jest.fn()}
      onSearch={handleSearch}
    />
  );
  
  fireEvent.change(screen.getByLabelText('Search by Name or Capital:'), { target: { value: 'United Kingdom' } });
  expect(handleSearch).toHaveBeenCalledWith('United Kingdom');
});
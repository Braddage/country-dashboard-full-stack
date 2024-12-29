import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import LazyLoad from '../components/LazyLoad';

test('renders LazyLoad component with children', async () => {
  render(
    <LazyLoad>
      <div>Lazy Content</div>
    </LazyLoad>
  );

  await waitFor(() => expect(screen.getByText('Lazy Content')).toBeInTheDocument());
});
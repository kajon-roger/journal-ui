import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the journal', () => {
  render(<App />);
  const theJournal = screen.getByTestId("journal");
  expect(theJournal).toBeInTheDocument();
});

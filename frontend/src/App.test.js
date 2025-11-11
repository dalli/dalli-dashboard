import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Inbox heading', () => {
  render(<App />);
  const linkElement = screen.getByText(/Inbox/i);
  expect(linkElement).toBeInTheDocument();
});

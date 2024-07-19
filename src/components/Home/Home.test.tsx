import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from './Home';
import { MemoryRouter } from 'react-router-dom';

describe('Home Component', () => {
  it('renders the texts correctly', () => {
    const { getByText } = render(<MemoryRouter><Home background={{ image: '', link: '', author: '' }} /></MemoryRouter>);
    expect(getByText('home.title')).toBeInTheDocument();
    expect(getByText('home.subtitle')).toBeInTheDocument();
    expect(getByText('home.text')).toBeInTheDocument();
    expect(getByText('home.link')).toBeInTheDocument();
    expect(getByText('home.button')).toBeInTheDocument();
  });
});
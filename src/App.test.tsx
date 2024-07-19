import App from "./App";
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'


describe('App component', () => {
    it('full app rendering/navigating', async () => {
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );
        const user = userEvent.setup()
        expect(screen.getByText('kPaste')).toBeInTheDocument();
        await user.click(screen.getByText('Send a secure message'))
        expect(screen.getByText('What is your content?')).toBeInTheDocument();
    });
});
import { render, fireEvent, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import NewPaste from "./NewPaste";

describe('New paste', () => {
    it('Generate button should be disabled by default and enable when text is written', async () => {
        render(
            <MemoryRouter>
                <NewPaste background={{ image: '', link: '', author: '' }} />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText('paste.button.go'));
        expect(screen.getByText('paste.button.go')).toBeDisabled();
        fireEvent.change(screen.getByTestId('new_paste_textarea'), { target: { value: 'Test message' } });
        expect(screen.getByText('paste.button.go')).toBeEnabled();
    });
});

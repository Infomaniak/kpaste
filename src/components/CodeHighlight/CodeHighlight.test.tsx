import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CodeHighlight from './CodeHighlight';

describe('CodeHighlight Component', () => {
  it('renders the children correctly', () => {
    const { container } = render(<CodeHighlight code={false}>Test Code</CodeHighlight>);
    expect(container.textContent).toBe('Test Code');
  });
});
import '@testing-library/jest-dom';
import { vi } from 'vitest';

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: { image: '', link: '', author: '' } }),
  })
);

// This file extends Jest's expect
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveValue(value: any): R;
      toBeInTheDocument(): R;
    }
  }
}

// This is just for TypeScript, the actual implementation is in jest.setup.js
export {};
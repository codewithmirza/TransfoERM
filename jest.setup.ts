import '@testing-library/jest-dom';

global.crypto = {
  randomUUID: () => Math.random().toString(36).substring(2)
} as Crypto; 
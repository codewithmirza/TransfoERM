module.exports = {
  extends: ['next/core-web-vitals'],
  parserOptions: {
    project: './tsconfig.json',
  },
  settings: {
    next: {
      rootDir: ['./']
    }
  },
  ignorePatterns: ['workers/**/*']
}; 
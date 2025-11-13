# Dependency Migration Guide

## Summary of Changes

This migration updates all deprecated dependencies to their latest versions and migrates from ESLint 8 to ESLint 9 with the new flat config format.

## Key Updates

### Backend

#### ESLint Migration (v8 → v9)
- **eslint**: `^8.55.0` → `^9.17.0`
- **@typescript-eslint/eslint-plugin**: `^6.13.2` → Removed (replaced by `typescript-eslint`)
- **@typescript-eslint/parser**: `^6.13.2` → Removed (replaced by `typescript-eslint`)
- **NEW**: `typescript-eslint`: `^8.18.1`
- **NEW**: `@eslint/js`: `^9.17.0`
- **NEW**: `globals`: `^15.13.0`

#### Other Updates
- **typescript**: `^5.3.3` → `^5.7.2`
- **supertest**: `^6.3.3` → `^7.0.0` (fixes deprecation warning)
- **nodemon**: `^3.0.2` → `^3.1.7`
- **@types/node**: `^20.10.4` → `^22.10.2`
- **ts-jest**: `^29.1.1` → `^29.2.5`

### Frontend

#### ESLint Migration (v8 → v9)
- **eslint**: `^8.55.0` → `^9.17.0`
- **@typescript-eslint/eslint-plugin**: `^6.14.0` → Removed
- **@typescript-eslint/parser**: `^6.14.0` → Removed
- **NEW**: `typescript-eslint`: `^8.18.1`
- **NEW**: `@eslint/js`: `^9.17.0`
- **NEW**: `globals`: `^15.13.0`

#### React & Dependencies
- **react**: `^18.2.0` → `^18.3.1`
- **react-dom**: `^18.2.0` → `^18.3.1`
- **react-router-dom**: `^6.20.1` → `^7.1.1`
- **zustand**: `^4.4.7` → `^5.0.2`
- **axios**: `^1.6.2` → `^1.7.9`
- **socket.io-client**: `^4.7.2` → `^4.8.1`

#### Dev Dependencies
- **typescript**: `^5.2.2` → `^5.7.2`
- **vite**: `^5.0.8` → `^6.0.3`
- **vitest**: `^1.0.4` → `^2.1.8`
- **@vitest/ui**: `^1.0.4` → `^2.1.8`
- **@testing-library/react**: `^14.1.2` → `^16.1.0`
- **@testing-library/jest-dom**: `^6.1.5` → `^6.6.3`
- **jsdom**: `^23.0.1` → `^25.0.1`
- **eslint-plugin-react-hooks**: `^4.6.0` → `^5.0.0`
- **eslint-plugin-react-refresh**: `^0.4.5` → `^0.4.16`

## ESLint 9 Migration

### What Changed

ESLint 9 introduces a new **flat config** format that replaces the old `.eslintrc.*` files with `eslint.config.mjs`.

#### Old Format (`.eslintrc.js`)
```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  // ...
};
```

#### New Format (`eslint.config.mjs`)
```javascript
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  // ...
);
```

### Benefits

1. **Type Safety**: ESM modules with TypeScript support
2. **Simpler Plugin System**: Direct imports instead of string references
3. **Better Performance**: Faster configuration loading
4. **Flatter Structure**: Easier to understand configuration cascading

### Breaking Changes

1. **No more `.eslintrc.*` files** - Must use `eslint.config.mjs` (or `.js`, `.cjs`)
2. **No string-based extends** - Import configs directly as modules
3. **Plugin namespace changes** - `typescript-eslint` replaces separate parser/plugin packages
4. **Glob patterns required** - Must use `files` or `ignores` for file matching

## Installation

### Backend
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Full Project
```bash
# From project root
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
docker-compose build --no-cache
docker-compose up
```

## New Configuration Files

### Backend: `eslint.config.mjs`
- TypeScript-first configuration
- Node.js + Jest globals
- Recommended rules from ESLint and TypeScript-ESLint

### Frontend: `eslint.config.mjs`
- React-specific configuration
- Browser + ES2021 globals
- React Hooks and React Refresh plugins
- JSX support

## Verification

### Check Installations
```bash
# Backend
cd backend
npm list eslint typescript-eslint supertest

# Frontend
cd frontend
npm list eslint typescript-eslint react react-dom
```

### Run Linting
```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

### Run Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## Troubleshooting

### ESLint Not Finding Config
**Issue**: `ESLint couldn't find the config "eslint.config.mjs"`

**Solution**:
- Ensure you're using ESLint 9+: `npm list eslint`
- Config file must be in project root
- File extension must be `.mjs`, `.js`, or `.cjs`

### TypeScript-ESLint Errors
**Issue**: `Cannot find module 'typescript-eslint'`

**Solution**:
```bash
npm install typescript-eslint --save-dev
```

### React Hooks Plugin Errors
**Issue**: Plugin configuration errors

**Solution**: The new `eslint-plugin-react-hooks` v5 has different export format:
```javascript
import reactHooks from 'eslint-plugin-react-hooks';

// Use in config
plugins: {
  'react-hooks': reactHooks,
},
rules: {
  ...reactHooks.configs.recommended.rules,
}
```

### Supertest Type Errors
**Issue**: Type mismatches with supertest v7

**Solution**: Supertest v7 has improved types. Update test code if needed:
```typescript
// Before (v6)
import request from 'supertest';

// After (v7) - same import, better types
import request from 'supertest';
```

## Rollback Instructions

If you need to rollback to the old configuration:

1. **Restore old package.json files** from git:
```bash
git checkout HEAD~1 backend/package.json frontend/package.json
```

2. **Remove new config files**:
```bash
rm backend/eslint.config.mjs frontend/eslint.config.mjs
```

3. **Reinstall dependencies**:
```bash
cd backend && npm install
cd ../frontend && npm install
```

## Additional Resources

- [ESLint Migration Guide](https://eslint.org/docs/latest/use/migrate-to-9.0.0)
- [TypeScript-ESLint v8 Announcement](https://typescript-eslint.io/blog/announcing-typescript-eslint-v8)
- [Supertest v7 Changelog](https://github.com/ladjs/supertest/releases)
- [Vite 6 Migration Guide](https://vitejs.dev/guide/migration.html)

## Next Steps

1. ✅ Install updated dependencies
2. ✅ Verify linting works
3. ✅ Run test suites
4. ✅ Test application locally
5. ✅ Update CI/CD pipelines if needed
6. ✅ Deploy to staging for validation

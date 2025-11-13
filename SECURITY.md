# Security Policy

## Supported Versions

We support the latest version of the Calculation Tree Application with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Vulnerabilities

### Development Dependencies

#### esbuild Vulnerability (GHSA-67mh-4wv8-2f99)

**Status**: ✅ Fixed in latest versions

**Affected**: esbuild <=0.24.2 (used by vite/vitest in development)

**Description**: This vulnerability allows any website to send requests to the development server and read responses.

**Impact**:
- **Development only** - Does NOT affect production builds
- Only impacts local development environment
- Requires attacker to have network access to your dev server

**Mitigation**:
1. Update to vite >=6.2.0 and vitest >=2.2.0 (already done)
2. For additional security during development:
   - Don't expose dev server to public networks
   - Use firewall rules to restrict dev server access
   - Only run dev server on localhost

**Fixed in**:
- vite: 6.2.2+
- vitest: 2.2.0+
- esbuild: 0.24.3+

### Production Security

The production build (`npm run build`) is **NOT affected** by the esbuild vulnerability because:
- esbuild is a dev-time bundler tool
- Production builds are static files
- No development server runs in production
- The vulnerability only exists during `npm run dev`

## Reporting a Vulnerability

If you discover a security vulnerability, please email us at [your-security-email@example.com] with:

1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if any)

**Do not** open a public GitHub issue for security vulnerabilities.

## Security Best Practices

### Development Environment

1. **Never expose dev server publicly**:
   ```bash
   # Good - localhost only (default)
   npm run dev

   # Bad - exposed to network
   vite --host 0.0.0.0
   ```

2. **Keep dependencies updated**:
   ```bash
   npm audit
   npm update
   ```

3. **Use environment variables for secrets**:
   - Never commit `.env` files
   - Use `.env.example` for templates
   - Rotate secrets regularly

### Production Environment

1. **Environment Variables**:
   - Use strong JWT secrets (32+ characters)
   - Change default database passwords
   - Use different secrets per environment

2. **Database Security**:
   - Enable SSL connections
   - Use strong passwords
   - Limit network access
   - Regular backups

3. **API Security**:
   - Rate limiting (implement with express-rate-limit)
   - Input validation (using zod)
   - CORS properly configured
   - Helmet.js for security headers

4. **Authentication**:
   - Use bcrypt with salt rounds >=10 (we use 10)
   - JWT tokens with reasonable expiry
   - HTTPS only in production
   - Secure cookie settings

### Dependency Management

```bash
# Check for vulnerabilities
npm audit

# Update packages (carefully)
npm update

# Check for outdated packages
npm outdated
```

### Docker Security

1. **Don't run as root**:
   ```dockerfile
   USER node
   ```

2. **Multi-stage builds** for smaller attack surface

3. **Scan images**:
   ```bash
   docker scan calculation-tree-backend
   ```

## Security Checklist

Before deploying to production:

- [ ] Change all default passwords
- [ ] Generate strong JWT secret (32+ random characters)
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS restrictively
- [ ] Set secure cookie options
- [ ] Enable database SSL
- [ ] Set up rate limiting
- [ ] Configure CSP headers
- [ ] Enable security headers (helmet.js)
- [ ] Set NODE_ENV=production
- [ ] Remove development dependencies from production
- [ ] Set up monitoring and logging
- [ ] Regular dependency updates
- [ ] Database backups configured

## Known Issues

### Current Status

✅ All known vulnerabilities resolved

Last security audit: 2024-01-01
Last dependency update: 2024-01-01

### Historical Issues

None reported.

## Updates

### 2024-01-01 - Dependency Security Update
- Updated vite to 6.2.2+ (fixes esbuild vulnerability)
- Updated vitest to 2.2.0+ (fixes esbuild vulnerability)
- All development dependencies updated to latest secure versions

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [React Security Best Practices](https://react.dev/learn/security)

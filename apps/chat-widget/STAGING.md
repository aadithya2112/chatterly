# Chat Widget Staging Environment

This staging environment is automatically deployed when code is pushed to the `staging` branch.

## Staging URLs
- **Staging Widget**: https://aadithya2112.github.io/chatterly-staging/
- **Backend**: Use your local backend at `http://localhost:4000` for testing

## Testing the Staging Widget

1. Start your local backend:
   ```bash
   cd apps/backend && bun run dev
   ```

2. Test the staging widget at: https://aadithya2112.github.io/chatterly-staging/

## Deployment Process

1. Make changes on your feature branch (`move/ws-to-http`)
2. Test locally first
3. Merge to `staging` branch for staging deployment
4. Test staging environment
5. Merge to `main` for production deployment

## Manual Staging Deployment

To manually deploy to staging:
```bash
# Switch to staging branch
git checkout staging

# Merge your changes
git merge move/ws-to-http

# Push to trigger deployment
git push origin staging
```

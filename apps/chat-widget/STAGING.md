# Chat Widget Staging Environment

This staging environment is automatically deployed when code is pushed to the `staging` branch.

## Staging URLs

- **Staging Widget**: https://aadithya2112.github.io/chatterly/staging/ (will be available after setup)
- **Backend**: Deploy your backend to a staging environment (Heroku, Railway, etc.)

## Setting Up GitHub Pages for Staging

After pushing to the `staging` branch, you need to enable GitHub Pages for the `gh-pages-staging` branch:

1. Go to your GitHub repository: https://github.com/aadithya2112/chatterly
2. Click on **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, you'll see multiple deployments:
   - Main production: `gh-pages` branch
   - Staging: `gh-pages-staging` branch
5. GitHub will provide separate URLs for each

## Alternative: Create Separate Repository

For a cleaner separation, create a new repository:

1. Create new repo: `chatterly-staging`
2. Enable GitHub Pages on that repo
3. Your staging URL will be: `https://aadithya2112.github.io/chatterly-staging/`

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

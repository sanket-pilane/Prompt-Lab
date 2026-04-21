# Contributing to Prompt To JSON

## Branch Strategy

Use:
- `main` for production-ready releases.
- `develop` for integration work.
- `feature/<short-name>` for new features.
- `fix/<short-name>` for bug fixes.
- `chore/<short-name>` for tooling, docs, and maintenance.
- `release/<version>` for release preparation.
- `hotfix/<short-name>` for urgent production fixes.

## Feature Workflow

1. Checkout develop: `git checkout develop`
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes and run standard checks:
   - `npm run lint`
   - `npm run build`
4. Commit: `git commit -m "feat: your feature description"`
5. Push: `git push -u origin feature/your-feature`
6. Open a Pull Request against `develop`.

Before merging, ensure CI passes and there are no secrets committed.

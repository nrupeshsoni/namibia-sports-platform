# CONTRIBUTING.md — Namibia Sports Platform

## How to Contribute

### Reporting Bugs
- Use the GitHub issue template
- Include: steps to reproduce, expected vs actual behavior, environment (browser, OS)
- Check existing issues first

### Requesting Features
- Open an issue with `[Feature]` prefix
- Describe the use case and benefit
- Link to SOUL.md if it aligns with project identity

### Git Workflow

1. **Fork** the repository
2. **Create a branch:** `feat/short-description` or `fix/short-description`
3. **Commit** using Conventional Commits: `feat: add X`, `fix: resolve Y`
4. **Push** to your fork
5. **Open a Pull Request** against `main`

### PR Requirements

- [ ] Description of changes
- [ ] Tests updated/added where applicable
- [ ] `npm run check` passes
- [ ] `npm run build` passes
- [ ] No secrets or credentials in code

### Production Impact Checklist (for production-related changes)

- [ ] Does this change affect database schemas? → Update `docs/02_database_schema.md` and migrations
- [ ] Does this change affect API contracts? → Update `docs/03_api_and_integrations.md`
- [ ] Does this introduce new external dependencies? → Document in `docs/05_dependency_graph.md`
- [ ] Update `SCALE_CONSIDERATIONS.md` if scale assumptions change
- [ ] Satisfy `.cursor/rules/production-readiness.mdc` rules

### Code Review

- Maintainers will review within 5 business days
- Address feedback before merge
- Squash commits if requested

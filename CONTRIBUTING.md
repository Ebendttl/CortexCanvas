# Contributing to CortexCanvas

Thank you for your interest in contributing to CortexCanvas! As a community-driven project, we value your expertise and passion. To ensure a smooth collaboration, please follow these guidelines.

---

## 🏗️ Development Workflow

### 1. Setup Your Environment
Ensure you have the following installed:
- **Node.js 18+**
- **npm / pnpm**
- **Docker** (optional, for localized services)

Follow the [Installation steps in the README](README.md#installation) to get started.

### 2. Branching Strategy
We use a feature-branch workflow:
- `main` is the stable production branch.
- `develop` is for active integration.
- Feature branches should be named `feature/description` or `fix/issue-id`.

### 3. Coding Standards
- **Linting**: Run `npm run lint` before committing.
- **Formatting**: We use Prettier. Ensure your editor supports `.editorconfig` and `.prettierrc`.
- **TypeScript**: All new code must be strictly typed. Avoid `any` at all costs.
- **Components**: Follow the Atomic Design or Feature-based pattern used in `src/features`.

---

## 🧪 Testing Guidelines

- **Unit Tests**: Place tests alongside the code (`component.test.ts`).
- **Integration Tests**: Focus on critical paths like document saving and AI streaming.
- **Quality**: We aim for 80%+ coverage on core logic.

---

## 📤 Submitting a Pull Request

1. **Self-Review**: Go through your changes. Are there any debug logs or commented-out code?
2. **Update Documentation**: If you've added a feature, update the relevant docs.
3. **Draft the PR**: Use the [Pull Request Template](.github/pull_request_template.md).
4. **Approval**: At least one maintainer must review and approve before merging.

---

## 💬 Communication

- **Issues**: Use GitHub Issues for bugs and feature requests.
- **Discussions**: Use GitHub Discussions for RFCs and general ideas.

Thank you for making CortexCanvas better! 🚀

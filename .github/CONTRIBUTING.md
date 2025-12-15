# Contributing to ng-tailwindcss

First off, thank you for considering contributing to ng-tailwindcss! 🎉

This document provides guidelines and steps for contributing. Following these guidelines helps communicate that you respect the time of the developers managing and developing this open source project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Component Guidelines](#component-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the maintainers.

## Getting Started

### Types of Contributions

There are many ways to contribute:

- 🐛 **Bug Reports**: Found a bug? Open an issue!
- ✨ **Feature Requests**: Have an idea? We'd love to hear it!
- 📝 **Documentation**: Help improve our docs
- 💻 **Code**: Submit a PR for bugs or features
- 🎨 **Design**: Suggest UI/UX improvements
- 🧪 **Testing**: Help us improve test coverage

### Before You Start

1. Check if an issue already exists for your bug/feature
2. For major changes, open an issue first to discuss
3. Fork the repository
4. Create a feature branch

## Development Setup

### Prerequisites

- Node.js 20.x or higher
- pnpm 9.x or higher
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ng-tailwindcss.git
cd ng-tailwindcss

# Install dependencies
pnpm install

# Build the library
pnpm run build

# Start the docs dev server
cd docs
pnpm install
pnpm start
```

### Project Structure

```
ng-tailwindcss/
├── projects/ng-tailwindcss/     # Library source code
│   └── src/lib/
│       ├── core/                # Configuration & services
│       ├── directives/          # Utility directives
│       ├── button/              # Button component
│       ├── card/                # Card component
│       └── ...                  # Other components
├── docs/                        # Documentation site
│   └── src/app/
│       └── pages/               # Demo pages
├── .github/                     # GitHub templates & workflows
└── dist/                        # Build output
```

## Making Changes

### Branch Naming

Use descriptive branch names:

- `feat/component-name` - New features
- `fix/issue-description` - Bug fixes
- `docs/what-changed` - Documentation
- `refactor/what-changed` - Refactoring
- `test/what-changed` - Test updates

### Code Style

- Use TypeScript strict mode
- Follow Angular style guide
- Use Tailwind CSS utility classes
- Keep components standalone
- Ensure accessibility (ARIA attributes, keyboard navigation)

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `build`: Build system or external dependencies
- `ci`: CI configuration files
- `chore`: Other changes that don't modify src or test files

### Examples

```
feat(button): add loading state with spinner

fix(modal): prevent body scroll when open

docs: update installation instructions

refactor(input): simplify class merging logic
```

## Pull Request Process

1. **Update your fork** with the latest from main
2. **Create a feature branch** from main
3. **Make your changes** following our guidelines
4. **Write/update tests** if applicable
5. **Update documentation** if needed
6. **Run tests** locally: `pnpm test`
7. **Build the library**: `pnpm run build`
8. **Push your branch** and open a PR
9. **Fill out the PR template** completely
10. **Request review** from maintainers

### PR Requirements

- [ ] Tests pass
- [ ] Build succeeds
- [ ] No new lint warnings
- [ ] Documentation updated (if needed)
- [ ] PR description is complete
- [ ] Commits follow conventions

## Component Guidelines

When creating or modifying components:

### Structure

```typescript
// component-name.component.ts
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'tw-component-name',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './component-name.component.html',
})
export class TwComponentNameComponent {
  // Inputs with defaults
  @Input() variant: ComponentVariant = 'default';

  // Allow style overrides
  @Input() classOverride = '';
  @Input() classReplace = '';
}
```

### Naming Conventions

- Component selector: `tw-component-name`
- Component class: `TwComponentNameComponent`
- Directive selector: `twDirectiveName`
- Directive class: `TwDirectiveNameDirective`

### Required Features

- [ ] All inputs documented with JSDoc
- [ ] Default values for inputs
- [ ] `classOverride` for merging custom classes
- [ ] `classReplace` for complete style replacement
- [ ] OnPush change detection
- [ ] Accessibility (ARIA, keyboard nav)
- [ ] Standalone component

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Watch mode
pnpm test -- --watch
```

### Writing Tests

- Test component inputs and outputs
- Test accessibility features
- Test keyboard navigation
- Test edge cases

## Documentation

### Updating Docs

1. Navigate to `docs/src/app/pages/components/`
2. Update or create demo component
3. Add examples showing all features
4. Include code snippets

### Documentation Style

- Clear, concise descriptions
- Working code examples
- Show all variants/options
- Include accessibility notes

## Questions?

- Open a [Discussion](https://github.com/PegasusHeavyIndustries/ng-tailwindcss/discussions)
- Check existing [Issues](https://github.com/PegasusHeavyIndustries/ng-tailwindcss/issues)

Thank you for contributing! 🙏


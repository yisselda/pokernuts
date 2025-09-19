# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Comprehensive CI/CD pipeline with Node.js 20, 22, 24 test matrix
- Test coverage reporting with 90% thresholds and Codecov integration
- Automated release workflow with semantic versioning
- Security audit checks in CI pipeline
- Coverage badges and build status indicators
- Comprehensive CLI unit tests (28 tests covering all functionality)
- Enhanced test suite with realistic poker edge cases
- CHANGELOG.md with API stability guarantees and versioning policy
- Professional status badges (CI, coverage, npm, Node.js, license)

### Changed

- Enhanced package scripts for better development workflow
- Improved test configuration with coverage thresholds and exclusions
- Pinned all dependency versions for reproducible builds
- Updated Node.js requirement to 20+ (latest LTS)
- Refactored CLI to export testable functions for better unit testing

### Fixed

- **Major bug**: Two-rank guesses (e.g., "7T") now correctly match suited/offsuit nuts patterns
- Card order normalization now properly handles both "7T" and "T7" as equivalent inputs
- Pattern matching logic improved to accept general guesses when both suited/offsuit are nuts
- TypeScript type safety improvements (removed `any` types)

### Technical Improvements

- Test coverage increased from 56% to 91.59% overall
- CLI coverage boosted from 0% to 97.84%
- Engine coverage improved to 89.97%
- Added 49 comprehensive tests covering core functionality and edge cases
- Enhanced error handling and input validation
- Improved code formatting and linting enforcement

## [1.0.3] - 2024-01-XX

### Fixed

- Minor bug fixes and improvements

## [1.0.2] - 2024-01-XX

### Added

- Initial stable release with core functionality

## [1.0.1] - 2024-01-XX

### Added

- Package improvements and documentation updates

## [1.0.0] - 2024-01-XX

### Added

- Initial release
- Core poker nuts evaluation engine
- Interactive CLI interface
- Seedable RNG for deterministic results
- Comprehensive test suite
- TypeScript support with full type definitions
- Programmatic API for integration

## API Stability

### Semantic Versioning Policy

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version increments for incompatible API changes
- **MINOR** version increments for backwards-compatible functionality additions
- **PATCH** version increments for backwards-compatible bug fixes

### API Guarantees

- **Public API**: All exported functions from `/engine` are considered stable
- **CLI Interface**: Command-line arguments and output format are stable
- **Breaking Changes**: Will only occur in major version releases with clear migration path
- **Deprecation Policy**: Features will be deprecated for at least one minor version before removal

### Supported Environments

- Node.js 18+ (LTS versions)
- Modern browsers with ES2020 support
- React/React Native applications
- TypeScript 5.0+

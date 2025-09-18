# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Comprehensive CI/CD pipeline with Node.js 18, 20, 22 test matrix
- Test coverage reporting with 90% thresholds
- Automated release workflow
- Security audit checks in CI
- Coverage badges and build status indicators

### Changed

- Enhanced package scripts for better development workflow
- Improved test configuration with coverage thresholds

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

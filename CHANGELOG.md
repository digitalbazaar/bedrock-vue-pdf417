# bedrock-vue-pdf417 ChangeLog

## 9.1.0 - 2024-07-29

### Added
- Add property `hideUploadButton` to hide camera's upload image button.

## 9.0.1 - 2024-07-17

### Fixed
- Update component name typo in template.

## 9.0.0 - 2024-03-14

### Changed
- Update lint tooling and fix lint issues.
- **BREAKING**: Update dependencies.
  - `@bedrock/quasar@10`.

## 8.1.1 - 2023-06-27

### Fixed
- Fix `getDLInfo` API call.

## 8.1.0 - 2023-06-15

### Added
- Add property `raw` to `dlInfo` to send raw barcode data.

### Changed
- Update development and testing dependencies.

### Fixed
- Fix config so karma tests can be run.

## 8.0.0 - 2023-01-23

### Changed
- **BREAKING**: Update `@bedrock/quasar` peer dep to v9.0.

## 7.0.0 - 2022-12-21

### Changed
- **BREAKING**: Update barcode reader to version 9.6.1.

## 6.0.1 - 2022-06-09

### Fixed
- Use `beforeUnmount` instead of `beforeDestroy` for vue 3.

## 6.0.0 - 2022-05-31

### Changed
- **BREAKING**: Update peer deps:
  - `vue@3`
  - `@bedrock/quasar@8`.

### Removed
- Remove unused peer dependencies.

## 5.2.1 - 2022-04-15

### Fixed
- Fix bug preventing loader from showing when scanning via upload.

## 5.2.0 - 2022-04-13

### Changed
- Update deblurLevel for uploaded image scanning.

## 5.1.0 - 2022-04-12

### Changed
- Update deblurLevel to improve scanning.

## 5.0.0 - 2022-04-10

### Changed
- **BREAKING**: Rename package to `@bedrock/vue-pdf417`.
- **BREAKING**: Convert to module (ESM).

## 4.0.2 - 2022-03-31

### Fixed
- Fix issue with tip text being offset on mobile.

## 4.0.1 - 2022-03-30

### Fixed
- Fix issue with camera errors; handle them within the
  `BarcodeScanner` component.

## 4.0.0 - 2022-03-30

### Changed
- **BREAKING**: Upgrade `BarcodeScanner` to v9.

## 3.0.0 - 2022-03-15

### Removed
- **BREAKING**: Removed old `Scanner` class from library. Now, only
  `BarcodeScanner` is supported.

## 2.2.1 - 2022-03-09

### Fixed
- Fix invalid 2.2.0 release.

## 2.2.0 - 2022-03-09

### Changed
- Update buttons to be disable while loading camera or scanning.

### Fixed
- Fix bug with camera error.

## 2.1.0 - 2022-03-09

### Changed
- Update BarcodeScanner to now accept a licenceServer.
- Add error message if camera fails to load.

## 2.0.1 - 2022-03-04

### Fixed
- Fix bug with license and spinner.

## 2.0.0 - 2022-03-04

### Added
- **BREAKING**: Add new BarcodeScanner.
- Add slots for Scanner.

## 1.2.0 - 2021-12-06

### Added
- Add optional button prop.

## 1.1.0 - 2021-08-02

### Added
- Add ability to specify button color for Scanner.

## 1.0.0 - 2021-04-01

- See git history for changes.

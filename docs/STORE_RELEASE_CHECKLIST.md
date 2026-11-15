# Store release checklist

## Build locally through Expo Application Services (EAS)

1. Install Node.js LTS, then run `npm install`.
2. Copy `.env.example` to `.env` and set `ANDROID_PACKAGE` and `IOS_BUNDLE_IDENTIFIER` to identifiers you own (for example `com.yourcompany.zenixbox`). These are app identifiers, not passwords. Do not use the example fallback `com.zenixbox.app` if it is already registered by another publisher.
3. Create/sign in to an Expo account, then run `npx eas-cli@latest build:configure`. Set `EAS_PROJECT_ID` in your local `.env` if EAS assigns a project ID. The project ID and signing credentials are intentionally not committed.
4. For Android Play Store: `npx eas-cli@latest build --platform android --profile production`. EAS prompts you to create or provide Android signing credentials. The production output is an Android App Bundle (`.aab`).
5. For iOS App Store Connect: run the production iOS build command on macOS or with EAS: `npx eas-cli@latest build --platform ios --profile production`. EAS prompts for Apple account/team and distribution signing credentials. An Apple Developer Program membership is required for App Store distribution.
6. Test release builds on real devices, then submit through Play Console/App Store Connect. Automated submission credentials are intentionally blank; set up each store's service account/API key securely in EAS before using `eas submit`.

Example build environment setup (do not commit `.env`):

```sh
cp .env.example .env
npx eas-cli@latest build:configure
npx eas-cli@latest build --platform android --profile production
npx eas-cli@latest build --platform ios --profile production
```

## Before publishing

- Replace the generic package and bundle identifiers with IDs controlled by you; IDs become difficult to change after release.
- Provide final app icon, screenshots, store descriptions, support contact, and a publicly accessible privacy policy URL.
- Complete Google Play Data safety, content rating, target API, photo/video permission declarations if applicable, and tester/review requirements. Complete App Store privacy details, export compliance, age rating, and review information.
- Review current Google Play and Apple submission requirements; they can change independently of this source. SDK 52 may need upgrading to a currently supported Expo SDK before submission.
- Confirm permission prompts and media picker behavior on current Android and iOS devices.
- Keep signing keys, service account JSON files, App Store Connect keys, and all AI provider keys out of Git and out of client-side app configuration.

## Product functionality status

This repository includes a multi-screen mobile UI and gallery selection. AI tools currently provide a simulated preview only; they do not enhance or export media. Projects are kept in app memory and disappear when the app is closed. Do not publish claims of real AI processing, persistent project storage, or export until those capabilities and their privacy disclosures are implemented and tested. A production AI product requires a secured backend, real processing provider, error handling, deletion/retention policy, and appropriate user consent.

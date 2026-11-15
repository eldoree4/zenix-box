# App Store Submission Checklist

## Required before publishing

1. Make sure you have an active Apple Developer Program membership.
2. Replace placeholder bundle identifier with a unique domain-based identifier you own.
3. Prepare app icon, screenshots, privacy policy, support URL, and App Review contact.
4. Add final App Store metadata in App Store Connect.
5. Complete age rating, privacy details, compliance, and export declarations.
6. Run the iOS production build using EAS or Xcode and sign it with the correct provisioning profile.
7. Submit to App Review.

## Suggested values

- `IOS_BUNDLE_IDENTIFIER=com.example.zenixbox`
- `EAS_PROJECT_ID=<your project id>`

## Notes

- Keep signing credentials and certificates outside Git.
- Ensure permission prompts and media library access are phrased in a clear, user-friendly way.
- Final App Store review can add extra requirements unrelated to this source repo; verify Apple guidelines at the time of release.

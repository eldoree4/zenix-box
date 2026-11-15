# Google Play Submission Checklist

## Required before publishing

1. Replace placeholder package identifier values in `.env` with identifiers owned by your organization.
2. Create or link a Google Play Console account and set up the app.
3. Prepare app icon, feature graphic, screenshots, privacy policy, and support email.
4. Complete Play Console Data Safety, content rating, and target audience declarations.
5. Validate permissions to ensure the app is only requesting needed media access.
6. Build the Android App Bundle using EAS or Android Studio.
7. Upload the `.aab` file and submit for review.

## Suggested values

- `ANDROID_PACKAGE=com.example.zenixbox`
- `EAS_PROJECT_ID=<your project id>`

## Notes

- Never commit service account JSON or signing keys to Git.
- Use Google Play App Signing or a secure key management flow.
- Review the final app manifest for any additional permissions or data handling changes before release.

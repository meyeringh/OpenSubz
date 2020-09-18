# Subz

Subscription and contract management app for Android based on Ionic.

## Features

The app is quite minimal but offers the most important features.

### Functional

- Add subscriptions and details like costs, billing interval, conract durations and cancelation period
- Show all subscriptions and their costs
- Show days until next billing
- Switch subscription cost overview to daily, weekly, monthly and yearly
- Modify and delete subscriptions
- Search for specific subscriptions
- Sort subscriptions by name, costs, etc.
- Optional reminder for reaching cancelation period of subscriptions (tbd)

### Settings

- Dark-mode
- Global currency selection
- Local backup and restore

### Others

- Localization (English, German so far)

## Building

```
git pull https://codeberg.org/epinez/Subz.git
npm i
ionic capacitor build android
```

Then open the Android Studio project under `android/`, run build and enjoy!

## Contributing

Feel free to help me improving Subz in any possible way!
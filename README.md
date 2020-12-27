# Subz

Subscription and contract management app for Android based on Ionic.

<p align="center">
  <a href="https://epinez.codeberg.page/projects/subz/index.html"><img src="https://codeberg.org/epinez/pages/raw/branch/main/try_on_codeberg_pages.png" alt="Try it on Codeberg Pages" height="75"></a>
  <a href="https://f-droid.org/packages/com.flasskamp.subz"><img src="https://fdroid.gitlab.io/artwork/badge/get-it-on.png" alt="Get it on F-Droid" height="75"></a>
</p>

<p align="center">
  <img src="./fastlane/metadata/android/en-US/images/phoneScreenshots/1.png" width="24%"/>
  <img src="./fastlane/metadata/android/en-US/images/phoneScreenshots/2.png" width="24%"/>
  <img src="./fastlane/metadata/android/en-US/images/phoneScreenshots/3.png" width="24%"/>
  <img src="./fastlane/metadata/android/en-US/images/phoneScreenshots/4.png" width="24%"/>
</p>

## Features

The app is quite minimal but offers the most important features.

### Functional

- Add subscriptions and details like costs, billing interval, contract durations and cancelation period
- Show all subscriptions and their costs
- Show days until next billing
- Switch subscription cost overview to daily, weekly, monthly and yearly
- Modify and delete subscriptions
- Search for specific subscriptions
- Sort subscriptions by name, costs, etc.
- Optional reminder for reaching cancelation period of subscriptions

### Settings

- Dark-mode
- Global currency selection
- Local backup and restore

### Others

- Localization (English, German so far)

## Building

### Prerequisites

- Node: Install the packages `nodejs` and `npm` or get it from: https://nodejs.org
- Git: Install the `git` package or get it from: https://git-scm.com/download
- Ionic: `[sudo] npm install -g @ionic/cli`
- Android Studio / SDK: Get it from: https://developer.android.com/studio

### Build the app

```
git clone https://codeberg.org/epinez/Subz.git
cd Subz
npm i
ionic capacitor build android --prod
```

If Android Studio did not start by itself, start it manually and open the project under `android/` and run a build. You could also run it in a browser with `ionic serve`. Enjoy!

## Contributing

Feel free to help me improving Subz in any possible way!
# Subz

Subscription and contract management app for Android based on Ionic and Angular. Written in TypeScript.

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

Feel free to help me improving Subz in any possible way! These are some examples of how you could help:

- **File an issue**: Did you notice a bug while using Subz or do you have some ideas of how we could enhance it? [File an issue](https://codeberg.org/epinez/Subz/issues) and I will notice it!
- **Tell others about Subz**: I wanted to create something which not only helps me but also others. Everybody knows the struggle of forgetting to cancel a contract in time. I want that to be a problem of the past, so please help me to help others and tell them about Subz!
- **Translate**: Subz is not localized in your language? You are welcome to add it! Currently I haven't setup any localization service; instead the language files have to be edited or created manually. There is one JSON-file for each language. You can see the available languages [here](https://codeberg.org/epinez/Subz/src/branch/main/src/assets/i18n). Feel free to create a pull request for any new language/updates or if you are not familiar with that you could also file an issue with the JSON content and your language code mentioned. If the JSON file isn't complete, please delete any non translated strings, they will be defaulted to english during runtime.
- **Start coding**: Are you familiar with Typescript, HTML, SCSS, Angular or Ionic? You are more than welcome to contribute to the code! Please file issues first and reference to them in the commit like `Fixes bad behaviour xy, closes #1`. Of course you could also update the documentary, etc.
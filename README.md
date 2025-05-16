# OpenSubz

Subscription and contract management app for Android based on Ionic and Angular. Written in TypeScript.

<a href="https://hosted.weblate.org/engage/OpenSubz/">
  <img src="https://hosted.weblate.org/widgets/OpenSubz/-/OpenSubz/svg-badge.svg" alt="Übersetzungsstatus" />
</a>

<p align="center">
  <a href="https://epinez.codeberg.page/projects/OpenSubz/index.html"><img src="https://codeberg.org/epinez/pages/raw/branch/main/try_on_codeberg_pages.png" alt="Try it on Codeberg Pages" height="75"></a>
  <a href="https://f-droid.org/packages/com.flasskamp.OpenSubz"><img src="https://fdroid.gitlab.io/artwork/badge/get-it-on.png" alt="Get it on F-Droid" height="75"></a>
</p>

<p align="center">
  <img src="./fastlane/metadata/android/en-US/images/phoneScreenshots/1.png" width="24%"/>
  <img src="./fastlane/metadata/android/en-US/images/phoneScreenshots/2.png" width="24%"/>
  <img src="./fastlane/metadata/android/en-US/images/phoneScreenshots/3.png" width="24%"/>
  <img src="./fastlane/metadata/android/en-US/images/phoneScreenshots/4.png" width="24%"/>
</p>

## Features

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

- UI: Force Dark-mode
- Region: Currency, date format
- Data management: Local backup and restore

## Building

### Prerequisites

- Node: Install the packages `nodejs` and `npm` or get it from: https://nodejs.org
- Git: Install the `git` package or get it from: https://git-scm.com/download
- Ionic: `[sudo] npm install -g @ionic/cli`
- Android Studio / SDK: Get it from: https://developer.android.com/studio

### Build the app

```
git clone https://codeberg.org/epinez/OpenSubz.git
cd OpenSubz
npm i
ionic build --prod
npx cap sync
npx cap open android
```

Now you can run a build within Android Studio. You could also run it in a browser with `ionic serve`. Enjoy!

## Contributing

Feel free to help me improving OpenSubz in any possible way! These are some examples of how you could help:

- **File an issue**: Did you notice a bug while using OpenSubz or do you have some ideas of how we could enhance it? [File an issue](https://codeberg.org/epinez/OpenSubz/issues) and I will notice it!
- **Tell others about OpenSubz**: I wanted to create something which not only helps me but also others. Everybody knows the struggle of forgetting to cancel a contract in time. I want that to be a problem of the past, so please help me to help others and tell them about OpenSubz!
- **Translate**: OpenSubz is not (fully) localized in your language? You are welcome to help. Localization is handled on [Weblate](https://hosted.weblate.org/projects/OpenSubz/OpenSubz).
- **Start coding**: Are you familiar with Typescript, HTML, SCSS, Angular and or Ionic? Nice! Please file issues first and reference to them in the commit like `Fixes bad behaviour xy, closes #1`. If you want to contribute new features please wait for my response because I want to keep the app as clean and straightforward as possible. :-)

## Donate

If you want to support the development by a donation, you are very welcome to do so. That would allow me to invest more time into the development as I'm a student and working on OpenSubz in my free time.

<a href="https://liberapay.com/epinez/donate">
  <img alt="Donate using Liberapay" src="https://liberapay.com/assets/widgets/donate.svg">
</a>

You can also contact me via [E-Mail](mailto:OpenSubz@flasskamp.com).

## Thanks to

- [mondstern](https://codeberg.org/mondstern) for his beautiful acrylic painting of the OpenSubz logo
- All translators which helped localizing OpenSubz via Weblate. I don't mention each one specifically because that's so much work :-)
- All donators!
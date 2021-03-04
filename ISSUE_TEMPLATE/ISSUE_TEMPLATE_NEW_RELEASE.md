---

name: "New release template"
about: "This template is only for preparing new releases."

---

# Prepare release for vX.X.X

- [ ] All pending issues for this release milestone are resolved (except this one)
- [ ] Fastlane changelogs for at least english are provided
- [ ] (Optional) Update fastlane screenshots
- [ ] (Optional) Update Readme
- [ ] Updated version in `package.json` and `android/app/build.gradle` (versionCode + versionName)
- [ ] Create a tagged release for *main* like `vX.X.X`
- [ ] Build Subz locally
- [ ] Update https://epinez.codeberg.page/

## F-Droid

- [ ] Merge source code + built web artifacts in *fdroid* branch
- [ ] Searched for closed source components, removed if found
- [ ] Create a tagged release for *fdroid* like `vX.X.X-fdroid`
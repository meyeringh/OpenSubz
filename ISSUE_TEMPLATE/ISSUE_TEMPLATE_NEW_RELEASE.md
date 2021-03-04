---

name: "New release template"
about: "This template is only for preparing new releases."

---

# Prepare release for vX.X.X

- [ ] All pending issues for this release milestone are resolved (except this one)
- [ ] Fastlane changelogs for at least english are provided
- [ ] Create a tagged release for *main* like `vX.X.X`
- [ ] Build Subz
- [ ] Update https://epinez.codeberg.page/

## Optional

- [ ] Update fastlane screenshots
- [ ] Update Readme

## F-Droid

- [ ] Merge source code + build in *fdroid* branch
- [ ] Searched for closed source components, removed if found
- [ ] Create a tagged release for *fdroid* like `vX.X.X-fdroid`

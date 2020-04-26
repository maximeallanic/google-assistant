# Google Assistant for Mac

<img src="image/capture.gif" style="box-shadow: 0 0 20px 2px rgb(0, 0, 0, 0.5); margin: 40px"/>

[Download latest version for Mac](https://github.com/maximeallanic/google-assistant/releases/latest/download/Google-Assistant.dmg)

## Functionnality
- All google assistant's locals are available
- Answers use your mac location
- Use Cmd+U to launch it and you can change it on parameters
- Start at login automatically
- Dark/Light Theme

## Development

Google Assistant for Mac is based on Electron
And is build with Electron Builder.

You'll need an OAuth Credential from the [Google Developer Console](https://console.developers.google.com):
- Create a new project in the Google Developer Console
- Enable the Google Assistant API for that project
- Generate an OAuth credential
    - Select the application type of `Other UI`
    - State that you will be using `User Data`
    - Download the JSON file
    - Rename the file to `google_oauth.json`
    - Place it in your project at `google_oauth.json`

To start development:
- Install npm dependency: `npm install --mpg123-backend=openal`
- Start Electron package: `electron .`

## Thanks

- [endoplasmic](https://github.com/endoplasmic/google-assistant) for SDK Google Assistant
- [Willmer Barahona](https://codepen.io/wbarahona/pen/Lyvedy) for Google Assistant animation
- [AnimeJS](https://animejs.com/) for animation
- [Electron](https://www.electronjs.org/)

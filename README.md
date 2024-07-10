# NgBase

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.

## I18N

### Localization

Run the following command to generate (en) localization file:

```
ng extract-i18n --output-path src/locale
```

This generates the `src/locale/messages.xlf` file for transaltion.

Then translate and create the `src/locale/messages.fr.xlf` file, either manually or with dedicated translation tools like [localazy](https://localazy.com/).

More information on angular internalization and localization [here](https://angular.dev/guide/i18n).

### Test locally

Run `ng build --localize` to build the project. The build artifacts will be stored in the `dist/` directory:
* `dist/ng-base/en`
* `dist/ng-base/fr`

Then copy `/src/environments/404.html` to `dist/ng-base` directory with:
```
cp src/environments/404.html dist/ng-base
```

Run local `http-server` with:
```
cd dist/ng-base
http-server -p 8080
```

[http-server](https://www.npmjs.com/package/http-server) is an nodejs http server.

## Deploy

Deploy on githup pages with [angular-cli-ghpages](https://www.npmjs.com/package/angular-cli-ghpages)

## Firebase

### Action link

Edit %LINK% for email templates. Replace

```
https://ng-base-2b40d.firebaseapp.com/__/auth/action
```

with dev link:

```
http://localhost:4200/action
```

## Style

### Theme Palettes

Ng-base defines the [Material Design 3 palette](https://m3.material.io/styles/color/system/overview) for a **light** and **dark** theme. A palette defines 6 sets of colors (primary, secondary, terciary, neutral, neutral-variant and error), each set containing 16 colors (26 for neutral), hence a total of 106 colors! However Angular CLI provides a tool to generate a palette from one to four 'seed' colors:

```
ng generate @angular/material:m3-theme
```

Check the default [light](./src/app/themes/light_m3-theme.scss) and [dark](./src/app/themes/dark_m3-theme.scss) themes.

Tier tool like [themes.angular-material.dev](https://themes.angular-material.dev/) may be used to visualize the material components from seed colors.

### Icons

The 'outline' font set is used by default. Remove line:

```ts
{ provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-icons-outlined' } }
```

from [app.config.ts](./src/app/app.config.ts) file to use the default plain font set.

## Resources

### Technical Docs

* [Angular](https://angular.dev/)
* [Material Angular](https://material.angular.io/)
* [Firebase](https://firebase.google.com/?authuser=0)
* [Angularfire](https://github.com/angular/angularfire/blob/3639e41b52c0b2963c1e24734ff8401f4d21107e/docs/firestore.md)
* [Material icons](https://fonts.google.com/icons?icon.size=24&icon.color=%23e8eaed)

### Typewriter effect

The login typewriter effect is inspired by this [source](https://css-tricks.com/snippets/css/typewriter-effect/).

### Images

The login [image](https://www.cleanpng.com/png-color-splash-art-clip-art-colour-splash-1165562/) is from [www.cleanpng.com](https://www.cleanpng.com/).

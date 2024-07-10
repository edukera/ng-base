# NgBase

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.

## Build

Run `ng build --localize` to build the project. The build artifacts will be stored in the `dist/` directory:
* `dist/ng-base/en`
* `dist/ng-base/fr`

Then copy `/src/environments/404.html` to `dist/ng-base` directory with:
```
cd src/environments/404.html dist/ng-base
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

### Icons

The 'outline' font set is used by default. Remove line:

```ts
{ provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-icons-outlined' } }
```

from [app.config.ts](./src/app/app.config.ts) file to use the default plain font set.
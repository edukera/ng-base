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

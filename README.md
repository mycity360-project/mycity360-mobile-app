# mycity360-mobile-app

### Project Folder Structure

```
/
├── android						Android Native code
├── ios							iOS Native Code
├── shared
│   ├── redux					Applications Logic
│   │   ├── constants
│   │   ├── actions
│   │   ├── api
│   │   ├── reducers
│   │   ├── store
│   │   └── thunk
│   └── utilities
│   ├── services
│   │   ├── core				Core Services - API (fetch/axios), storage
│   │   │  ├── API
│   │   │  └── Storage
│   │   ├── home
│   │   └── search
├── src
│   ├── config					Global Configuration
│   ├── constants				Screen names and ids, Localization
│   ├── navigators				Router, Navigation
│   ├── view					UI compoments
│   │   ├── elements				Custom elements
│   │   ├── assets
│   │   ├── screens
│   │   ├── styles				Typography
│   │   └── widgets				Custom components
│   └── utilities
├── __tests__					Unit Tests
│   ├── presentation
│   └── redux
├── .babelrc
├── .gitignore
├── .travis.yml					Travis CI
├── tsconfig.json				TypeScript Configuration
├── tslint.js					TSLint configuration - extending AirBnb
├── tsconfig.json
├── app.json
├── index.js					Application Entry point
├── package.json
└── README.md
```

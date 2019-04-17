// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,


  //added this so we can interact with firebase
  firebase: {
    apiKey: "AIzaSyAJEdJ4jjbDdeCsWDlWJZ0ZRVBZfOJplMA",
    authDomain: "ducks-110db.firebaseapp.com",
    databaseURL: "https://ducks-110db.firebaseio.com",
    projectId: "ducks-110db",
    storageBucket: "ducks-110db.appspot.com",
    messagingSenderId: "821238658885"
  }

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
 * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
 *
 * Learn more in https://angular.io/guide/browser-support
 */

/***************************************************************************************************
 * BROWSER POLYFILLS
 */

/**
 * IE11 requires the following for NgClass support on SVG elements
 */
// import 'classlist.js';  // Run `npm install --save classlist.js`.

/**
 * Web Animations `@angular/animations`
 * Only required if AnimationBuilder is used within the application and using IE/Edge or Safari.
 * Standard animation support in Angular DOES NOT require any polyfills (as of Angular 6.0).
 */
// import 'web-animations-js';  // Run `npm install --save web-animations-js`.

/**
 * By default, zone.js will patch all possible macroTask and DomEvents
 * user can disable parts of macroTask/DomEvents patch by setting following flags
 * because those flags need to be set before `zone.js` being loaded, and webpack
 * will put import in the top of bundle, so user need to create a separate file
 * in this directory (for example: zone-flags.ts), and put the following flags
 * into that file, and then add the following code before importing zone.js.
 * import './zone-flags';
 *
 * The flags allowed in zone-flags.ts are listed here.
 *
 * The following flags will disable zone.js for all browsers.
 */

// (window as any).__Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
// (window as any).__Zone_disable_on_property = true; // disable patch onProperty such as onclick
// (window as any).__Zone_disable_geolocation = true; // disable patch geolocation

/**
 * Zone JS is required by default for Angular itself.
 */
import 'zone.js';  // Included with Angular CLI.

/***************************************************************************************************
 * APPLICATION IMPORTS
 */

/**
 * Date, currency, decimal and percent pipes.
 * Needed for: All but Chrome, Firefox, Edge, IE11 and Safari 10
 */
// import 'intl';  // Run `npm install --save intl`.
/**
 * Need to import at least one locale-data with intl.
 */
// import 'intl/locale-data/jsonp/en';

/**
 * Polyfill for Object.assign() for IE11
 */
if (typeof Object.assign !== 'function') {
  Object.assign = function(target: any, ...sources: any[]) {
    if (target === null || target === undefined) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    const to = Object(target);

    for (let index = 0; index < sources.length; index++) {
      const nextSource = sources[index];

      if (nextSource !== null && nextSource !== undefined) {
        for (const nextKey in nextSource) {
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}

/**
 * Polyfill for Array.from() for IE11
 */
if (!Array.from) {
  Array.from = function<T, U>(
    arrayLike: ArrayLike<T>,
    mapfn?: (v: T, k: number) => U,
    thisArg?: any
  ): U[] {
    const C = this;
    const items = Object(arrayLike);
    if (arrayLike == null) {
      throw new TypeError('Array.from requires an array-like object - not null or undefined');
    }
    const mapFn = mapfn === undefined ? undefined : mapfn;
    let T: any;
    if (typeof mapFn !== 'undefined') {
      if (typeof mapFn !== 'function') {
        throw new TypeError('Array.from: when provided, the second argument must be a function');
      }
      if (arguments.length > 2) {
        T = thisArg;
      }
    }
    const len = parseInt(items.length);
    const A = typeof C === 'function' ? Object(new C(len)) : new Array(len);
    let k = 0;
    let kValue;
    while (k < len) {
      kValue = items[k];
      if (mapFn) {
        A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
      } else {
        A[k] = kValue;
      }
      k += 1;
    }
    A.length = len;
    return A;
  };
}

/**
 * Polyfill for String.includes() for IE11
 */
if (!String.prototype.includes) {
  String.prototype.includes = function(search: string, start?: number): boolean {
    if (typeof start !== 'number') {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

/**
 * Polyfill for Promise (if needed for older browsers)
 */
// import 'es6-promise/auto';

/**
 * Fetch polyfill for older browsers
 */
// import 'whatwg-fetch';

/**
 * Intersection Observer polyfill for better compatibility
 */
// import 'intersection-observer';

/**
 * ResizeObserver polyfill
 */
// import 'resize-observer-polyfill';

/**
 * Smoothscroll polyfill for Safari and IE
 */
// import 'smoothscroll-polyfill';

/**
 * Custom Element polyfills
 */
// import '@webcomponents/custom-elements';

/**
 * Global error handlers
 */
(window as any).global = window;

// Extend Window interface for custom properties
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

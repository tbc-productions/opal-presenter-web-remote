Changes in OpenLP Web Remote
============================

Version 1.2.11
--------------

* Fix issue with broken overlay image in main view since upgrade to Angular v22.
* Fix issue with chord and stage view not updating since upgrade to Angular v22. 

Version 1.2.10
--------------

* Updated dependencies including Angular.

Version 1.2.9
-------------

* Fix for missing Angular icons.

Version 1.2.8
-------------

* Keep Angular icons locally installed.
* Updated dependencies including Angular.

Version 1.2.7
-------------

* Updated dependencies including Angular.

Version 1.2.6
-------------

* Updated dependencies including Angular.
* Fix for not found fonts since the upgrade to Angular 20.
* Fix for locked out browser versions since the upgrade to Angular 20.

Version 1.2.5
-------------

* Updated dependencies including Angular.
* Add default route displaying "page could not be found" error.

Version 1.2.4
-------------

* Updated dependencies including Angular.
* Make input field for search text optional to prevent an invalid form when using the search all button.

Version 1.2.3
-------------

* Updated dependencies including Angular.

Version 1.2.2
-------------

* Prevent browser console error during start by making the setting to prevent display sleep and enable wake lock in all Android and iOS web browsers non-persistent.

Version 1.2.1
-------------

* Fix for missing icons since the upgrade to Angular 19.

Version 1.2.0
-------------

* Add setting to prevent display sleep and enable wake lock in all Android and iOS web browsers.
* Add search all button.
* Updated dependencies including Angular.

Version 1.1.1
-------------

* Prevent that the delete service item button is blocking the service item title.
* Updated dependencies including Angular.

Version 1.1.0
-------------

* Add a delete button for service items when version 2.6 or newer of the Web API is being used.
* Display a message when login is required.
* Updated dependencies including Angular.

Version 1.0.0
-------------

* New OpenLP light and dark theme based on Angular Material v3.
* Made image in slides responsive.
* Updated dependencies including Angular.

Version 0.9.22
--------------

* Use unique keys in template for loops.
* Updated dependencies including Angular.

Version 0.9.21
--------------

* Force capitalization in translations when version 3.1.2 or newer is installed.
* Updated zone.js.

Version 0.9.20
--------------

* Force capitalization in translations when version 3.1.2 or newer is installed.
* Updated dependencies including Angular.

Version 0.9.19
--------------

* Hook Web Remote up to Transifex regarding the translations.
* Add some missing translations.
* Make sure that the English translation will function in Web Remote when version 3.1.2 or newer is installed.
* The page title is not capitalized anymore.
* Prevent a TypeError in the browser console when Settings is displayed and there are no live items.
* Updated dependencies including Angular.

Version 0.9.18
--------------

* Prevent HTTP 404 error in browser console when using Web API 2.4 or older.
* Remove Hammerjs.

Version 0.9.17
--------------

* Add workaround for missing default English translation file when using Web API 2.4 or older.
* Correct Slovenian translation.

Version 0.9.16
--------------

* Make use of the configured language in OpenLP in order to use translations in Web Remote when version 3.1.2 or newer is installed.
* Updated dependencies including Angular.

Version 0.9.15
--------------

* Added a Web Remote setting to switch larger display buttons on or off (off by default).
* Updated dependencies including Angular.

Version 0.9.14
--------------

* Make sure that all the clients auto scroll to the selected slide.
* Make use of the configured shortcuts in OpenLP when version 3.1.2 or newer is installed.
* Updated dependencies including Angular.

Version 0.9.13
--------------

* Change detection of unsupported browser version.
* Display the instructions how to downgrade to a previous version when the browser is not supported.

Version 0.9.12
--------------

* Display a download link for previous releases instead of crashing when the browser is not supported.
* Minor update of Angular.

Version 0.9.11
--------------

* Updated dependencies including Angular.

Version 0.9.10
--------------

* Add a login button.
* Add lower thirds / green screen view.
* Use auto scroll when moving to next or previous slide.
* Add a "No items" placeholder on Slides and Service.
* Implement some small optimizations.
* Let the menu preserve it's position when opened.
* Make sure tooltips are visible in Stage View.
* Display the next service item in Stage View and Chord View.
* Remove package "Protractor".

Version 0.9.9
-------------

* Create a Settings page and service
* Move Fast Switching to Settings page
* Add CSS, Component support, and a Setting to allow Stage and Chords font scaling
* Fix API version check
* Add a workaround for a bug in new chord transposition endpoint in OpenLP 3.0.2 (API version 2.2)
* Using the new response_format=service_item on Transpose API Endpoint while preserving old behavior
* Add keyboard shortcuts (AKA hot keys) for most actions
* Fix presentation image width

Version 0.9.8
-------------

* Fix media and images on Chord and Stage views
* Refactoring individual slides of Chord and Stage views
* Update dependencies
* Refactor the ChordPro routines and the Chord and Stage views
* Fix the new sticky navbar overlapping Stage, Chord and Main views
* Make top bar sticky so that it is easier to access the menu
* Add WebSocket reconnection routines
* Add WebSocket UI indicator
* Upgrade to the latest Material icons
* Use the new transpose API endpoint
* Maintain the version number in assets/version.js

Version 0.9.7
-------------

* Refactor some internal components
* Fix theme icon in side-bar and footer
* Add thumbnails to Stage and Slides views
* Add Material icons and Roboto font for local resources (closes #19)
* Update some styling

Version 0.9.6
-------------

* Lint fix
* Make stage views use the 12 hour time setting
* Fix API calls for new search option API
* Remove theme name and column controllers
* Make themes into a fixed sized and the column responsive
* Update Angular

Version 0.9.5
-------------

* Store last selected search plugin and retrieve it after loading.
* Change a method signature
* Themes thumbnails
* Added retrieval and set of search options for the Bibles plugin, allowing to change the Bible version from the remote
* Use a ServiceItem object rather than just slides to transfer more information at one time
* Add notes to stage view
* Fix a CORS issue

Version 0.9.4
-------------

* Fix chord view
* Update the State Management code
* Block requesting invalid Service items from UI

Version 0.9.3
-------------

No official release


Version 0.9.2
-------------

* Resolve: "Cut off bottom of slides"
* Make live use correct websocket
* Remove the hash from the URLs. I'm not sure why it was added.
* Allow searching other plugins besides songs

Version 0.9.1
-------------

Initial development release:

- Re-implemented in Angular
- Uses web sockets instead of polling
- Material design
- Includes stage views

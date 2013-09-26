'use strict';

angular.module('mage')
  .factory('IconService', ['$injector', 'appConstants',
    function($injector, appConstants) {
      var ***REMOVED*** = {};
      var iconService = $injector.get(appConstants.iconService);

      ***REMOVED***.defaultLeafletIcon = function() {
        return iconService.defaultLeafletIcon();
      };

      ***REMOVED***.leafletIcon = function(feature, o) {
        return iconService.leafletIcon(feature, o);
      }

      ***REMOVED***.icon = function(feature, o) {
        return iconService.icon(feature, o);
      };

      ***REMOVED***.iconHtml = function(feature, o) {
        return iconService.iconHtml(feature, o);
      };

      return ***REMOVED***;
    }
  ]);
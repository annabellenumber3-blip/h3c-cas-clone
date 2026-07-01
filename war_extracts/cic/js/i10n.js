//配置国际化
routeApp.config(['$translateProvider', function($translateProvider){

	/*  // Register a loader for the static files
	  // So, the module will search missing translation tables under the specified urls.
	  // Those urls are [prefix][langKey][suffix].
	  $translateProvider.useStaticFilesLoader({
	    prefix: 'l10n/',
	    suffix: '.json'
	  });*/

	    $translateProvider.translations('cn', resource);
	    $translateProvider.translations('cn', unis_resource);
		     // register another one
		$translateProvider.translations('en', resource);
		$translateProvider.translations('en', unis_resource);
	  // Tell the module what language to use by default
	  $translateProvider.preferredLanguage('cn');
}])

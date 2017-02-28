var app = angular.module('atria', [
	'ionic',
	'ngMessages',
	'ngCordova',
	'ngAnimate',
	'angularMoment',
	'angular-svg-round-progress',
	'parse-angular',
	'parse-angular.enhance',
  'jett.ionic.filter.bar',
	'atria.controllers.authentication',
  'atria.controllers.explore',
	'atria.controllers.campaign',
	'atria.controllers.profile',
	'atria.controllers.edit',
	'atria.controllers.intro',
	'atria.services.authentication',
	'atria.services.campaigns',
	'atria.filters.mealtime'
]);

app.run(function ($ionicPlatform, $cordovaSplashscreen) {
	$ionicPlatform.ready(function () {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleBlackTranslucent();
		}
	});

	// Initialise Parse
	Parse.initialize("lEIo9vLScriw1zVAHwhV0h0X6AmuVlEv9oY6tucS", "42bb6gynXmzAc32drwcApqY1A03cTCIJ8oOLSZ1I");

  setTimeout(function () {
    $cordovaSplashscreen.hide()
  }, 3010);
});

app.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
	$stateProvider
    .state('start', {
      url: '/start',
      cache: false,
      controller: 'StartCtrl',
      templateUrl: 'templates/start.html'
    })
		.state('login', {
			url: "/login",
			cache: false,
			controller: 'LoginCtrl',
			templateUrl: "templates/login.html"
		})
		.state('signup', {
			url: "/signup",
			cache: false,
			controller: 'SignupCtrl',
			templateUrl: "templates/signup.html"
		})
		.state ('intro', {
			url:"/intro",
			cache: false,
			controller: 'IntroCtrl',
			templateUrl: "templates/intro.html"
		})
		.state('tab', {
			url: "/tab",
			abstract: true,
			templateUrl: "templates/tabs.html"
		})
		.state('tab.explore', {
			url: '/explore',
      cache: false,
			views: {
				'tab-explore': {
					templateUrl: 'templates/tabs/tab-explore.html',
					controller: 'ExploreCtrl'
				}
			}
		})
    .state('tab.joinCampaign', {
      url: '/joinCampaign',
      cache: false,
      views: {
        'tab-explore': {
          templateUrl: 'templates/tabs/tab-joinCampaign.html',
          controller: 'CampaignCtrl'
        }
      }
    })
		.state('tab.track', {
			url: '/track',
      cache: false,
			views: {
				'tab-track': {
					templateUrl: 'templates/tabs/tab-track.html',
					controller: 'MealCreateCtrl'
				}
			}
		})
		.state('tab.profile', {
			url: '/profile',
      cache: false,
			views: {
				'tab-profile': {
					templateUrl: 'templates/tabs/tab-profile.html',
					controller: 'ProfileCtrl'
				}
			}
		})
		.state('tab.edit', {
			url: '/edit',
      cache: false,
			views: {
				'tab-profile': {
					templateUrl: 'templates/tabs/tab-edit.html',
					controller: 'ProfileCtrl'
				}
			}
		})

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/start');

  $ionicConfigProvider.tabs.position('top');
});

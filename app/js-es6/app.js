;(() => {
	let log = console.log;
	angular.module('app', ['ngMaterial','ngResource','ui.router', 'ngMessages', ])
	.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/registration');

		$stateProvider
		.state('registration', {
			url: '/registration',
			templateUrl: 'partial-registration.html'
		})
		.state('login', {
			url: '/login',
			templateUrl: 'partial-login.html'
		})
		.state('profile', {
			url: '/profile',
			templateUrl: 'partial-profile.html'
		});


	}])
	.controller('AppCtrl', ['$scope', '$timeout', '$mdSidenav', '$log', 'contryREST',function($scope, $timeout, $mdSidenav, $log,contryREST) {
		$scope.title = 'Hey';
		$scope.project = {
			description: '',
			special: true
		};
		$scope.toggleLeft = buildDelayedToggler('left');
		function debounce(func, wait, context) {
			var timer;

			return function debounced() {
				var context = $scope,
				args = Array.prototype.slice.call(arguments);
				$timeout.cancel(timer);
				timer = $timeout(function() {
					timer = undefined;
					func.apply(context, args);
				}, wait || 10);
			};
		}

		function buildDelayedToggler(navID) {
			return debounce(function() {
				$mdSidenav(navID)
				.toggle()
				.then(function () {
					$log.debug("toggle " + navID + " is done");
				});
			}, 200);
		}

		function buildToggler(navID) {
			return function() {
				$mdSidenav(navID)
				.toggle()
				.then(function () {
					$log.debug("toggle " + navID + " is done");
				});
			};
		}
	}])
	.controller('LeftCtrl', ['$scope', '$timeout', '$mdSidenav', '$log',function ($scope, $timeout, $mdSidenav, $log) {
		$scope.close = () => {
			$mdSidenav('left').close()
			.then(() => {
				$log.debug("close LEFT is done");
			});

		};
	}])
	.controller('RegistrationForm',['$scope',function( $scope ){
		log( this );
	}])
	.factory('contryREST',[
		'$resource',
		$resource => $resource('https://restcountries.eu/rest/v2/:type/:country',{
			type: '@type',
			country: '@country',
			fields: '@fields'
		})
	])
	.controller('CtrlCountryCity',['$timeout', '$q', '$log','contryREST' , function( $timeout, $q, $log,contryREST ) {
		this.querySearch = (query,country) => {
			let
				type = query?'name':'all',
				fields = country?'name':'capital',
				deferred = $q.defer();
			contryREST.query({
				type,
				country: query.toLowerCase(),
				fields
			}, result => {
				log(result);
				deferred.resolve( result );
			}, error => {
				log( 'error',error );
			});
			return deferred.promise;
		}
		this.selectedItemChange = text => {
			$log.info('Text changed to ' + text);
		}
		this.searchTextChange = item => {
			$log.info('Item changed to ' + JSON.stringify(item));
		}

	}]);
})();
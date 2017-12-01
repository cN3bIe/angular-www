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
	.factory('contryREST',[
		'$resource',
		$resource => $resource('https://restcountries.eu/rest/v2/:type/:country',{
			type: '@type',
			country: '@country',
			fields: 'name'
		})
	])
	.controller('CountryCtrl',['$timeout', '$q', '$log','contryREST' , function( $timeout, $q, $log,contryREST ) {
		// $scope.change = ( country ) => {
		// };
		let self = this;

		self.simulateQuery = false;
		self.isDisabled    = false;

		self.repos         = loadAll();
		self.querySearch   = querySearch;
		self.selectedItemChange = selectedItemChange;
		self.searchTextChange   = searchTextChange;

		function querySearch (query) {
			let type = query?'name':'all';
			contryREST.query({
				type,
				country: query.toLowerCase()
			}, result => {
				result;
			}, error => {
				log( 'error',error );
			});
			var results = query ? self.repos.filter( createFilterFor(query) ) : self.repos,
			deferred;
			if (self.simulateQuery) {
				deferred = $q.defer();
				$timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
				return deferred.promise;
			} else {
				return results;
			}
		}

		function searchTextChange(text) {
			$log.info('Text changed to ' + text);
		}

		function selectedItemChange(item) {
			$log.info('Item changed to ' + JSON.stringify(item));
		}

		function loadAll() {
			var repos = [
			{
				'name'      : 'AngularJS',
				'url'       : 'https://github.com/angular/angular.js',
				'watchers'  : '3,623',
				'forks'     : '16,175',
			},
			{
				'name'      : 'Angular',
				'url'       : 'https://github.com/angular/angular',
				'watchers'  : '469',
				'forks'     : '760',
			},
			{
				'name'      : 'AngularJS Material',
				'url'       : 'https://github.com/angular/material',
				'watchers'  : '727',
				'forks'     : '1,241',
			},
			{
				'name'      : 'Angular Material',
				'url'       : 'https://github.com/angular/material2',
				'watchers'  : '727',
				'forks'     : '1,241',
			},
			{
				'name'      : 'Bower Material',
				'url'       : 'https://github.com/angular/bower-material',
				'watchers'  : '42',
				'forks'     : '84',
			},
			{
				'name'      : 'Material Start',
				'url'       : 'https://github.com/angular/material-start',
				'watchers'  : '81',
				'forks'     : '303',
			}
			];
			return repos.map( function (repo) {
				repo.value = repo.name.toLowerCase();
				return repo;
			});
		}

		function createFilterFor(query) {
			var lowercaseQuery = angular.lowercase(query);

			return function filterFn(item) {
				return (item.value.indexOf(lowercaseQuery) === 0);
			};

		}
	}]);
})();
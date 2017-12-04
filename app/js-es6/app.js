import LS from './LS';
let userIsAuthenticated = function() {
	return !!LS.get( 'login' );
}

let loginRequired = function($location, $q) {
	let deferred = $q.defer();
	if( !userIsAuthenticated() ) {
		deferred.reject()
		$location.path('/login');
	} else {
		deferred.resolve()
	}
	return deferred.promise;
};
;(() => {
	let log = console.log;
	angular.module('app', ['ngMaterial','ngResource','ui.router', 'ngMessages', ])
	.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/registration');

		$stateProvider
		.state('registration', {
			url: '/registration',
			templateUrl: 'partial-registration.html',
		})
		.state('login', {
			url: '/login',
			templateUrl: 'partial-login.html',
		})
		.state('profile', {
			url: '/profile',
			templateUrl: 'partial-profile.html',
			resolve: { loginRequired: loginRequired }
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
	.controller('LoginForm',['$scope', '$location',function( $scope, $location){
		$scope.user = {
			email: '',
			pass: '',
		};
		this.submit = ()=>{
			let users = LS.get('users') || [];
			let user = null;
			if( users.some( (el)=> ($scope.user.email === el.email?(user = el,true): false ) ) ){
				if( user.pass === $scope.user.pass){
					LS.set('login',true);
					LS.set('user',user);
					$location.path('/profile');
				}
			}
		};
	}])
	.controller('RegistrationForm',['$scope', '$location', '$timeout', '$q', '$log','contryREST' ,function( $scope, $location , $timeout, $q, $log,contryREST ){
		$scope.user = {
			name: '',
			email: '',
			country: '',
			city: '',
			pass: '',
		}
		this.querySearch = (query,country) => {
			let
				fields = country?'name':'capital',
				type = query?fields:'all',
				deferred = $q.defer();
			log(type,fields);
			contryREST.query({
				type,
				country: query.toLowerCase(),
				fields
			}, result => {
				deferred.resolve( result );
			}, error => {
				log( 'error',error );
			});
			return deferred.promise;
		}
		this.selectedItemChange = obj => {
			$log.info('Text changed to ' + JSON.stringify( obj ) );
			if( obj && obj.name ) $scope.user.country = obj.name;
			if( obj && obj.capital ) $scope.user.city = obj.capital;
		}
		this.searchTextChange = obj => {
			$log.info('Item changed to ' + JSON.stringify(obj));
			if( obj && obj.name ) $scope.user.country = obj.name;
			if( obj && obj.capital ) $scope.user.city = obj.capital;
		}
		this.submit = function(){
			let users = LS.get('users') || [];
			let min = 1;
			let max = 30;
			$scope.user.id = Math.floor( Math.random()* (max - min) + min );
			if( !users.some( (el)=> $scope.user.email === el.email ) ) users.push( $scope.user );
			$location.path('/login');
			LS.set('users',users);
		}
	}])
	.controller('ProfileForm',['$scope', '$timeout', '$q', '$log','contryREST' ,function( $scope, $timeout, $q, $log,contryREST ){
		$scope.user = LS.get('user');
		this.querySearch = (query,country) => {
			let
				fields = country?'name':'capital',
				type = query?fields:'all',
				deferred = $q.defer();
			contryREST.query({
				type,
				country: query.toLowerCase(),
				fields
			}, result => {
				deferred.resolve( result );
			}, error => {
				log( 'error',error );
			});
			return deferred.promise;
		}
		this.selectedItemChange = obj => {
			$log.info('Text changed to ' + JSON.stringify( obj ) );
			if( obj && obj.name ) $scope.user.country = obj.name;
			if( obj && obj.capital ) $scope.user.city = obj.capital;
		}
		this.searchTextChange = obj => {
			$log.info('Item changed to ' + JSON.stringify(obj));
			if( obj && obj.name ) $scope.user.country = obj.name;
			if( obj && obj.capital ) $scope.user.city = obj.capital;
		}
		this.submit = function(){
			let oldUser = LS.get('user');
			let users = LS.get('users') || [];
			LS.set('users',users.map( (el,id,arr) => oldUser.id === el.id ? $scope.user: el ));
			LS.set( 'user', $scope.user );
		}
	}])
	.factory('contryREST',[
		'$resource',
		$resource => $resource('https://restcountries.eu/rest/v2/:type/:country',{
			type: '@type',
			country: '@country',
			fields: '@fields'
		})
	]);
})();
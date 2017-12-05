const log = console.log;


import LS from './LS';
import AppCtrl from './AppCtrl';
import LeftCtrl from './LeftCtrl';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import ProfileForm from './ProfileForm';


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
	.controller('AppCtrl', AppCtrl)
	.controller('LeftCtrl', LeftCtrl)
	.controller('LoginForm', LoginForm)
	.controller('RegistrationForm', RegistrationForm)
	.controller('ProfileForm', ProfileForm)
	.factory('contryREST',[
		'$resource',
		$resource => $resource('https://restcountries.eu/rest/v2/:type/:country:city',{
			type: '@type',
			country: '@country',
			city: '@city',
			fields: '@fields'
		})
	]);
})();
const log = console.log;


import LS from './vendor/LS';

import AppCtrl from './commponent/AppCtrl';
import LoginForm from './commponent/LoginForm';
import RegistrationForm from './commponent/RegistrationForm';
import ProfileForm from './commponent/ProfileForm';


let userIsAuthenticated = function() {
	return !!LS.get( 'login' );
}

let loginRequired = function($state, $q) {
	console.log( $state );
	console.log( userIsAuthenticated() );
	let deferred = $q.defer();
	if( !userIsAuthenticated() ) {
		deferred.reject()
		$state.go('login');
	} else  deferred.resolve()
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
				// resolve: { loginRequired: loginRequired }
			});


	}])
	.controller('AppCtrl', AppCtrl)
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
const log = console.log;


import LS from './vendor/LS';

import AppCtrl from './controller/App';
import LoginForm from './component/LoginForm';
import RegistrationForm from './controller/RegistrationForm';
import ProfileForm from './controller/ProfileForm';

;((angular) => {

	let userIsAuthenticated = () => !!LS.get( 'login' );

	let loginRequired = ($state, $q) => {
		let deferred = $q.defer();
		if( !userIsAuthenticated() ) {
			deferred.reject()
			$state.go('login');
		} else  deferred.resolve()
		return deferred.promise;
	};

	angular.module('app', ['ngMaterial','ngResource','ui.router', 'ngMessages', ])
	.config(['$stateProvider','$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {

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
	.component('loginForm', LoginForm)
	.component('registrationForm',{
		controller: RegistrationForm,
		templateUrl: 'tmpl/userInfoForm.html'
	})
	.component('profileForm',{
		controller: ProfileForm,
		templateUrl: 'tmpl/userInfoForm.html'
	})
	.factory('contryREST',[
		'$resource',
		$resource => $resource('https://restcountries.eu/rest/v2/:type/:country:city',{
			type: '@type',
			country: '@country',
			city: '@city',
			fields: '@fields'
		})
	]);
})(window.angular);
const log = console.log;


import LS from './vendor/LS';

import AppCtrl from './controller/App';
import LoginForm from './component/LoginForm';
import RegistrationForm from './component/RegistrationForm';
import ProfileForm from './component/ProfileForm';


;((angular) => {

	let userIsAuthenticated = function() {
		return !!LS.get( 'login' );
	}

	let loginRequired = function($state, $q) {
		let deferred = $q.defer();
		if( !userIsAuthenticated() ) {
			deferred.reject()
			$state.go('login');
		} else  deferred.resolve()
		return deferred.promise;
	};

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
	.component('loginForm',{
		controller: LoginForm,
		templateUrl: 'tmpl/login-form.html'
	})
	.component('registrationForm',{
		controller: RegistrationForm,
		templateUrl: 'tmpl/user-info-form.html'
	})
	.component('profileForm',{
		controller: ProfileForm,
		templateUrl: 'tmpl/user-info-form.html'
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
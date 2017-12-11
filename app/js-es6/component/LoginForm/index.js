import LS from '../../class/LS';

function LoginForm( $state ){
	class _LoginForm {
		constructor(){}
		submit(){}
	};
	return new _LoginForm();
};

LoginForm.$inject = ['$state'];

export default {
	controller: LoginForm,
	templateUrl: 'template.html',
	bindings: {
		user: '<',
		submit: '&'
	}
};
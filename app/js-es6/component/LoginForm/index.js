import LS from '../../class/LS';

function LoginForm( $state ){
	class _LoginForm {
		constructor( $state ){
			this.user = {
				email: '',
				pass: '',
			};
		}
		submit(){
			let users = LS.get('users') || [];
			let user = users.find( u => u.email === this.user.email && u.pass === this.user.pass );
			if( user ){
				LS.set( 'login',true );
				LS.set( 'user',user );
				$state.go('profile');
			}
		}
	};
	return new _LoginForm();
};

LoginForm.$inject = ['$state'];

export default {
	controller: LoginForm,
	templateUrl: 'tmpl/loginForm.html'
};
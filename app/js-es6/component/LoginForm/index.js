import LS from '../../vendor/LS';

class LoginForm {
	constructor( $state ){
		this._$state = $state;
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
			this._$state.go('profile');
		}
	}
};

LoginForm.$inject = ['$state'];
export default LoginForm;
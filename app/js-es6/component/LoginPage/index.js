function Login( $state ){
	class _Login {
		constructor(){
			this.user = {
				email: '',
				pass: '',
			};
		}
		submit(){
			let user = users.find( u => u.email === this.user.email && u.pass === this.user.pass );
			if( user ){
				LS.set( 'login',true );
				LS.set( 'user',user );
				$state.go('profile');
			}
		}
	};
	return new _Login();
};

Login.$inject = ['$state'];

export default {
	controller: Login,
	templateUrl: 'template.html'
};
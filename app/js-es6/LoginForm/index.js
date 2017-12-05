class LoginForm {
	constructor( $scope, $location ){
		this.user = {
			email: '',
			pass: '',
		};
	}
	submit(){
		let users = LS.get('users') || [];
		let user = users.find( u => u.email === $scope.user.email && u.pass === $scope.user.pass );
		if( user ){
			LS.set('login',true);
			LS.set('user',user);
			$location.path('/profile');
		}
	}
};

LoginForm.$inject = ['$scope', '$location'];
export default LoginForm;
import LS from '../../class/LS';

function RegistrationForm( $state ){
	class _RegistrationForm {
		constructor(){
			this.btn = 'Зарегистрироваться';
			this.user = {
				name: '',
				email: '',
				country: '',
				city: '',
				pass: '',
			};
		}
		submit(){
			let users = LS.get('users') || [];
			let min = 1;
			let max = 30;
			this.user.id = Math.floor( Math.random()* (max - min) + min );
			if( !users.some( (el)=> this.user.email === el.email ) ) users.push( this.user );
			$state.go('login');
			LS.set('users',users);
		}
	}
	return new _RegistrationForm();
}
RegistrationForm.$inject = [ '$state' ];
export default RegistrationForm;

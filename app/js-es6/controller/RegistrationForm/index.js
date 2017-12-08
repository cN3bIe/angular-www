import LS from '../../class/LS';

import searchCountryCity from '../../class/searchCountryCity';

function RegistrationForm( $state, $log, contryREST ){
	class _RegistrationForm extends searchCountryCity( $log, contryREST ) {
		constructor(){
			super();
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
RegistrationForm.$inject = [ '$state', '$log','contryREST'];
export default RegistrationForm;

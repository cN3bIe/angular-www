import LS from '../../vendor/LS';

import RegistrationForm from '../RegistrationForm';

class ProfileForm extends RegistrationForm {
	constructor( contryREST ){
		super( contryREST );
		this.user = LS.get('user');
		this.isDisabled = true;
		this.btn = ['Update','Save'];
	}
	edit(){
		this.isDisabled = !this.isDisabled;
	}
	submit(){
		let oldUser = LS.get('user');
		let users = LS.get('users') || [];
		LS.set('users',users.map( (el,id,arr) => oldUser.id === el.id ? this.user: el ));
		LS.set( 'user', this.user );
	}
};

ProfileForm.$inject = [ 'contryREST' ];
export default ProfileForm;


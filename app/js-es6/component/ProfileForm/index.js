import LS from '../../vendor/LS';

import RegistrationForm from '../RegistrationForm';

class ProfileForm extends RegistrationForm {
	constructor( $log, contryREST ){
		super( $log, contryREST );
		this.user = LS.get('user');
		this.isDisabled = true;
		this.btnEnum = ['Update','Save'];
		this.btnChange();
	}
	btnChange(){
		this.btn = this.isDisabled?this.btnEnum[0]:this.btnEnum[1];
	}
	btnClick(){
		this.isDisabled = !this.isDisabled;
		this.btnChange();
	}
	submit(){
		if( !this.isDisabled ) return;
		console.log('submit');
		let oldUser = LS.get('user');
		let users = LS.get('users') || [];
		LS.set('users',users.map( (el,id,arr) => oldUser.id === el.id ? this.user: el ));
		LS.set( 'user', this.user );
	}
};

ProfileForm.$inject = [ '$log', 'contryREST' ];
export default ProfileForm;


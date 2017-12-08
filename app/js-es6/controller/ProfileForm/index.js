import LS from '../../class/LS';

function ProfileForm(){
	class _ProfileForm {
		constructor(){
			this.user = LS.get('user');
			this.isDisabled = true;
			this.btnEnum = ['Update','Save'];
			this.btnChange();
		}
		btnChange(){
			this.btn = this.isDisabled?this.btnEnum[0]:this.btnEnum[1];
		}
		toggleReadonly(){
			return this.isDisabled = !this.isDisabled;
		}
		submit(){
			this.toggleReadonly();
			this.btnChange();
			if( !this.isDisabled ) return;
			console.log('submit');
			let oldUser = LS.get('user');
			let users = LS.get('users') || [];
			LS.set('users',users.map( (el,id,arr) => oldUser.id === el.id ? this.user: el ));
			LS.set( 'user', this.user );
		}
	};
	return new _ProfileForm();
}
export default ProfileForm;


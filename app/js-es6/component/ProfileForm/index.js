import LS from '../../vendor/LS';

import searchCountryCity from '../../class/searchCountryCity';

function ProfileForm( $log, contryREST ){
	class _ProfileForm extends searchCountryCity( $log, contryREST ) {
		constructor(){
			super();
			this.user = LS.get('user');
			this.isReadonly = true;
			this.btnEnum = ['Update','Save'];
			this.btnChange();
		}
		btnChange(){
			this.btn = this.isReadonly?this.btnEnum[0]:this.btnEnum[1];
		}
		btnClick(){
			console.log( this );
			this.isReadonly = !this.isReadonly;
			this.btnChange();
		}
		submit(){
			if( !this.isReadonly ) return;
			console.log('submit');
			let oldUser = LS.get('user');
			let users = LS.get('users') || [];
			LS.set('users',users.map( (el,id,arr) => oldUser.id === el.id ? this.user: el ));
			LS.set( 'user', this.user );
		}
	};
	return new _ProfileForm();
}
ProfileForm.$inject = [ '$log', 'contryREST' ];
export default ProfileForm;


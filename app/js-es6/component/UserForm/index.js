import LS from '../../class/LS';

import SearchCountryCity from '../../class/SearchCountryCity';

function UserForm( $log, contryREST ){
	class _UserForm extends SearchCountryCity( $log, contryREST ) {
		constructor( $log, contryREST ){
			super( $log, contryREST );
		}
	};
	return new _UserForm();
};

UserForm.$inject = [ '$log', 'contryREST' ];

export default {
	controller: UserForm,
	templateUrl: 'tmpl/UserForm.html',
	bindings: {
		user: '<',
		isDisabled: '<',
		btn: '<',
		submit: '&'
	}
};
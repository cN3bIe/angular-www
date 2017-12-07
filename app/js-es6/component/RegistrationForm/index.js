import LS from '../../vendor/LS';

class RegistrationForm {
	constructor( $state, $log, contryREST ){
		this._$log = $log;
		this._$state = $state;
		this._contryREST = contryREST;

		this.btn = 'Зарегистрироваться';
		this.user = {
			name: '',
			email: '',
			country: '',
			city: '',
			pass: '',
		};
	}
	querySearch( query,country ){
		let fields = country?'name':'capital';
		let type = query?fields:'all';
		return this._contryREST.query({
			type,
			country: query.toLowerCase(),
			fields
		}, result => {
			return result ;
		}, error => {
			this._$log.error( 'error',error );
		}).$promise;
	}
	setCityCountry( text, obj ){
		this._$log.debug( text, obj );
		if( obj ){
			if( obj.name ){
				this.user.country = obj.name;
				this.selectedItemCountry = obj;
			}
			if( obj.capital ){
				this.user.city = obj.capital;
				this.selectedItemCity = obj;
			}
		}
	}
	selectedItemChange( obj ){
		this.setCityCountry('Text changed to ', obj );
	}
	searchTextChange( obj ){
		this.setCityCountry('Item changed to ', obj );
	}
	btnClick(){
		// this.submit();
	}
	submit(){
		let users = LS.get('users') || [];
		let min = 1;
		let max = 30;
		this.user.id = Math.floor( Math.random()* (max - min) + min );
		if( !users.some( (el)=> this.user.email === el.email ) ) users.push( this.user );
		this._$state.go('login');
		LS.set('users',users);
	}
};

RegistrationForm.$inject = [ '$state', '$log','contryREST'];
export default RegistrationForm;
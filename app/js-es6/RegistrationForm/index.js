class RegistrationForm {
	constructor( $scope, $location, $q, $log,contryREST ){
		$scope.user = {
			name: '',
			email: '',
			country: '',
			city: '',
			pass: '',
		};
		this._contryREST = contryREST;
		this._$q = $q;
	}
	querySearch( query,country ){
		let fields = country?'name':'capital';
		let type = query?fields:'all';
		let deferred = this._$q.defer();
		this._contryREST.query({
			type,
			country: query.toLowerCase(),
			fields
		}, result => {
			deferred.resolve( result );
		}, error => {
			console.log( 'error',error );
		});
		console.log()
		return deferred.promise;
	}
	selectedItemChange( obj ){
		$log.info('Text changed to ' + JSON.stringify( obj ) );
		if( obj && obj.name ) $scope.user.country = obj.name;
		if( obj && obj.capital ) $scope.user.city = obj.capital;
	}
	searchTextChange( obj ){
		$log.info('Item changed to ' + JSON.stringify(obj));
		if( obj && obj.name ) $scope.user.country = obj.name;
		if( obj && obj.capital ) $scope.user.city = obj.capital;
	}
	submit(){
		let users = LS.get('users') || [];
		let min = 1;
		let max = 30;
		$scope.user.id = Math.floor( Math.random()* (max - min) + min );
		if( !users.some( (el)=> $scope.user.email === el.email ) ) users.push( $scope.user );
		$location.path('/login');
		LS.set('users',users);
	}
};

RegistrationForm.$inject = ['$scope', '$location', '$q', '$log','contryREST'];
export default RegistrationForm;
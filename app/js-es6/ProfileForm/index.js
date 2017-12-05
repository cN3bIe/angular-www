class ProfileForm {
	constructor( $scope, $timeout, $q, $log,contryREST ){
		$scope.user = LS.get('user');
	}
	querySearch(query,country){
			let
				fields = country?'name':'capital',
				type = query?fields:'all',
				deferred = $q.defer();
			contryREST.query({
				type,
				country: query.toLowerCase(),
				fields: (!country?fields:fields + ';capital')
			}, result => {
				deferred.resolve( result );
			}, error => {
				log( 'error',error );
			});
			return deferred.promise;
		}
	selectedItemChange( obj ){
		$log.info('Text changed to ' + JSON.stringify( obj ) );
		if( obj && obj.name ){
			$scope.user.country = obj.name;
			this.searchTextCity = $scope.user.city = obj.capital;
		}
		if( obj && obj.capital ) $scope.user.city = obj.capital;
	}
	searchTextChange( obj ){
		$log.info('Item changed to ' + JSON.stringify(obj));
		if( obj && obj.name ) $scope.user.country = obj.name;
		if( obj && obj.capital ) $scope.user.city = obj.capital;
	}
	submit(){
		let oldUser = LS.get('user');
		let users = LS.get('users') || [];
		LS.set('users',users.map( (el,id,arr) => oldUser.id === el.id ? $scope.user: el ));
		LS.set( 'user', $scope.user );
	}
};

ProfileForm.$inject = ['$scope', '$timeout', '$q', '$log','contryREST'];
export default ProfileForm;


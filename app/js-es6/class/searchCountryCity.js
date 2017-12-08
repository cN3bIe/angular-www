function searchCountryCity( $log, contryREST ){
		class _searchCountryCity {
		constructor(){}
		querySearch( query,country ){
			let fields = country?'name':'capital';
			let type = query?fields:'all';
			console.log( contryREST );
			return contryREST.query({
				type,
				country: query.toLowerCase(),
				fields
			},
			result => result,
			error =>  $log.error( 'error',error ) )
			.$promise;
		}
		setCityCountry( text, obj ){
			$log.debug( text, obj );
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
	}
	return _searchCountryCity;
}

searchCountryCity.$inject = [ '$log','contryREST'];
export default searchCountryCity;
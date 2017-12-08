function SearchCountryCity( $log, contryREST ){
	class _SearchCountryCity {
		constructor(){}
		querySearch( query,country ){
			let fields = country?'name':'capital';
			let type = query?fields:'all';
			return contryREST.query({
				type,
				country: query.toLowerCase(),
				fields: country?fields + ';capital':fields
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
	return _SearchCountryCity;
}

SearchCountryCity.$inject = [ '$log','contryREST'];
export default SearchCountryCity;
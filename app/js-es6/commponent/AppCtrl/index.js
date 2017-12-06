class AppCtrl {
	constructor($mdSidenav, $log,contryREST){
		this.title = 'Hey';
		this._$mdSidenav = $mdSidenav;
		this._$log = $log;
	}
	close(){
		this._$mdSidenav('left').close()
			.then(() => {
				this._$log.debug("close LEFT is done");
			});
	}
	open(){
		this._$mdSidenav('left').toggle()
			.then( () => {
				this._$log.debug("toggle Left is done")
			});
	}
};

AppCtrl.$inject = ['$mdSidenav', '$log'];
export default AppCtrl;
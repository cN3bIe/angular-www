function App( $mdSidenav, $log,contryREST ) {
	class _App {
		constructor(){
			this.title = 'Hey';
		}
		close(){
			$mdSidenav('left').close()
				.then( () => {
					$log.debug("close LEFT is done");
				});
		}
		open(){
			$mdSidenav('left').toggle()
				.then( () => {
					$log.debug("toggle Left is done")
				});
		}
	};
	return new _App();;
}

App.$inject = ['$mdSidenav', '$log'];
export default App;
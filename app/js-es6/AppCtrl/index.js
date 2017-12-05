class AppCtrl {
	constructor($scope, $timeout, $mdSidenav, $log,contryREST){
		this.title = 'Hey';
		this.project = {
			description: '',
			special: true
		};
		this.toggleLeft = this.buildDelayedToggler('left');
	}
	debounce(func, wait, context) {
		let timer;
		return function debounced() {
			let context = $scope,
			args = Array.prototype.slice.call(arguments);
			$timeout.cancel(timer);
			timer = $timeout(function() {
				timer = undefined;
				func.apply(context, args);
			}, wait || 10);
		};
	}

	buildDelayedToggler(navID) {
		return this.debounce(() => {
			$mdSidenav(navID)
			.toggle()
			.then( () => {
				$log.debug("toggle " + navID + " is done")
			});
		}, 200);
	}

	buildToggler(navID) {
		return () => {
			$mdSidenav(navID)
			.toggle()
			.then( () => {
				$log.debug("toggle " + navID + " is done")
			});
		};
	}
};

AppCtrl.$inject = ['$scope', '$timeout', '$mdSidenav', '$log','contryREST'];
export default AppCtrl;
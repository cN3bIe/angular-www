class LeftCtrl {
	constructor($scope, $timeout, $mdSidenav, $log){
		$scope.close = () => {
			$mdSidenav('left').close()
			.then(() => {
				$log.debug("close LEFT is done");
			});
		};
	}
};

LeftCtrl.$inject = ['$scope', '$timeout', '$mdSidenav', '$log'];
export default LeftCtrl;
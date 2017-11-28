;(()=>{
let log = console.log;
	let myApp = angular.module('myApp',[]);
	myApp.controller('myController',($scope)=>{
		$scope.users = [
			// {name: 'name 1', age: 13}
		];
	});
})();
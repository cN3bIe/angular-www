(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LS = function () {
	function LS() {
		_classCallCheck(this, LS);
	}

	_createClass(LS, null, [{
		key: "set",
		value: function set(name, data) {
			localStorage.setItem(name, JSON.stringify(data));
		}
	}, {
		key: "get",
		value: function get(name) {
			return JSON.parse(localStorage.getItem(name));
		}
	}, {
		key: "clear",
		value: function clear() {
			localStorage.clear();location.reload();
		}
	}]);

	return LS;
}();

exports.default = LS;
;

},{}],2:[function(require,module,exports){
'use strict';

var _LS = require('./LS');

var _LS2 = _interopRequireDefault(_LS);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userIsAuthenticated = function userIsAuthenticated() {
	return !!_LS2.default.get('login');
};

var loginRequired = function loginRequired($location, $q) {
	var deferred = $q.defer();
	if (!userIsAuthenticated()) {
		deferred.reject();
		$location.path('/login');
	} else {
		deferred.resolve();
	}
	return deferred.promise;
};
;(function () {
	var log = console.log;
	angular.module('app', ['ngMaterial', 'ngResource', 'ui.router', 'ngMessages']).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/registration');

		$stateProvider.state('registration', {
			url: '/registration',
			templateUrl: 'partial-registration.html'
		}).state('login', {
			url: '/login',
			templateUrl: 'partial-login.html'
		}).state('profile', {
			url: '/profile',
			templateUrl: 'partial-profile.html',
			resolve: { loginRequired: loginRequired }
		});
	}]).controller('AppCtrl', ['$scope', '$timeout', '$mdSidenav', '$log', 'contryREST', function ($scope, $timeout, $mdSidenav, $log, contryREST) {
		$scope.title = 'Hey';
		$scope.project = {
			description: '',
			special: true
		};
		$scope.toggleLeft = buildDelayedToggler('left');
		function debounce(func, wait, context) {
			var timer;

			return function debounced() {
				var context = $scope,
				    args = Array.prototype.slice.call(arguments);
				$timeout.cancel(timer);
				timer = $timeout(function () {
					timer = undefined;
					func.apply(context, args);
				}, wait || 10);
			};
		}

		function buildDelayedToggler(navID) {
			return debounce(function () {
				$mdSidenav(navID).toggle().then(function () {
					$log.debug("toggle " + navID + " is done");
				});
			}, 200);
		}

		function buildToggler(navID) {
			return function () {
				$mdSidenav(navID).toggle().then(function () {
					$log.debug("toggle " + navID + " is done");
				});
			};
		}
	}]).controller('LeftCtrl', ['$scope', '$timeout', '$mdSidenav', '$log', function ($scope, $timeout, $mdSidenav, $log) {
		$scope.close = function () {
			$mdSidenav('left').close().then(function () {
				$log.debug("close LEFT is done");
			});
		};
	}]).controller('LoginForm', ['$scope', '$location', function ($scope, $location) {
		$scope.user = {
			email: '',
			pass: ''
		};
		this.submit = function () {
			var users = _LS2.default.get('users') || [];
			var user = null;
			if (users.some(function (el) {
				return $scope.user.email === el.email ? (user = el, true) : false;
			})) {
				if (user.pass === $scope.user.pass) {
					_LS2.default.set('login', true);
					_LS2.default.set('user', user);
					$location.path('/profile');
				}
			}
		};
	}]).controller('RegistrationForm', ['$scope', '$location', '$timeout', '$q', '$log', 'contryREST', function ($scope, $location, $timeout, $q, $log, contryREST) {
		$scope.user = {
			name: '',
			email: '',
			country: '',
			city: '',
			pass: ''
		};
		this.querySearch = function (query, country) {
			var fields = country ? 'name' : 'capital',
			    type = query ? fields : 'all',
			    deferred = $q.defer();
			log(type, fields);
			contryREST.query({
				type: type,
				country: query.toLowerCase(),
				fields: fields
			}, function (result) {
				deferred.resolve(result);
			}, function (error) {
				log('error', error);
			});
			return deferred.promise;
		};
		this.selectedItemChange = function (obj) {
			$log.info('Text changed to ' + JSON.stringify(obj));
			if (obj && obj.name) $scope.user.country = obj.name;
			if (obj && obj.capital) $scope.user.city = obj.capital;
		};
		this.searchTextChange = function (obj) {
			$log.info('Item changed to ' + JSON.stringify(obj));
			if (obj && obj.name) $scope.user.country = obj.name;
			if (obj && obj.capital) $scope.user.city = obj.capital;
		};
		this.submit = function () {
			var users = _LS2.default.get('users') || [];
			var min = 1;
			var max = 30;
			$scope.user.id = Math.floor(Math.random() * (max - min) + min);
			if (!users.some(function (el) {
				return $scope.user.email === el.email;
			})) users.push($scope.user);
			$location.path('/login');
			_LS2.default.set('users', users);
		};
	}]).controller('ProfileForm', ['$scope', '$timeout', '$q', '$log', 'contryREST', function ($scope, $timeout, $q, $log, contryREST) {
		var _this = this;

		$scope.user = _LS2.default.get('user');
		this.querySearch = function (query, country) {
			var fields = country ? 'name' : 'capital',
			    type = query ? fields : 'all',
			    deferred = $q.defer();
			contryREST.query({
				type: type,
				country: query.toLowerCase(),
				fields: !country ? fields : fields + ';capital'
			}, function (result) {
				deferred.resolve(result);
			}, function (error) {
				log('error', error);
			});
			return deferred.promise;
		};
		this.selectedItemChange = function (obj) {
			$log.info('Text changed to ' + JSON.stringify(obj));
			if (obj && obj.name) {
				$scope.user.country = obj.name;
				_this.searchTextCity = $scope.user.city = obj.capital;
			}
			if (obj && obj.capital) $scope.user.city = obj.capital;
		};
		this.searchTextChange = function (obj) {
			$log.info('Item changed to ' + JSON.stringify(obj));
			if (obj && obj.name) $scope.user.country = obj.name;
			if (obj && obj.capital) $scope.user.city = obj.capital;
		};
		this.submit = function () {
			var oldUser = _LS2.default.get('user');
			var users = _LS2.default.get('users') || [];
			_LS2.default.set('users', users.map(function (el, id, arr) {
				return oldUser.id === el.id ? $scope.user : el;
			}));
			_LS2.default.set('user', $scope.user);
		};
	}]).factory('contryREST', ['$resource', function ($resource) {
		return $resource('https://restcountries.eu/rest/v2/:type/:country', {
			type: '@type',
			country: '@country',
			fields: '@fields'
		});
	}]);
})();

},{"./LS":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHBcXGpzLWVzNlxcTFNcXGluZGV4LmpzIiwiYXBwXFxqcy1lczZcXGFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7SUNBcUIsRTs7Ozs7OztzQkFDVCxJLEVBQUssSSxFQUFLO0FBQ3BCLGdCQUFhLE9BQWIsQ0FBcUIsSUFBckIsRUFBMEIsS0FBSyxTQUFMLENBQWUsSUFBZixDQUExQjtBQUNBOzs7c0JBQ1UsSSxFQUFLO0FBQ2YsVUFBTyxLQUFLLEtBQUwsQ0FBWSxhQUFhLE9BQWIsQ0FBcUIsSUFBckIsQ0FBWixDQUFQO0FBQ0E7OzswQkFDYTtBQUNiLGdCQUFhLEtBQWIsR0FBc0IsU0FBUyxNQUFUO0FBQ3RCOzs7Ozs7a0JBVG1CLEU7QUFVcEI7Ozs7O0FDVkQ7Ozs7OztBQUNBLElBQUksc0JBQXNCLFNBQXRCLG1CQUFzQixHQUFXO0FBQ3BDLFFBQU8sQ0FBQyxDQUFDLGFBQUcsR0FBSCxDQUFRLE9BQVIsQ0FBVDtBQUNBLENBRkQ7O0FBSUEsSUFBSSxnQkFBZ0IsU0FBaEIsYUFBZ0IsQ0FBUyxTQUFULEVBQW9CLEVBQXBCLEVBQXdCO0FBQzNDLEtBQUksV0FBVyxHQUFHLEtBQUgsRUFBZjtBQUNBLEtBQUksQ0FBQyxxQkFBTCxFQUE2QjtBQUM1QixXQUFTLE1BQVQ7QUFDQSxZQUFVLElBQVYsQ0FBZSxRQUFmO0FBQ0EsRUFIRCxNQUdPO0FBQ04sV0FBUyxPQUFUO0FBQ0E7QUFDRCxRQUFPLFNBQVMsT0FBaEI7QUFDQSxDQVREO0FBVUEsQ0FBQyxDQUFDLFlBQU07QUFDUCxLQUFJLE1BQU0sUUFBUSxHQUFsQjtBQUNBLFNBQVEsTUFBUixDQUFlLEtBQWYsRUFBc0IsQ0FBQyxZQUFELEVBQWMsWUFBZCxFQUEyQixXQUEzQixFQUF3QyxZQUF4QyxDQUF0QixFQUNDLE1BREQsQ0FDUSxDQUFDLGdCQUFELEVBQWtCLG9CQUFsQixFQUF1QyxVQUFT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RCxPQUFJLE9BQU8sSUFBSSxPQUFmLEVBQXlCLE9BQU8sSUFBUCxDQUFZLElBQVosR0FBbUIsSUFBSSxPQUF2QjtBQUN6QixHQVBEO0FBUUEsT0FBSyxnQkFBTCxHQUF3QixlQUFPO0FBQzlCLFFBQUssSUFBTCxDQUFVLHFCQUFxQixLQUFLLFNBQUwsQ0FBZSxHQUFmLENBQS9CO0FBQ0EsT0FBSSxPQUFPLElBQUksSUFBZixFQUFzQixPQUFPLElBQVAsQ0FBWSxPQUFaLEdBQXNCLElBQUksSUFBMUI7QUFDdEIsT0FBSSxPQUFPLElBQUksT0FBZixFQUF5QixPQUFPLElBQVAsQ0FBWSxJQUFaLEdBQW1CLElBQUksT0FBdkI7QUFDekIsR0FKRDtBQUtBLE9BQUssTUFBTCxHQUFjLFlBQVU7QUFDdkIsT0FBSSxVQUFVLGFBQUcsR0FBSCxDQUFPLE1BQVAsQ0FBZDtBQUNBLE9BQUksUUFBUSxhQUFHLEdBQUgsQ0FBTyxPQUFQLEtBQW1CLEVBQS9CO0FBQ0EsZ0JBQUcsR0FBSCxDQUFPLE9BQVAsRUFBZSxNQUFNLEdBQU4sQ0FBVyxVQUFDLEVBQUQsRUFBSSxFQUFKLEVBQU8sR0FBUDtBQUFBLFdBQWUsUUFBUSxFQUFSLEtBQWUsR0FBRyxFQUFsQixHQUF1QixPQUFPLElBQTlCLEdBQW9DLEVBQW5EO0FBQUEsSUFBWCxDQUFmO0FBQ0EsZ0JBQUcsR0FBSCxDQUFRLE1BQVIsRUFBZ0IsT0FBTyxJQUF2QjtBQUNBLEdBTEQ7QUFNQSxFQXJDeUIsQ0F0STFCLEVBNEtDLE9BNUtELENBNEtTLFlBNUtULEVBNEtzQixDQUNyQixXQURxQixFQUVyQjtBQUFBLFNBQWEsVUFBVSxpREFBVixFQUE0RDtBQUN4RSxTQUFNLE9BRGtFO0FBRXhFLFlBQVMsVUFGK0Q7QUFHeEUsV0FBUTtBQUhnRSxHQUE1RCxDQUFiO0FBQUEsRUFGcUIsQ0E1S3RCO0FBb0xBLENBdExBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIExTIHtcclxuXHRzdGF0aWMgc2V0KG5hbWUsZGF0YSl7XHJcblx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShuYW1lLEpTT04uc3RyaW5naWZ5KGRhdGEpICk7XHJcblx0fVxyXG5cdHN0YXRpYyBnZXQobmFtZSl7XHJcblx0XHRyZXR1cm4gSlNPTi5wYXJzZSggbG9jYWxTdG9yYWdlLmdldEl0ZW0obmFtZSkgKTtcclxuXHR9XHJcblx0c3RhdGljIGNsZWFyKCl7XHJcblx0XHRsb2NhbFN0b3JhZ2UuY2xlYXIoKTsgbG9jYXRpb24ucmVsb2FkKCk7XHJcblx0fVxyXG59OyIsImltcG9ydCBMUyBmcm9tICcuL0xTJztcclxubGV0IHVzZXJJc0F1dGhlbnRpY2F0ZWQgPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gISFMUy5nZXQoICdsb2dpbicgKTtcclxufVxyXG5cclxubGV0IGxvZ2luUmVxdWlyZWQgPSBmdW5jdGlvbigkbG9jYXRpb24sICRxKSB7XHJcblx0bGV0IGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuXHRpZiggIXVzZXJJc0F1dGhlbnRpY2F0ZWQoKSApIHtcclxuXHRcdGRlZmVycmVkLnJlamVjdCgpXHJcblx0XHQkbG9jYXRpb24ucGF0aCgnL2xvZ2luJyk7XHJcblx0fSBlbHNlIHtcclxuXHRcdGRlZmVycmVkLnJlc29sdmUoKVxyXG5cdH1cclxuXHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxufTtcclxuOygoKSA9PiB7XHJcblx0bGV0IGxvZyA9IGNvbnNvbGUubG9nO1xyXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ25nTWF0ZXJpYWwnLCduZ1Jlc291cmNlJywndWkucm91dGVyJywgJ25nTWVzc2FnZXMnLCBdKVxyXG5cdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsJyR1cmxSb3V0ZXJQcm92aWRlcicsZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xyXG5cclxuXHRcdCR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9yZWdpc3RyYXRpb24nKTtcclxuXHJcblx0XHQkc3RhdGVQcm92aWRlclxyXG5cdFx0LnN0YXRlKCdyZWdpc3RyYXRpb24nLCB7XHJcblx0XHRcdHVybDogJy9yZWdpc3RyYXRpb24nLFxyXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWwtcmVnaXN0cmF0aW9uLmh0bWwnLFxyXG5cdFx0fSlcclxuXHRcdC5zdGF0ZSgnbG9naW4nLCB7XHJcblx0XHRcdHVybDogJy9sb2dpbicsXHJcblx0XHRcdHRlbXBsYXRlVXJsOiAncGFydGlhbC1sb2dpbi5odG1sJyxcclxuXHRcdH0pXHJcblx0XHQuc3RhdGUoJ3Byb2ZpbGUnLCB7XHJcblx0XHRcdHVybDogJy9wcm9maWxlJyxcclxuXHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFsLXByb2ZpbGUuaHRtbCcsXHJcblx0XHRcdHJlc29sdmU6IHsgbG9naW5SZXF1aXJlZDogbG9naW5SZXF1aXJlZCB9XHJcblx0XHR9KTtcclxuXHJcblxyXG5cdH1dKVxyXG5cdC5jb250cm9sbGVyKCdBcHBDdHJsJywgWyckc2NvcGUnLCAnJHRpbWVvdXQnLCAnJG1kU2lkZW5hdicsICckbG9nJywgJ2NvbnRyeVJFU1QnLGZ1bmN0aW9uKCRzY29wZSwgJHRpbWVvdXQsICRtZFNpZGVuYXYsICRsb2csY29udHJ5UkVTVCkge1xyXG5cdFx0JHNjb3BlLnRpdGxlID0gJ0hleSc7XHJcblx0XHQkc2NvcGUucHJvamVjdCA9IHtcclxuXHRcdFx0ZGVzY3JpcHRpb246ICcnLFxyXG5cdFx0XHRzcGVjaWFsOiB0cnVlXHJcblx0XHR9O1xyXG5cdFx0JHNjb3BlLnRvZ2dsZUxlZnQgPSBidWlsZERlbGF5ZWRUb2dnbGVyKCdsZWZ0Jyk7XHJcblx0XHRmdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBjb250ZXh0KSB7XHJcblx0XHRcdHZhciB0aW1lcjtcclxuXHJcblx0XHRcdHJldHVybiBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XHJcblx0XHRcdFx0dmFyIGNvbnRleHQgPSAkc2NvcGUsXHJcblx0XHRcdFx0YXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XHJcblx0XHRcdFx0JHRpbWVvdXQuY2FuY2VsKHRpbWVyKTtcclxuXHRcdFx0XHR0aW1lciA9ICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0dGltZXIgPSB1bmRlZmluZWQ7XHJcblx0XHRcdFx0XHRmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG5cdFx0XHRcdH0sIHdhaXQgfHwgMTApO1xyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGJ1aWxkRGVsYXllZFRvZ2dsZXIobmF2SUQpIHtcclxuXHRcdFx0cmV0dXJuIGRlYm91bmNlKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdCRtZFNpZGVuYXYobmF2SUQpXHJcblx0XHRcdFx0LnRvZ2dsZSgpXHJcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0JGxvZy5kZWJ1ZyhcInRvZ2dsZSBcIiArIG5hdklEICsgXCIgaXMgZG9uZVwiKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSwgMjAwKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBidWlsZFRvZ2dsZXIobmF2SUQpIHtcclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdCRtZFNpZGVuYXYobmF2SUQpXHJcblx0XHRcdFx0LnRvZ2dsZSgpXHJcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0JGxvZy5kZWJ1ZyhcInRvZ2dsZSBcIiArIG5hdklEICsgXCIgaXMgZG9uZVwiKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHR9XSlcclxuXHQuY29udHJvbGxlcignTGVmdEN0cmwnLCBbJyRzY29wZScsICckdGltZW91dCcsICckbWRTaWRlbmF2JywgJyRsb2cnLGZ1bmN0aW9uICgkc2NvcGUsICR0aW1lb3V0LCAkbWRTaWRlbmF2LCAkbG9nKSB7XHJcblx0XHQkc2NvcGUuY2xvc2UgPSAoKSA9PiB7XHJcblx0XHRcdCRtZFNpZGVuYXYoJ2xlZnQnKS5jbG9zZSgpXHJcblx0XHRcdC50aGVuKCgpID0+IHtcclxuXHRcdFx0XHQkbG9nLmRlYnVnKFwiY2xvc2UgTEVGVCBpcyBkb25lXCIpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9O1xyXG5cdH1dKVxyXG5cdC5jb250cm9sbGVyKCdMb2dpbkZvcm0nLFsnJHNjb3BlJywgJyRsb2NhdGlvbicsZnVuY3Rpb24oICRzY29wZSwgJGxvY2F0aW9uKXtcclxuXHRcdCRzY29wZS51c2VyID0ge1xyXG5cdFx0XHRlbWFpbDogJycsXHJcblx0XHRcdHBhc3M6ICcnLFxyXG5cdFx0fTtcclxuXHRcdHRoaXMuc3VibWl0ID0gKCk9PntcclxuXHRcdFx0bGV0IHVzZXJzID0gTFMuZ2V0KCd1c2VycycpIHx8IFtdO1xyXG5cdFx0XHRsZXQgdXNlciA9IG51bGw7XHJcblx0XHRcdGlmKCB1c2Vycy5zb21lKCAoZWwpPT4gKCRzY29wZS51c2VyLmVtYWlsID09PSBlbC5lbWFpbD8odXNlciA9IGVsLHRydWUpOiBmYWxzZSApICkgKXtcclxuXHRcdFx0XHRpZiggdXNlci5wYXNzID09PSAkc2NvcGUudXNlci5wYXNzKXtcclxuXHRcdFx0XHRcdExTLnNldCgnbG9naW4nLHRydWUpO1xyXG5cdFx0XHRcdFx0TFMuc2V0KCd1c2VyJyx1c2VyKTtcclxuXHRcdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvcHJvZmlsZScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHR9XSlcclxuXHQuY29udHJvbGxlcignUmVnaXN0cmF0aW9uRm9ybScsWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJyR0aW1lb3V0JywgJyRxJywgJyRsb2cnLCdjb250cnlSRVNUJyAsZnVuY3Rpb24oICRzY29wZSwgJGxvY2F0aW9uICwgJHRpbWVvdXQsICRxLCAkbG9nLGNvbnRyeVJFU1QgKXtcclxuXHRcdCRzY29wZS51c2VyID0ge1xyXG5cdFx0XHRuYW1lOiAnJyxcclxuXHRcdFx0ZW1haWw6ICcnLFxyXG5cdFx0XHRjb3VudHJ5OiAnJyxcclxuXHRcdFx0Y2l0eTogJycsXHJcblx0XHRcdHBhc3M6ICcnLFxyXG5cdFx0fVxyXG5cdFx0dGhpcy5xdWVyeVNlYXJjaCA9IChxdWVyeSxjb3VudHJ5KSA9PiB7XHJcblx0XHRcdGxldFxyXG5cdFx0XHRcdGZpZWxkcyA9IGNvdW50cnk/J25hbWUnOidjYXBpdGFsJyxcclxuXHRcdFx0XHR0eXBlID0gcXVlcnk/ZmllbGRzOidhbGwnLFxyXG5cdFx0XHRcdGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuXHRcdFx0bG9nKHR5cGUsZmllbGRzKTtcclxuXHRcdFx0Y29udHJ5UkVTVC5xdWVyeSh7XHJcblx0XHRcdFx0dHlwZSxcclxuXHRcdFx0XHRjb3VudHJ5OiBxdWVyeS50b0xvd2VyQ2FzZSgpLFxyXG5cdFx0XHRcdGZpZWxkc1xyXG5cdFx0XHR9LCByZXN1bHQgPT4ge1xyXG5cdFx0XHRcdGRlZmVycmVkLnJlc29sdmUoIHJlc3VsdCApO1xyXG5cdFx0XHR9LCBlcnJvciA9PiB7XHJcblx0XHRcdFx0bG9nKCAnZXJyb3InLGVycm9yICk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuXHRcdH1cclxuXHRcdHRoaXMuc2VsZWN0ZWRJdGVtQ2hhbmdlID0gb2JqID0+IHtcclxuXHRcdFx0JGxvZy5pbmZvKCdUZXh0IGNoYW5nZWQgdG8gJyArIEpTT04uc3RyaW5naWZ5KCBvYmogKSApO1xyXG5cdFx0XHRpZiggb2JqICYmIG9iai5uYW1lICkgJHNjb3BlLnVzZXIuY291bnRyeSA9IG9iai5uYW1lO1xyXG5cdFx0XHRpZiggb2JqICYmIG9iai5jYXBpdGFsICkgJHNjb3BlLnVzZXIuY2l0eSA9IG9iai5jYXBpdGFsO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5zZWFyY2hUZXh0Q2hhbmdlID0gb2JqID0+IHtcclxuXHRcdFx0JGxvZy5pbmZvKCdJdGVtIGNoYW5nZWQgdG8gJyArIEpTT04uc3RyaW5naWZ5KG9iaikpO1xyXG5cdFx0XHRpZiggb2JqICYmIG9iai5uYW1lICkgJHNjb3BlLnVzZXIuY291bnRyeSA9IG9iai5uYW1lO1xyXG5cdFx0XHRpZiggb2JqICYmIG9iai5jYXBpdGFsICkgJHNjb3BlLnVzZXIuY2l0eSA9IG9iai5jYXBpdGFsO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5zdWJtaXQgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRsZXQgdXNlcnMgPSBMUy5nZXQoJ3VzZXJzJykgfHwgW107XHJcblx0XHRcdGxldCBtaW4gPSAxO1xyXG5cdFx0XHRsZXQgbWF4ID0gMzA7XHJcblx0XHRcdCRzY29wZS51c2VyLmlkID0gTWF0aC5mbG9vciggTWF0aC5yYW5kb20oKSogKG1heCAtIG1pbikgKyBtaW4gKTtcclxuXHRcdFx0aWYoICF1c2Vycy5zb21lKCAoZWwpPT4gJHNjb3BlLnVzZXIuZW1haWwgPT09IGVsLmVtYWlsICkgKSB1c2Vycy5wdXNoKCAkc2NvcGUudXNlciApO1xyXG5cdFx0XHQkbG9jYXRpb24ucGF0aCgnL2xvZ2luJyk7XHJcblx0XHRcdExTLnNldCgndXNlcnMnLHVzZXJzKTtcclxuXHRcdH1cclxuXHR9XSlcclxuXHQuY29udHJvbGxlcignUHJvZmlsZUZvcm0nLFsnJHNjb3BlJywgJyR0aW1lb3V0JywgJyRxJywgJyRsb2cnLCdjb250cnlSRVNUJyAsZnVuY3Rpb24oICRzY29wZSwgJHRpbWVvdXQsICRxLCAkbG9nLGNvbnRyeVJFU1QgKXtcclxuXHRcdCRzY29wZS51c2VyID0gTFMuZ2V0KCd1c2VyJyk7XHJcblx0XHR0aGlzLnF1ZXJ5U2VhcmNoID0gKHF1ZXJ5LGNvdW50cnkpID0+IHtcclxuXHRcdFx0bGV0XHJcblx0XHRcdFx0ZmllbGRzID0gY291bnRyeT8nbmFtZSc6J2NhcGl0YWwnLFxyXG5cdFx0XHRcdHR5cGUgPSBxdWVyeT9maWVsZHM6J2FsbCcsXHJcblx0XHRcdFx0ZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG5cdFx0XHRjb250cnlSRVNULnF1ZXJ5KHtcclxuXHRcdFx0XHR0eXBlLFxyXG5cdFx0XHRcdGNvdW50cnk6IHF1ZXJ5LnRvTG93ZXJDYXNlKCksXHJcblx0XHRcdFx0ZmllbGRzOiAoIWNvdW50cnk/ZmllbGRzOmZpZWxkcyArICc7Y2FwaXRhbCcpXHJcblx0XHRcdH0sIHJlc3VsdCA9PiB7XHJcblx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZSggcmVzdWx0ICk7XHJcblx0XHRcdH0sIGVycm9yID0+IHtcclxuXHRcdFx0XHRsb2coICdlcnJvcicsZXJyb3IgKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5zZWxlY3RlZEl0ZW1DaGFuZ2UgPSBvYmogPT4ge1xyXG5cdFx0XHQkbG9nLmluZm8oJ1RleHQgY2hhbmdlZCB0byAnICsgSlNPTi5zdHJpbmdpZnkoIG9iaiApICk7XHJcblx0XHRcdGlmKCBvYmogJiYgb2JqLm5hbWUgKXtcclxuXHRcdFx0XHQkc2NvcGUudXNlci5jb3VudHJ5ID0gb2JqLm5hbWU7XHJcblx0XHRcdFx0dGhpcy5zZWFyY2hUZXh0Q2l0eSA9ICRzY29wZS51c2VyLmNpdHkgPSBvYmouY2FwaXRhbDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiggb2JqICYmIG9iai5jYXBpdGFsICkgJHNjb3BlLnVzZXIuY2l0eSA9IG9iai5jYXBpdGFsO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5zZWFyY2hUZXh0Q2hhbmdlID0gb2JqID0+IHtcclxuXHRcdFx0JGxvZy5pbmZvKCdJdGVtIGNoYW5nZWQgdG8gJyArIEpTT04uc3RyaW5naWZ5KG9iaikpO1xyXG5cdFx0XHRpZiggb2JqICYmIG9iai5uYW1lICkgJHNjb3BlLnVzZXIuY291bnRyeSA9IG9iai5uYW1lO1xyXG5cdFx0XHRpZiggb2JqICYmIG9iai5jYXBpdGFsICkgJHNjb3BlLnVzZXIuY2l0eSA9IG9iai5jYXBpdGFsO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5zdWJtaXQgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRsZXQgb2xkVXNlciA9IExTLmdldCgndXNlcicpO1xyXG5cdFx0XHRsZXQgdXNlcnMgPSBMUy5nZXQoJ3VzZXJzJykgfHwgW107XHJcblx0XHRcdExTLnNldCgndXNlcnMnLHVzZXJzLm1hcCggKGVsLGlkLGFycikgPT4gb2xkVXNlci5pZCA9PT0gZWwuaWQgPyAkc2NvcGUudXNlcjogZWwgKSk7XHJcblx0XHRcdExTLnNldCggJ3VzZXInLCAkc2NvcGUudXNlciApO1xyXG5cdFx0fVxyXG5cdH1dKVxyXG5cdC5mYWN0b3J5KCdjb250cnlSRVNUJyxbXHJcblx0XHQnJHJlc291cmNlJyxcclxuXHRcdCRyZXNvdXJjZSA9PiAkcmVzb3VyY2UoJ2h0dHBzOi8vcmVzdGNvdW50cmllcy5ldS9yZXN0L3YyLzp0eXBlLzpjb3VudHJ5Jyx7XHJcblx0XHRcdHR5cGU6ICdAdHlwZScsXHJcblx0XHRcdGNvdW50cnk6ICdAY291bnRyeScsXHJcblx0XHRcdGZpZWxkczogJ0BmaWVsZHMnXHJcblx0XHR9KVxyXG5cdF0pO1xyXG59KSgpOyJdfQ==

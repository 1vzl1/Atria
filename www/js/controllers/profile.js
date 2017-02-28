var app = angular.module('atria.controllers.profile', []);

/*********************************************************************
 * ProfileCtrl
 *********************************************************************/
app.controller('ProfileCtrl', function ($scope, $state, AuthService) {

	$scope.formData = {
		name: AuthService.user.attributes.name,
		email: AuthService.user.attributes.email
	};

	$scope.submit = function (form) {
		if (form.$valid) {
			console.log("ProfileCtrl::submit");
			AuthService.update($scope.formData).then(function () {
				$state.go("tab.profile");
			});
		}
	};

	$scope.edit = function () {
		console.log("ProfileCtrl::edit");
		$state.go("tab.edit");
	};

	$scope.tutorial = function(){
		console.log("ProfileCtrl::tutorial");
		$state.go("intro");
	};

	$scope.logout = function () {
		console.log("ProfileCtrl::logout");
		Parse.User.logOut();
		$state.go("start");
	};
});

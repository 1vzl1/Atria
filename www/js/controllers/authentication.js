var app = angular.module('atria.controllers.authentication', []);

/*********************************************************************
 * StartCtrl
 *********************************************************************/
app.controller('StartCtrl', function ($scope, $state, AuthService, $cordovaFacebook, $timeout) {

  $scope.curPage = 'start';

  $scope.formData = {
    "name": "",
    "email": "",
    "password": ""
  };

  $scope.showLoginPage = function () {
    $scope.curPage = 'null';
    $timeout(function () {
      $scope.curPage = 'login';
    }, 420);
  };

  $scope.showSignupPage = function () {
    $scope.curPage = 'null';
    $timeout(function () {
      $scope.curPage = 'signup';
    }, 420);
  };

  $scope.showStartPage = function () {
    $scope.curPage = 'null';
    $timeout(function () {
      $scope.curPage = 'start';
    }, 420);
  };

  $scope.login = function (form) {
    console.log("StartCtrl::login");
    if (form.$valid){
      AuthService.login($scope.formData.email, $scope.formData.password)
        .then(function (){
            if (window.localStorage['didTutorial'] === "true") {
                $state.go("tab.explore");
            } else {
                $state.go("intro");
            }
        });
    }

  };

  $scope.signup = function (form) {
    if (form.$valid){
      console.log("SignupCtrl::signup");
      AuthService.signup($scope.formData.email, $scope.formData.name, $scope.formData.password)
        .then(function(){
            if (window.localStorage['didTutorial'] === "true") {
                $state.go("tab.explore");
            } else {
                $state.go("intro");
            }
        });
    }
  };

});

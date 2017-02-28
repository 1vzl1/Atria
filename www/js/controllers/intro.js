var app = angular.module('atria.controllers.intro', []);

/*********************************************************************
 * IntroCtrl
 *********************************************************************/

app.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate) {
 
  // Called to navigate to the main app
  $scope.startApp = function() {
    window.localStorage['didTutorial'] = 'true';
    $state.go('tab.explore');
  };

  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };

  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };

});
var app = angular.module('atria.controllers.campaign', []);

/*********************************************************************
 * ProfileCtrl
 *********************************************************************/
app.controller('CampaignCtrl', function ($scope, $state, CampaignService, $ionicLoading) {

  if( CampaignService.curCampaign != null){
    $scope.curCampaign = {
      name: CampaignService.curCampaign.attributes.name,
      info: CampaignService.curCampaign.attributes.info
    };
  }

  $scope.join = function () {
    console.log("CampaignCtrl::join");

    $ionicLoading.show();
    CampaignService.join($scope.curCampaign).then(function () {
      $ionicLoading.hide();
      $state.go("tab.track");
    });
  }



  // $scope.submit = function (form) {
  //   if (form.$valid) {
  //     console.log("ProfileCtrl::submit");
  //     AuthService.update($scope.formData).then(function () {
  //       $state.go("tab.profile");
  //     });
  //   }
  // };

  // $scope.edit = function () {
  //   console.log("ProfileCtrl::edit");
  //   $state.go("tab.edit");
  // };

  // $scope.tutorial = function(){
  //   console.log("ProfileCtrl::tutorial");
  //   $state.go("intro");
  // };

  // $scope.logout = function () {
  //   console.log("ProfileCtrl::logout");
  //   Parse.User.logOut();
  //   $state.go("start");
  // };
});

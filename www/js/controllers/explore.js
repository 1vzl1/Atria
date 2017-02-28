var app = angular.module('atria.controllers.explore', ['angular-svg-round-progress'])
    .filter('millisecondsFilter', function() {
    	return function(input) {
    		if (input < 10) {
    			return input;
    		}
    		return (input/10).toFixed(2);
    	}
    });
;


/*********************************************************************
 * Explore page controller
 *********************************************************************/
app.controller('ExploreCtrl', function ($scope, $state, $ionicLoading, $ionicFilterBar, CampaignService) {
	$scope.campaigns = CampaignService;

	$ionicLoading.show();
	$scope.campaigns.load().then(function () {
		$ionicLoading.hide();
	});

	$scope.refreshItems = function () {
		$scope.campaigns.refresh().then(function () {
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	$scope.nextPage = function () {
		$scope.campaigns.next().then(function () {
			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	};

  $scope.viewCampaign = function (campaign) {
    console.log("ExploreCtrl::viewCampaign");

    $ionicLoading.show();
    CampaignService.get(campaign.attributes.name).then(function () {
      $ionicLoading.hide();
      $state.go("tab.joinCampaign");
    });
  };

  // Filter bar stuff
  $scope.filterBarInstance = null;
  $scope.showFilterBar = function () {
    console.log($scope.campaigns.results);

    filterBarInstance = $ionicFilterBar.show({
      items: $scope.campaigns.results,
      update: function (filteredItems) {
        $scope.campaigns.results = filteredItems;
      },                                                          // string.indexOf(substring) > -1
      expression: function (filterText, value, index, array) {
        return value.attributes.name.toLowerCase().indexOf(filterText.toLowerCase()) > -1;}
          // || value.attributes.info.toLowerCase().indexOf(filterText.toLowerCase()) > -1; }
    });
  };
});

/*********************************************************************
 * MealCreateCtrl
 *********************************************************************/
app.controller('MealCreateCtrl', function ($scope,
                                           $state,
                                           $ionicPopup,
                                           $ionicLoading,
                                           $cordovaCamera
                                           // MealService
                                           ) {

	$scope.resetFormData = function () {
		$scope.formData = {
			'title': '',
			'category': '',
			'calories': 29,
			'picture': null
		};
	};
	$scope.resetFormData();

	$scope.trackMeal = function (form) {
		if (form.$valid) {
			console.log("MealCreateCtrl::trackMeal");

			$ionicLoading.show();
			// MealService.track($scope.formData).then(function () {
			// 	$scope.resetFormData();
			// 	$ionicLoading.hide();
			// 	form.$setPristine(true);
			// 	$state.go("tab.meals");
			// });
		}
	};

	$scope.addPicture = function () {
		var options = {
			quality: 50,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.CAMERA, // CAMERA
			allowEdit: true,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 480,
			popoverOptions: CameraPopoverOptions,
			saveToPhotoAlbum: false
		};

		$cordovaCamera.getPicture(options).then(function (imageData) {
			$scope.formData.picture = imageData;
		}, function (err) {
			console.error(err);
			$ionicPopup.alert({
				title:'Error getting picture',
				subTitle: 'We had a problem trying to get that picture, please try again'
			});
		});
	};

	//tab swipe functinoality
	$scope.goForward = function () {
        var selected = $ionicTabsDelegate.selectedIndex();
        if (selected != -1) {
            $ionicTabsDelegate.select(selected + 1);
        }
    }

    $scope.goBack = function () {
        var selected = $ionicTabsDelegate.selectedIndex();
        if (selected != -1 && selected != 0) {
            $ionicTabsDelegate.select(selected - 1);
        }
    }

    $scope.workout_time_s = 10;
    $scope.max = $scope.workout_time_s;
    $scope.current = $scope.max;
    $scope.timerID;
    $scope.started = false;
    $scope.paused = false;

    $scope.setTimer = function () {
    	var timer = $scope.workout_time_s * 1000;
    	document.getElementById("CountDownPanel").innerHTML = timer.millisecondsToHundredthsString().slice(0, 5);
    	document.getElementById("millis").innerHTML = timer.millisecondsToHundredthsString().slice(6);
    }

    $scope.startTimer = function () {
    	var htos = "CountDownPanel";
    	var msid = "millis";
    	var timer = $scope.workout_time_s; //in seconds

    	if ($scope.started === false && $scope.paused === false) {
    		$scope.activateCountdown(htos, msid, timer);
    		$scope.started = true;
    	} else if ($scope.paused === false) {
    		$scope.paused = true;
    		$scope.pauseCountdown();
    	} else {
    		$scope.paused = false;
    		$scope.resumeCountdown();
    	}
    }

    $scope.activateCountdown = function(strContainerID, msid, initialValue) {
		var _countDownContainer = document.getElementById(strContainerID);
		var _millisecondContainer = document.getElementById(msid);
        $scope.timerID = new ATimer(initialValue * 1000, 20, CountDownComplete, CountDownTick);
        $scope.timerID.start();

	    function CountDownComplete() {
	        console.log("countdown complete");
	        $scope.started = false;
	        $scope.paused = false;
	    }

	    function CountDownTick(remaining) {
	        SetCountdownText(remaining);
	    }
	    function SetCountdownText(remaining) {
	    	var timer = remaining.millisecondsToHundredthsString();
	        _countDownContainer.innerHTML = timer.slice(0, 5);
	        _millisecondContainer.innerHTML = timer.slice(6);

	        var min = parseInt(timer.slice(0,2), 10);
	        var s = parseInt(timer.slice(3, 5), 10);
	        var total_ms = s + min*60;
	        if (total_ms != $scope.current) {
	        	$scope.$apply(function () {
					$scope.current = total_ms;
	        	});
	        }
	    }
    }

    $scope.pauseCountdown = function () {
    	$scope.timerID.pause();
    }

    $scope.resumeCountdown = function () {
    	$scope.timerID.resume();
    }
});

Number.prototype.millisecondsToHundredthsString = function () {
    /// <summary>Convert number of milliseconds into text with format MM:SS:hh</summary>
    /// <param name="this">Number of milliseconds</param>
    /// <returns type="Text" >Duration, text in format MM:SS:hh</<returns>
    var partMultipliers = [{ d: 60000, p: 100 }, { d: 1000, p: 100 }, { d: 10, p: 100}];
    var remainder = parseInt(this);
    return partMultipliers.reduce(function (prev, m, idx) {
        var quotient = Math.floor(remainder / m.d);
        remainder -= (quotient * m.d);
        return prev + ((idx == 0) ? "" : ":") + (quotient + m.p).toString().substr(1);
    }, "");
};

String.prototype.toMilliseconds = function () {
    /// <summary>Convert from string to number of milliseconds</summary>
    /// <param name="this">Duration, text in format MM:SS:mmm (mmm is milliseconds)</param>
    /// <returns type="Number">Number of milliseconds</returns>
    var partMultipliers = [1, 1000, 60000];
    var parts = this.split(":").reverse();
    return milliseconds = parts.reduce(function (prev, part, idx) {
        var res = (parseInt(part) * partMultipliers[idx]);
        return prev + res;
    }, 0);
};

function ATimer(milliseconds, optionalPeriod, optionalCallback, optionalUpdateCallback) {
    if (typeof ATimer != "function") return new ATimer.call(this, arguments);
    var timerInstance, duration = milliseconds, period = 20, count = 0, chunks, completer, updater;
    var self = this;
    if (typeof optionalPeriod == "number") {
        period = optionalPeriod;
        completer = optionalCallback;
        updater = optionalUpdateCallback;
    } else {
        completer = arguments[1];
        updater = arguments[2];
    }
    chunks = Math.floor(duration / period);

    function chunkComplete() {
    	count++;

        if (count >= chunks) {
            if (completer) completer.call(self, chunks, count);
        } else {
            var curr = new Date().getTime();
            var diff = (curr - startt) - (count * period);
            var remaining = Math.max(0, (duration - (curr - startt)));

            timerInstance = window.setTimeout(chunkComplete, (period - diff));
            if (updater) {
            	updater.call(self, remaining);
            }
        }
    }
    return {
        start: function () {
        	startt = new Date().getTime();
        	console.log(startt);
            timerInstance = window.setTimeout(chunkComplete, period);
        },
        pause: function () {
        	paused = new Date().getTime();
        	duration = duration - (paused - startt);
        	window.clearTimeout(timerInstance);
        },
        resume: function () {
        	startt = new Date().getTime();
        	timerInstance = window.setTimeout(chunkComplete, period);
        },
        cancel: function () {
            if (timerInstance) window.clearTimeout(timerInstance);
        },
    };
}


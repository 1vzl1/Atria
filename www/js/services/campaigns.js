var app = angular.module('atria.services.campaigns', []);

app.service("CampaignService", function ($q, AuthService, $ionicPopup) {
  var self = {
    'page': 0,
    'page_size': 20,
    'isLoading': false,
    'isSaving': false,
    'hasMore': true,
    'results': [],
    'curCampaign': null,

    'refresh': function () {
      self.page = 0;
      self.isLoading = false;
      self.isSaving = false;
      self.hasMore = true;
      self.results = [];
      return self.load();
    },

    'next': function () {
      self.page += 1;
      return self.load();
    },

    'load': function () {
      self.isLoading = true;
      var d = $q.defer();

      // Initialise Query
      var Campaign = Parse.Object.extend("Charity");
      var campaignQuery = new Parse.Query(Campaign);
      campaignQuery.ascending('name');

      // Paginate
      campaignQuery.skip(self.page * self.page_size);
      campaignQuery.limit(self.page_size);

      // Perform the query
      campaignQuery.find({
        success: function (results) {
          angular.forEach(results, function (item) {
            var campaign = new Campaign(item);
            self.results.push(campaign)
          });
          console.debug(self.results);

          // Are we at the end of the list?
          if (results.length == 0) {
            self.hasMore = false;
          }

          // Finished
          d.resolve();
        }
      });

      return d.promise;
    },

    'get': function (campaignName) {
      self.isLoading = true;
      var d = $q.defer();

      // Initialise Query
      var Campaign = Parse.Object.extend("Charity");
      var campaignQuery = new Parse.Query(Campaign);
      campaignQuery.equalTo('name', campaignName);

      // Perform the query
      campaignQuery.find({
        success: function (result) {
          self.curCampaign = new Campaign(result.shift());
          // Finished
          d.resolve();
        }
      });

      return d.promise;
    },

    'join': function (curCampaign) {
      self.isSaving = true;
      var d = $q.defer();

      var Campaign = Parse.Object.extend("Campaign");
      var user = AuthService.user;
      var charity = self.curCampaign;

      var campaign = new Campaign();
      campaign.set("owner", user);
      campaign.set("charity", charity);
      campaign.set("started", new Date());

      campaign.save(null, {
        success: function (campaign) {
          console.log("campaign joined");
          self.results.unshift(campaign);
          d.resolve(campaign);
        },
        error: function (item, error) {
          $ionicPopup.alert({
            title: "Error saving campaign",
            subTitle: error.message
          });
          d.reject(error);
        }
      });

      return d.promise;
    }
  };

  return self;
});

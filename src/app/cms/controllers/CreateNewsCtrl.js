'use strict';

angular
  .module('inspinia')
  .controller('CreateNewsCtrl', function ($state, $log, dataService, generalUtils, newsApi, imagesApi, summernoteConfig) {
    var vm = this;
    vm.NEW = true;

    init();

    vm.convertToDate = generalUtils.formatTimestampToDate;

    vm.uploadImage = function (attachedImage) {
      if (!attachedImage)
        return;

      vm.attachedImage = attachedImage;
      imagesApi.upload(attachedImage).then(function (response) {
        vm.article.image = response.data.path;
      });
    };

    vm.dropImageButtonClick = function () {
      vm.attachedImage = null;
      vm.article.image = null;
    };

    vm.create = function () {
      if (!vm.article.text)
        vm.article.text = '';

      vm.article.date = new Date().getTime();
      vm.article.author = dataService.getUser().contactProfile.id;
      vm.article.permission = 99;
      vm.article.description = vm.article.text.split("<hr>")[0];

      if (!vm.article.description)
        vm.article.description = '';

      vm.article.companyId = dataService.getCurrentCompanyId();

      newsApi.post(vm.article).then(function () {
        $state.go('index.cms');
      });
    };

    function init() {
      vm.createForm = {};
      vm.summernote = summernoteConfig;
      vm.article = vm.createForm;
    }
  });

//# sourceMappingURL=CreateNewsCtrl.js.map
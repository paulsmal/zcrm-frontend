'use strict';

angular
  .module('inspinia')
  .controller('CreatePageCtrl', function ($state, pagesApi, uploadImage, dataService, cmsPermissions, tinymceConfig, datepicker) {
    var vm = this;

    cmsPermissions.call(vm);
    uploadImage.call(vm);
    datepicker.call(vm);

    init();

    vm.submit = function () {
      vm.page.textToTemplateUrls();
      var body = vm.page.text;

      var page = {
        companyId: dataService.getCurrentCompanyId(),
        alias: vm.page.title,
        title: vm.page.title.substring(0, 255),
        author: {
          id: dataService.getUserId(),
          username: '',
          userLevel: -1
        },
        description: body.split("<hr>")[0].substring(0,255),
        image: vm.page.image,
        body: body,
        permission: vm.getPermissions(),
        creationTime: vm.datepicker.inputDate
      };

      pagesApi.post(page).then(goBack);
    };

    vm.cancel = goBack;

    function goBack() {
      $state.go('index.cmsPages');
    }

    function init() {
      vm.page = vm.createForm;
      vm.tinymceOptions = tinymceConfig.get(vm.page);
    }
  });

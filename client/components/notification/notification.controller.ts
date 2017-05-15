'use strict';

class NotificationController {

  constructor($scope, $location, notificationService, $uibModalInstance) {
    $scope.notificationService = notificationService;
    $scope.isArrayModal = JSON.parse($scope.notificationService.getIsArray());
    console.log(" $scope.isArrayModal " + $scope.isArrayModal);
    if($scope.isArrayModal){
        $scope.arrayModal = JSON.parse($scope.notificationService.getBodyArray());
    } else {
        $scope.textModal = $scope.notificationService.getBodyText();
    }
    $scope.titleModal = $scope.notificationService.getTitle();
     
      $scope.ok = function () {
        $uibModalInstance.close('ok');
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    }
}

angular.module('takeTurnsApp')
  .controller('NotificationController', NotificationController);
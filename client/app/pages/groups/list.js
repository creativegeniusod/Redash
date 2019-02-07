import { includes } from 'lodash';
import settingsMenu from '@/lib/settings-menu';
import { Paginator } from '@/lib/pagination';
import template from './list.html';


function GroupsCtrl($scope, $uibModal, currentUser, Group, $location, $routeParams, $http) {
  this.searchTerm = $location.search().q || '';
  $scope.currentUser = currentUser;
  $scope.groups = new Paginator([], { itemsPerPage: 20 });
  Group.query((groups) => {
    console.log('i got groups' + JSON.stringify(groups));
    console.log('i got call from here');
    $scope.groups.updateRows(groups);
  });

  $scope.newGroup = () => {
    $uibModal.open({
      component: 'editGroupDialog',
      size: 'sm',
      resolve: {
        group() {
          return new Group({});
        },
      },
    });
  };
  
  /*Send search terms to the python group api module*/ 
  $scope.search = (searchTerm) => {
    console.log('i am here search' + searchTerm);
    $http({
      url: 'api/groups',
      method: "GET",
      async: false,
      cache: false,
      isArray: true,
      params: {q: searchTerm}
      }).then(function successCallback(successResponse) {
        $scope.groups.updateRows(successResponse.data);
        console.log("SUCCESS" + JSON.stringify(successResponse.data));
      }, function errorCallback(errorResponse) {
        console.log("ERROR" + errorResponse);
      });
  }
}

export default function init(ngModule) {
  settingsMenu.add({
    permission: 'list_users',
    title: 'Groups',
    path: 'groups',
    order: 3,
  });

  ngModule.controller('GroupsCtrl', GroupsCtrl);

  return {
    '/groups': {
      template,
      controller: 'GroupsCtrl',
      title: 'Groups',
    },
  };
}

init.init = true;

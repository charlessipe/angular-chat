'use strict';

angular.module('angularChatApp')
  .controller('MainCtrl', function ($scope, $http, $firebaseObject, $firebaseArray) {

    var ref = new Firebase("https://angular-chatroom.firebaseio.com/"); // Instantiate the Firebase service with the new operator.

    // download the data into a local object
    $scope.data = $firebaseObject(ref);

    // create a synchronized array
    $scope.chat = $firebaseArray(ref);

    // synchronize the object with a three-way data binding
    //syncObject.$bindTo($scope, "data");

    $scope.addMessage = function() {
      $scope.chat.$add({
        name: 'Lo',
        city: 'addem'
        //content: $scope.newMessageText
      });
      $scope.chat.$save();
      $scope.newMessageText = '';
    }


    //$scope.activeRoom; 

    //$scope.chat = [
    //  {words: 'What is the purpose', stuff: 'jQuery'},
    //  {words: 'How to make a dropdown menu', stuff: 'style Bootstrap dropdown'}
    //];
    
    $scope.addChatText = function() {  // Function to add a chat input to the Firebase chat array
      var newChatLine = {
        username: "Joe",
        content: $scope.chatText
        //sentAt: moment().format("MMM Do, hh:mmA"),
        //roomId: "<ROOM UID HERE>"
      }

      $scope.chat.$add(newChatLine);  // Push input onto array
      $scope.chat.$save();
      $scope.chatText = '';  // Erases the input after submit
    }
    
    $scope.customers = [
      { name: 'Dave Jones', city: 'Phoenix' }, 
      { name: 'Jamie Riley', city: 'Atlanta' }, 
      { name: 'Heedy Wahlin', city: 'Chandler' },
      { name: 'Thomas Winter', city: 'Seattle' } 
    ];

  })

  
  .factory('Room', ['$firebase', function($firebase) { // Create a room factory

  var firebaseRef = new Firebase('https://angular-chatroom.firebaseio.com/');
  var rooms = $firebase(firebaseRef.child('rooms')).$asArray();

  return {
    all: rooms
  }

  $scope.messages;

  }])
  

  .controller('ModalDemoCtrl', function ($scope, $modal, $log) { // Modal example

  $scope.items = ['item1', 'item2', 'item3'];
  $scope.animationsEnabled = true;

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

  })

  // Please note that $modalInstance represents a modal window (instance) dependency.
  // It is not the same as the $modal service used above.

  .controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  });


//    $http.get('/api/things').success(function(awesomeThings) {
//      $scope.awesomeThings = awesomeThings;
//    });

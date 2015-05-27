'use strict';

angular.module('angularChatApp')

  .factory('Room', ["$firebaseObject", "$firebaseArray", function($firebaseObject, $firebaseArray) { // Create a room factory

  var firebaseRef = new Firebase('https://angular-chatroom.firebaseio.com/'); // ? add /rooms
  var rooms = $firebaseObject(firebaseRef.child('rooms')).$firebaseArray(); //.$asArray

  return {
    all: rooms  // Room function returns object literal {all: rooms}
  }

  }])

  .factory('Message', ['$firebase', function($firebase) {

  var firebaseRef = new Firebase('https://angular-chatroom.firebaseio.com/');
  var messages = $firebase(firebaseRef.child('messages')).$asArray();;

  return {
    send: function(newMessage) {
      // Send method logic
    }
  }
  }])


  .controller('MainCtrl', function ($scope, $http, $firebaseObject, $firebaseArray, Room) {

    var ref = new Firebase("https://angular-chatroom.firebaseio.com/"); // Instantiate the Firebase service with the new operator.
    
    var newArray = ref.child('newList'); // why doesn't this create a new array in firebase?

    var firebaseRef = new Firebase('https://angular-chatroom.firebaseio.com/rooms'); // why doesn't this create a new array in firebase?


    // download the data into a local object
    $scope.data = $firebaseObject(ref);

    // create a synchronized array
    $scope.chat = $firebaseArray(ref);

    // synchronize the object with a three-way data binding
    //syncObject.$bindTo($scope, "data");

    //$scope.roomList = rooms.all; // assign the array of objects retrieved by the all method to a $scope variable
    // not defined because Room not properly injected

    $scope.addMessage = function() {
      $scope.chat.$add({
        name: 'Jeremy Sipe',
        content: 'Hi, how are you doing?', 
        sentAt: moment().format("MMM Do, hh:mmA"), 
        roomName: 'Cool Room'
        //content: $scope.newMessageText
      });
      $scope.chat.$save();
      $scope.newMessageText = '';
    }

    $scope.addRoom = function() {  // Attempt to add room 
      $scope.roomList.$add({

      });
      $scope.chat.$save();
      $scope.newMessageText = '';
    }

    

    /*$scope.addChatText = function() {  // Function to add a chat input to the Firebase chat array
      var newChatLine = {
        username: "Joe",
        content: $scope.chatText,
        sentAt: moment().format("MMM Do, hh:mmA")
        //roomId: "<ROOM UID HERE>"
      }

      $scope.chat.$add(newChatLine);  // Push input onto array
      $scope.chat.$save();
      $scope.chatText = '';  // Erases the input after submit
    }*/
    /*
    $scope.customers = [
      { name: 'Dave Jones', city: 'Phoenix' }, 
      { name: 'Jamie Riley', city: 'Atlanta' }, 
      { name: 'Heedy Wahlin', city: 'Chandler' },
      { name: 'Thomas Winter', city: 'Seattle' } 
    ];
    */
  })

  .run(['$cookies', function($cookies) {

    if (!$cookies.blocChatCurrentUser || $cookies.blocChatCurrentUser === '' ) {
        // Do something to allow users to set their username
    }

    // open();  // open a modal to set a username

  }])
  


  // Don't know why I can't get rid of this controller
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



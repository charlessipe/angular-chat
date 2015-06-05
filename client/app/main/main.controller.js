'use strict';

// The active room should be stored in a $scope object in the main controller, 
// so that the title of the active room changes every time you visit a different room.

angular.module('angularChatApp')

  .factory('Room', ["$firebaseObject", "$firebaseArray", function($firebaseObject, $firebaseArray) { // Create a room factory

  var firebaseRef = new Firebase('https://angular-chatroom.firebaseio.com/'); 
  var rooms = $firebaseArray(firebaseRef.child('rooms'));

  //var rooms = $firebaseObject(firebaseRef.child('rooms')).$firebaseArray(); //.$asArray

  return {
    all: rooms,  // Room function returns object literal {all: rooms}
    messages: function(roomId) {
      //firebaseRef.orderByChild('roomId') {
        console.log('hi earth');
      //}

    }
  }

  }])


  .factory('Message', ['$firebase', function($firebase) {  // this factory may not be necessary

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

    //ref.orderByChild('roomId').equalTo('activeRoom').on('value', function() {
    //  console.log(chat.val());
    // });

    // download the data into a local object
    $scope.data = $firebaseObject(ref);

    // create a synchronized array
    $scope.chat = $firebaseArray(ref);

    // synchronize the object with a three-way data binding
    //syncObject.$bindTo($scope, "data");

    $scope.roomList = Room.all; // assign the array of objects retrieved by the all method to a $scope variable

    $scope.activeRoom = "Main Room";

    $scope.addRoom = function() {  // Attempt to add room 
      $scope.roomList.$add({
        name: $scope.newChatroomText,
        age: 7
      }); 
      $scope.roomList.$save();
    }

    $scope.addMessage = function() {
      var newContent = $scope.newContent;
      var activeRoom = $scope.activeRoom;
      var newMessage = {
        name: 'Charles Xavier',
        content: newContent, 
        sentAt: moment().format("MMM Do, hh:mmA"), 
        roomId: activeRoom
      };

      $scope.chat.$add(newMessage);
      $scope.chat.$save(newMessage);
      $scope.newContent = '';
    }

    $scope.changeRoom = function(start) {
      $scope.activeRoom = $scope.roomList[start].name;    
      //console.log($scope.activeRoom); 
    }

    // Query messages from activeRoom
    ref.orderByChild("roomId").equalTo($scope.activeRoom).on("child_added", function(snapshot) {
      console.log(snapshot.val());
    });

    /*$scope.showMessages = function() { 
      for(var i = 0; i < $scope.chat.length; i++) {
        if ($scope.chat[i].roomId == $scope.activeRoom) {
          console.log("This message is for current room"); // not showing anything in console.log
        }
      }
    }
    */

  })

  .run(['$cookies', function($cookies, $modal, $scope) {

    if (!$cookies.blocChatCurrentUser || $cookies.blocChatCurrentUser === '' ) {
        // Do something to allow users to set their username
        //$cookies.blocChatCurrentUser = $scope.userNameText;
      //$modal.open({
      // Modal configuration object properties
    //})

    }

    // open();  // open a modal to set a username

  }])
  


  // Don't know why I can't get rid of this controller
  .controller('ModalDemoCtrl', function ($scope, $modal, $log, Room) { // Modal example

  $scope.items = ['item1', 'item2', 'item3'];
  $scope.animationsEnabled = true;

    $scope.addRoom = function() {  // Attempt to add room 
      Room.all.$add({
        name: $scope.newChatroomText,
      }); 
      Room.all.$save();
    }

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'components/mypartials/my-room-modal.html', // 'myModalContent.html'
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



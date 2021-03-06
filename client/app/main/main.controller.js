'use strict';

angular.module('angularChatApp')

  .factory('Room', ["$firebaseObject", "$firebaseArray", function($firebaseObject, $firebaseArray) { // Create a room factory

  var firebaseRef = new Firebase('https://angular-chatroom.firebaseio.com/'); 
  var rooms = $firebaseArray(firebaseRef.child('rooms'));

  var thirdRef = new Firebase('https://angular-chatroom.firebaseio.com/');
  var messages = $firebaseArray(thirdRef.child('messages'));

  return {
    all: rooms,  // Room function returns object literal {all: rooms}
    message: messages
      //firebaseRef.orderByChild('roomId') {
      //}
  }

  }])
  
  .filter("relevantMessages", function() {  // filter to show only messages matching current room ($scope.activeRoom)
    return function(arrayOfMessages, currentRoom) {
      var out = [];
      for(var x=0; x<arrayOfMessages.length; x++){
        if(arrayOfMessages[x].roomId == currentRoom) {
          out.push(arrayOfMessages[x]);
        }
        return out;
      }
    }  

  })

  .filter('ordinal', function(){  // converts numbers in text input to ordinal
  return function(number){
    if(isNaN(number) || number < 1){
      return number;
    } else {
      var lastDigit = number % 10;
      if(lastDigit === 1){
        return number + 'st'
      } else if(lastDigit === 2){
        return number + 'nd'
      } else if (lastDigit === 3){
        return number + 'rd'
      } else if (lastDigit > 3){
        return number + 'th'
      }
    }
  }
  })

  .controller('MainCtrl', function ($scope, $http, $firebaseObject, $firebaseArray, Room) {

    var ref = new Firebase("https://angular-chatroom.firebaseio.com/"); // Instantiate the Firebase service with the new operator.

    // download the data into a local object
    $scope.data = $firebaseObject(ref);

    // create a synchronized array
    $scope.chat = $firebaseArray(ref);

    // synchronize the object with a three-way data binding
    //syncObject.$bindTo($scope, "data");

    $scope.roomList = Room.all; // assign the array of objects retrieved by the all method to a $scope variable
  
    $scope.messagesList = Room.message; // assign the array of objects retrieved by the all method to a $scope variable

    $scope.activeRoom = "Main Room";
    $scope.currentUser = "Anonymous User";

    $scope.containsComparator = function(expected, actual){ // custom comparator
      return actual.indexOf(expected) >-1;
    }

    $scope.filterByRoom = function(line){  // Unsucessful filter function
      return ($scope.activeRoom.indexOf(messagesList.roomId) !== -1);
    }

    $scope.addRoom = function() {   
      $scope.roomList.$add({
        name: $scope.newChatroomText
      }); 
      $scope.roomList.$save();
      $scope.newChatroomText = '';
    }

    $scope.addMessage = function() {
      var newContent = $scope.newContent;
      var activeRoom = $scope.activeRoom;
      var currentUser = $scope.currentUser;
      var newMessage = {
        name: currentUser,
        content: newContent, 
        sentAt: moment().format("MMM Do, hh:mmA"), 
        roomId: activeRoom
      };

      $scope.messagesList.$add(newMessage);
      $scope.messagesList.$save(newMessage);
      $scope.newContent = '';
    }

    $scope.changeRoom = function(start) {
      $scope.activeRoom = $scope.roomList[start].name;    
      //console.log($scope.activeRoom); 
    }

    $scope.changeUserName = function() {
      $scope.currentUser = $scope.newUserName;
      console.log($scope.currentUser);
      $scope.newUserName = '';
    }

  })

  .run(['$cookies', function($cookies, $modal, $scope) {

    if (!$cookies.currentUser || $cookies.currentUser === 'Logan Howlett' ) {
        // Do something to allow users to set their username
      console.log("Cookies are delicious");
    }

  }])

  .controller('ModalDemoCtrl', function ($scope, $modal, $log, Room) { // Modal example

  $scope.items = ['item1', 'item2', 'item3'];
  $scope.animationsEnabled = true;
  /*
    $scope.addRoom = function() {   
      $scope.roomList.$add({
        name: $scope.newChatroomText
      }); 
      $scope.roomList.$save();
    }
  */
  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'app/partials/modal-roomname.html', // 'myModalContent.html' 'app/partials/my-room-modal.html'
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (room) {
      console.log(room);
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



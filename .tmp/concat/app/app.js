'use strict';

angular.module('angularChatApp', [
  'ui.bootstrap',
  'firebase',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router'
])
  .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  }]);
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

  .controller('MainCtrl', ["$scope", "$http", "$firebaseObject", "$firebaseArray", "Room", function ($scope, $http, $firebaseObject, $firebaseArray, Room) {

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

  }])

  .run(['$cookies', function($cookies, $modal, $scope) {

    if (!$cookies.currentUser || $cookies.currentUser === 'Logan Howlett' ) {
        // Do something to allow users to set their username
        //$cookies.blocChatCurrentUser = $scope.userNameText;
      //$modal.open({
      // Modal configuration object properties
    //})
      console.log("Cookies are delicious");
    }
     
   // open();  // open a modal to set a username

  }])

  .controller('ModalDemoCtrl', ["$scope", "$modal", "$log", "Room", function ($scope, $modal, $log, Room) { // Modal example

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

  }])


  // Please note that $modalInstance represents a modal window (instance) dependency.
  // It is not the same as the $modal service used above.
  
  .controller('ModalInstanceCtrl', ["$scope", "$modalInstance", "items", function ($scope, $modalInstance, items) {

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
  
  
}]);



'use strict';

angular.module('angularChatApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  }]);
'use strict';

angular.module('angularChatApp')
  .factory('Modal', ["$rootScope", "$modal", function ($rootScope, $modal) {
    /**
     * Opens a modal
     * @param  {Object} scope      - an object to be merged with modal's scope
     * @param  {String} modalClass - (optional) class(es) to be applied to the modal
     * @return {Object}            - the instance $modal.open() returns
     */
    function openModal(scope, modalClass) {
      var modalScope = $rootScope.$new();
      scope = scope || {};
      modalClass = modalClass || 'modal-default';

      angular.extend(modalScope, scope);

      return $modal.open({
        templateUrl: 'components/modal/modal.html',
        windowClass: modalClass,
        scope: modalScope
      });
    }

    // Public API here
    return {

      /* Confirmation modals */
      confirm: {

        /**
         * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
         * @param  {Function} del - callback, ran when delete is confirmed
         * @return {Function}     - the function to open the modal (ex. myModalFn)
         */
        delete: function(del) {
          del = del || angular.noop;

          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed staight to del callback
           */
          return function() {
            var args = Array.prototype.slice.call(arguments),
                name = args.shift(),
                deleteModal;

            deleteModal = openModal({
              modal: {
                dismissable: true,
                title: 'Confirm Delete',
                html: '<p>Are you sure you want to delete <strong>' + name + '</strong> ?</p>',
                buttons: [{
                  classes: 'btn-danger',
                  text: 'Delete',
                  click: function(e) {
                    deleteModal.close(e);
                  }
                }, {
                  classes: 'btn-default',
                  text: 'Cancel',
                  click: function(e) {
                    deleteModal.dismiss(e);
                  }
                }]
              }
            }, 'modal-danger');

            deleteModal.result.then(function(event) {
              del.apply(event, args);
            });
          };
        }
      }
    };
  }]);

'use strict';

angular.module('angularChatApp')
  .controller('NavbarCtrl', ["$scope", "$location", function ($scope, $location) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  }]);
angular.module('angularChatApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/main/main.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=\"col-sm-3 chat-sidebar\"><h1 class=page-header>Chatrooms:</h1><p>Add a new room:</p><form><input ng-model=\"newChatroomText\"><button type=submit data-ng-click=addRoom()>Add Room</button></form><p>Enter your user name:</p><form><input ng-model=\"newUserName\"><button type=submit data-ng-click=changeUserName()>User Name</button></form><div ng-include=\"'app/partials/my-chatroom-list.html'\"></div></div><div class=col-sm-9><h2 class=page-header>Current Chatroom: {{activeRoom}}</h2><form><span>User Name: {{ currentUser }}</span><input ng-model=\"newContent\"><button type=submit data-ng-click=addMessage()>Add Message</button></form><p>{{ newContent | ordinal}}</p><ul class=show-chat-text><li ng-repeat=\"line in messagesList | filter:{roomId:activeRoom}:containsComparator \"><strong>Name:</strong> {{ line.name }} <strong>Message:</strong> {{ line.content }} <strong>Room:</strong> {{ line.roomId }} <strong>Time Sent:</strong> {{ line.sentAt }}</li></ul></div></div></div><footer class=footer><div class=container><p>Angular Fullstack v2.0.13 | <a href=https://twitter.com/tyhenkel>@tyhenkel</a> | <a href=\"https://github.com/DaftMonk/generator-angular-fullstack/issues?state=open\">Issues</a></p></div></footer>"
  );


  $templateCache.put('app/partials/modal-roomname.html',
    "<div class=modal-header><h3 class=modal-title>Enter Room</h3></div><div class=modal-body><form><input ng-model=\"newChatroomText\"><button type=submit data-ng-click=close(newChatroomText)>Add Room</button></form><p>{{ newChatroomText }}</p><!--\n" +
    "            <ul>\n" +
    "                <li ng-repeat=\"item in items\">\n" +
    "                    <a ng-click=\"selected.item = item\">{{ item }}</a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "            Selected: <b>{{ selected.item }}</b>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer\">\n" +
    "            <button class=\"btn btn-primary\" ng-click=\"ok()\">OK</button>\n" +
    "            <button class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</button>\n" +
    "\n" +
    "--></div><!--\n" +
    "    <button class=\"btn btn-default\" ng-click=\"open()\">Open me!</button>\n" +
    "    <button class=\"btn btn-default\" ng-click=\"open('lg')\">Large modal</button>\n" +
    "    <button class=\"btn btn-default\" ng-click=\"open('sm')\">Small modal</button>\n" +
    "    <button class=\"btn btn-default\" ng-click=\"toggleAnimation()\">Toggle Animation ({{ animationsEnabled }})</button>\n" +
    "    <div ng-show=\"selected\">Selection from a modal: {{ selected }}</div>\n" +
    "-->"
  );


  $templateCache.put('app/partials/modal-username.html',
    "<div class=modal-header><h3 class=modal-title>Enter User Name</h3></div><div class=modal-body><form><input ng-model=\"newChatroomText\"><button type=submit data-ng-click=addRoom()>Add Room</button></form><p>{{ newChatroomText }}</p><!--\n" +
    "            <ul>\n" +
    "                <li ng-repeat=\"item in items\">\n" +
    "                    <a ng-click=\"selected.item = item\">{{ item }}</a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "            Selected: <b>{{ selected.item }}</b>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer\">\n" +
    "            <button class=\"btn btn-primary\" ng-click=\"ok()\">OK</button>\n" +
    "            <button class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</button>\n" +
    "\n" +
    "--></div><!--\n" +
    "    <button class=\"btn btn-default\" ng-click=\"open()\">Open me!</button>\n" +
    "    <button class=\"btn btn-default\" ng-click=\"open('lg')\">Large modal</button>\n" +
    "    <button class=\"btn btn-default\" ng-click=\"open('sm')\">Small modal</button>\n" +
    "    <button class=\"btn btn-default\" ng-click=\"toggleAnimation()\">Toggle Animation ({{ animationsEnabled }})</button>\n" +
    "    <div ng-show=\"selected\">Selection from a modal: {{ selected }}</div>\n" +
    "-->"
  );


  $templateCache.put('app/partials/my-chatroom-list.html',
    "<!-- Input not working here but it works in main.html --><h3>Available Chatrooms</h3><ul class=show-room-names><li ng-repeat=\"rooms in roomList\"><a ui-sref=main ng-click=changeRoom($index)>{{ rooms.name}}</a></li></ul><!-- <ul ng-repeat=\"roomname in roomlist\">  add an ng-click ? \n" +
    "  <li> {{ roomname.all }} </li>\n" +
    "  <li> Me </li>\n" +
    "</ul>\n" +
    "-->"
  );


  $templateCache.put('components/modal/modal.html',
    "<div class=modal-header><button ng-if=modal.dismissable type=button ng-click=$dismiss() class=close>&times;</button><h4 ng-if=modal.title ng-bind=modal.title class=modal-title></h4></div><div class=modal-body><p ng-if=modal.text ng-bind=modal.text></p><div ng-if=modal.html ng-bind-html=modal.html></div></div><div class=modal-footer><button ng-repeat=\"button in modal.buttons\" ng-class=button.classes ng-click=button.click($event) ng-bind=button.text class=btn></button></div>"
  );


  $templateCache.put('components/navbar/navbar.html',
    "<div class=\"navbar navbar-default navbar-static-top\" ng-controller=NavbarCtrl><div class=container><div class=navbar-header><button class=navbar-toggle type=button ng-click=\"isCollapsed = !isCollapsed\"><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a href=\"/\" class=navbar-brand><span class=\"glyphicon glyphicon-phone\"></span> Angular Chat</a></div><div collapse=isCollapsed class=\"navbar-collapse collapse\" id=navbar-main><ul class=\"nav navbar-nav\"><li ng-repeat=\"item in menu\" ng-class=\"{active: isActive(item.link)}\"><a ng-href={{item.link}}>{{item.title}}</a></li></ul></div></div></div>"
  );

}]);


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

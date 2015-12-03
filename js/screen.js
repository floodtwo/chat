// StandBy Angular

var app = angular.module('chat', ["ngSanitize"]).run(function ($rootScope) {
    
});

app.controller('nav', function ($scope, $rootScope) {
    
    // ������ �α��� ȣ��
    // To_do : �ߺ����� ó�� 
    $scope.connect = function () {
        $scope.btn = 'change';
        socket.emit('start', { name: $scope.name });
        $rootScope.userName = $scope.name;

    }
});

app.controller('chatScreen',   function ($scope, $rootScope) {
    
    $scope.roomList = [{ roomNm: 'test', msg : 'test' }];
    $scope.chatMsg = '';
    $scope.currentRoom = '';

    $scope.inputMsg = function (event) {
        // �ش� ���ȣ�� ������ �;ߵ�         
        //var roomNm = 1;
        var roomNm = $rootScope.currentRoom;
        // chat���� ���� ���� �˾ƾߵ� =-= ������ �ڵ尡 ���������� =-
        //$scope.currentRoom = $rootScope.currentRoom;

        if (event.which == 13) {
            socket.emit('send_RoomMsg', { to: roomNm , msg: $scope.msg });
            $scope.msg = '';
        }
    }

    $scope.checkCurrentRoom = function () { 
        return $rootScope.currentRoom;
    };

});


app.controller('roomList', function ($scope, $rootScope) {
    
    // ������� Ŭ�������� ä�� �濡 ���� ������ ǥ�� =-=.. �޼������ �� �̷��� ���� 
    $scope.viewTextInScreen = function (room) { 
        
        // �ش���� ä�� ������ ���� ȭ�鿡 ǥ�� 
        var scope = angular.element($("#chatScreen")).scope();
        
        // ä�ù� ���� �ٲ�
        scope.chatTitle = room.user;
        
        room.msgCount = 0;

        // roomNm
        var roomList = scope.roomList;
        
        var scopeRoom = '';

        // ä�ù� ������ ���� 
        for (chatRoom in roomList) {
            if (roomList.hasOwnProperty(chatRoom)) {
                if (roomList[chatRoom].roomNm == room.roomNm) {
                    scopeRoom = roomList[chatRoom];
                    break;
                }
            }
        }
        
        scope.chatMsg = scopeRoom.msg;
        
        // ���� ���õ� ���� ����
        $rootScope.currentRoom = room.roomNm;

    }
});

app.controller('userList', function ($scope, $rootScope) {
    
    // ��������Ʈ���� ������ ����
    $scope.selectUser = function (scope) {
        var user = scope.user;
        // not work ng-show with user json??        
        scope.myVar = !scope.myVar;
        user.checked = !user.checked;
    };
    
    // üũ�� �ο��������� �� ����
    $scope.makeRoom = function () {
        
        var userinfo = $scope.userinfo;
        var targetUser = [];
        // check�� ������ ��ȸ
        var checkflag = true;
        for (user in userinfo) {
            if (userinfo.hasOwnProperty(user)) {
                if (userinfo[user].checked) {
                    targetUser.push({ name : userinfo[user].name });
                    checkflag = false;
                }
            }
        }
        if (checkflag) {
            alert("please check user");
            return;
        }
        
        // �ڱ� �ڽ��� ���� 
        targetUser.push({ name : $rootScope.userName });
        socket.emit('makeRoom', targetUser);
    }
    
    // Active User���� �ڱ� �ڽ��� ������ �ʵ��� ���͸� 
    $scope.userfilterFn = function (user) {
        if (user.name != $rootScope.userName) {
            return true;
        }
        return false;
    }
});


app.directive('chatWindow', function () {
    return {
        restrict: 'E',
        templateUrl: 'html/chatWindow.html'
    };
});


app.directive('chatInput', function () {
    return {
        restrict: 'E',
        templateUrl: 'html/chatInput.html'
    };
});

app.directive('roomList', function () {
    return {
        restrict: 'E',
        templateUrl: 'html/roomList.html'
    };
});

app.directive('userList', function () {
    return {
        restrict: 'E',
        templateUrl: 'html/userList.html'
    };
});

////

function objToString(obj) {
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + '::' + obj[p] + '\n';
        }
    }
    return str;
}



function getJSONSize(obj) {
    var returnCount = 0;
    for (el in obj) {
        if (obj.hasOwnProperty(el)) {
            returnCount++;
        }
    }
    return returnCount;
}
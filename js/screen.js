// StandBy Angular

var app = angular.module('chat', ["ngSanitize"]).run(function ($rootScope) {
    
});

app.controller('nav', function ($scope, $rootScope) {
    
    // 서버에 로그인 호출
    // To_do : 중복유저 처리 
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
        // 해당 방번호를 가지고 와야됨         
        //var roomNm = 1;
        var roomNm = $rootScope.currentRoom;
        // chat에서 현재 방을 알아야됨 =-= 갈수록 코드가 지저분해짐 =-
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
    
    // 방재목을 클릭했을때 채팅 방에 방의 내용을 표시 =-=.. 메서드명을 왜 이렇게 햇지 
    $scope.viewTextInScreen = function (room) { 
        
        // 해당방의 채팅 내용을 메인 화면에 표시 
        var scope = angular.element($("#chatScreen")).scope();
        
        // 채팅방 제목 바꿈
        scope.chatTitle = room.user;
        
        room.msgCount = 0;

        // roomNm
        var roomList = scope.roomList;
        
        var scopeRoom = '';

        // 채팅방 내용을 변경 
        for (chatRoom in roomList) {
            if (roomList.hasOwnProperty(chatRoom)) {
                if (roomList[chatRoom].roomNm == room.roomNm) {
                    scopeRoom = roomList[chatRoom];
                    break;
                }
            }
        }
        
        scope.chatMsg = scopeRoom.msg;
        
        // 현재 선택된 방을 저장
        $rootScope.currentRoom = room.roomNm;

    }
});

app.controller('userList', function ($scope, $rootScope) {
    
    // 유저리스트에서 유저를 선택
    $scope.selectUser = function (scope) {
        var user = scope.user;
        // not work ng-show with user json??        
        scope.myVar = !scope.myVar;
        user.checked = !user.checked;
    };
    
    // 체크된 인원기준으로 방 생성
    $scope.makeRoom = function () {
        
        var userinfo = $scope.userinfo;
        var targetUser = [];
        // check된 유저만 조회
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
        
        // 자기 자신을 포함 
        targetUser.push({ name : $rootScope.userName });
        socket.emit('makeRoom', targetUser);
    }
    
    // Active User에서 자기 자신은 나오지 않도록 필터링 
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
// Set Site URL
var socket = io.connect('http://localhost:8080');

// Userlist
// receive data and userlist refresh 
socket.on('refreshUserList', function (data) {
    
    var users = data.users;
    var scope = angular.element($("#userList")).scope();
    scope.userinfo = data;
    scope.$apply();
});


// 채팅방 생성 알림 
socket.on('createRoom', function (data) {
    
    var scope = angular.element($("#roomList")).scope();
    
    // ToDo: remove Login UserName
    // ToDo: remove Same Chatting Room
    if (scope.roomList == undefined) {
        scope.roomList = data;
    } else { 
        scope.roomList.push(data[0]);
    }
    
    // 방 리스트 등록후 채팅 스코프에 방을 신규 등록 
    var scope2 = angular.element($("#chatScreen")).scope();
    
    // 한글이 깨짐 =-= ㅋㅋㅋ
    scope2.roomList.push({ roomNm : data[0].roomNm , msg: '' });
    
    scope.$apply();
    scope2.$apply();

});



// 메세지 받은후 알림 
socket.on('rcv_msg', function (data ) {
    
    var scope = angular.element($("#chatScreen")).scope();
    
    var rcvRoomNm = data.to;
    var rcvMsg = data.msg;
    var roomList = scope.roomList;
    var scopeRoom = '';
    // 채팅 룸이 등록되어 있지 않으면 새로 등록 
    for (room in roomList) {
        if (roomList.hasOwnProperty(room)) {
            if (roomList[room].roomNm == rcvRoomNm ) {
                scopeRoom = roomList[room];
                break;
            }
        }
    }
    
    if (scopeRoom == '') {
        roomList.push({ roomNm : rcvRoomNm , msg: data.msg });
    } else { 
        scopeRoom.msg = scopeRoom.msg + "<br>" + rcvMsg
    }
    
    // 현재 보고 있는 창에게 메세지가 오면 화면에 출력 
    if (scope.checkCurrentRoom() == rcvRoomNm) { 
        scope.chatMsg = scopeRoom.msg;
     
     // 현재 보고 있는 화면이 아니라면은 알림 표시 
    }else {
        var roomScope = angular.element($("#roomList")).scope();
        var roomScopeList = roomScope.roomList;
        var roomScopeRoom ;
        // ToDo : 이거 나중에 공통함수로 만들꺼임 =-=   
        for (room in roomScopeList) {
            if (roomScopeList.hasOwnProperty(room)) {
                if (roomScopeList[room].roomNm == rcvRoomNm) {
                    roomScopeRoom = roomScopeList[room];
                    break;
                }
            }
        }
        roomScopeRoom.msgCount = roomScopeRoom.msgCount + 1;
        roomScope.$apply();    
    }

    
    scope.$apply();
    // 스크롤을 맨 하단으로 고정 
    $("#chatBox").scrollTop($("#chatBox")[0].scrollHeight);
   
});

// 메세지 전송 
$("#msgbox").keyup(function (event) {
    //  get Active Room Number
     if (event.which == 13) {
     
        socket.emit('send_RoomMsg', { to: roomNm , msg: $('#msgbox').val() });
        $('#msgbox').val('');
    }
});


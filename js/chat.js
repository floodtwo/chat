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


// ä�ù� ���� �˸� 
socket.on('createRoom', function (data) {
    
    var scope = angular.element($("#roomList")).scope();
    
    // ToDo: remove Login UserName
    // ToDo: remove Same Chatting Room
    if (scope.roomList == undefined) {
        scope.roomList = data;
    } else { 
        scope.roomList.push(data[0]);
    }
    
    // �� ����Ʈ ����� ä�� �������� ���� �ű� ��� 
    var scope2 = angular.element($("#chatScreen")).scope();
    
    // �ѱ��� ���� =-= ������
    scope2.roomList.push({ roomNm : data[0].roomNm , msg: '' });
    
    scope.$apply();
    scope2.$apply();

});



// �޼��� ������ �˸� 
socket.on('rcv_msg', function (data ) {
    
    var scope = angular.element($("#chatScreen")).scope();
    
    var rcvRoomNm = data.to;
    var rcvMsg = data.msg;
    var roomList = scope.roomList;
    var scopeRoom = '';
    // ä�� ���� ��ϵǾ� ���� ������ ���� ��� 
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
    
    // ���� ���� �ִ� â���� �޼����� ���� ȭ�鿡 ��� 
    if (scope.checkCurrentRoom() == rcvRoomNm) { 
        scope.chatMsg = scopeRoom.msg;
     
     // ���� ���� �ִ� ȭ���� �ƴ϶���� �˸� ǥ�� 
    }else {
        var roomScope = angular.element($("#roomList")).scope();
        var roomScopeList = roomScope.roomList;
        var roomScopeRoom ;
        // ToDo : �̰� ���߿� �����Լ��� ���鲨�� =-=   
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
    // ��ũ���� �� �ϴ����� ���� 
    $("#chatBox").scrollTop($("#chatBox")[0].scrollHeight);
   
});

// �޼��� ���� 
$("#msgbox").keyup(function (event) {
    //  get Active Room Number
     if (event.which == 13) {
     
        socket.emit('send_RoomMsg', { to: roomNm , msg: $('#msgbox').val() });
        $('#msgbox').val('');
    }
});


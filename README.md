# socket.io 이용한 chat 앱 구현

## 이슈

### 1. socket.adapter.rooms[roomId] VS socket.adapter.rooms.get(roomId)

#### 이슈 > 참여자가 모두 나가지 않았음에도 불구하고 참여자수가 0으로 나와 방 관련 정보가 database에서 사라짐

#### 해결 > socket.adapter.roooms[roomId].length에 대한 문제였다  
우선 socket.adapter.rooms는 Map을 사용하고 있다. 따라서 roomId인 방에 참여하고 있는 socket의 정보를 접근하기 위해서는 socket.adapter.rooms.get(roomId)를 사용해야 한다. get은 JS Map에 접근하여 데이터를 얻는 방법이다. 이렇게 Map에 저장된 데이터를 접근하면 Set으로 socket 아이디(확실하지 않습니다)가 저장되어 있는 것을 확인할 수 있는데 지금 사용할 때 중요한 것은 어떤 socket이 접속해 있는냐가 아니라 얼마나 접속해 있느냐이기 때문에 크기를 알아야 합니다. Set의 크기를 알 수 있는 방법은 size를 사용하는 것이다.

### 2. 데이터베이스에서 row 제거시 foreign key 문제

이슈 > await Room.destroy를 먼저 사용했더니 await Chat.destroy가 제대로 사용되지 않았다.

해결 > 이 이슈는 await Chat.destory를 await Room.destroy 보다 먼저 사용하여 해결하였다. 문제의 원인은 chat 테이블이 Room 테이블의 ID를 foreign key로 사용하는 것에 있는 것 같다. Room 테이블의 row가 제거되면 어떻게 할지 아무것도 설정하지 않았기 때문이다.

on delete cascade & on update cascade >
cascade : 참조되는 테이블에서 데이터를 삭제하거나 수정하면, 참조하는 테이블에서도 삭제와 수정이 같이 이루어진다
(참고)
set null : 참조되는 테이블에서 데이터를 삭제하거나 수정하면, 참조하는 테이블의 데이터는 NULL로 변경된다.
no action : 참조되는 테이블에서 데이터를 삭제하거나 수정해도, 참조하는 테이블의 데이터는 변경되지 않는다.

시퀄라이즈 적요 >
hasMany에 onDelete: 'CASCADE', hooks: true를 작성해 주었다. 왜 belongsTo에는 onDelete가 적용되지 않는지 모르겠다

### 3. 데이터베이스 스키마 변경시 데이터배이스 반영 문제

# socket.io 이용한 chat 앱 구현

## 이슈

### 1. socket.adapter.rooms[roomId] VS socket.adapter.rooms.get(roomId)

#### 이슈 > 참여자가 모두 나가지 않았음에도 불구하고 참여자수가 0으로 나와 방 관련 정보가 database에서 사라짐

#### 해결 > socket.adapter.roooms[roomId].length에 대한 문제였다  
우선 socket.adapter.rooms는 Map을 사용하고 있다. 따라서 roomId인 방에 참여하고 있는 socket의 정보를 접근하기 위해서는 socket.adapter.rooms.get(roomId)를 사용해야 한다. get은 JS Map에 접근하여 데이터를 얻는 방법이다. 이렇게 Map에 저장된 데이터를 접근하면 Set으로 socket 아이디(확실하지 않습니다)가 저장되어 있는 것을 확인할 수 있는데 지금 사용할 때 중요한 것은 어떤 socket이 접속해 있는냐가 아니라 얼마나 접속해 있느냐이기 때문에 크기를 알아야 합니다. Set의 크기를 알 수 있는 방법은 size를 사용하는 것이다.

### 2. 데이터베이스에서 row 제거시 foreign key 문제

### 3. 데이터베이스 스키마 변경시 데이터배이스 반영 문제

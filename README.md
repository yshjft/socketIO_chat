# socket.io 이용한 chat 앱 구현

## 이슈

### 1. socket.adapter.rooms[roomId] VS socket.adapter.rooms.get(roomId)

#### 이슈 > 참여자가 모두 나가지 않았음에도 불구하고 참여자수가 0으로 나와 방 관련 정보가 database에서 사라짐

#### 해결 > socket.adapter.roooms[roomId].length에 대한 문제였다

우선 socket.adapter.rooms는 Map을 사용하고 있다. 따라서 roomId인 방에 참여하고 있는 socket의 정보를 접근하기 위해서는 socket.adapter.rooms.get(roomId)를 사용해야 한다. get은 JS Map에 접근하여 데이터를 얻는 방법이다.
이렇게 Map에 저장된 데이터를 접근하면 Set으로 socket 아이디(확실하지 않습니다)가 저장되어 있는 것을 확인할 수 있는데 지금 사용할 때 중요한 것은 어떤 socket이 접속해 있는냐가 아니라 얼마나 접속해 있느냐이기 때문에 크기를 알아야 합니다. Set의 크기를 알 수 있는 방법은 size를 사용하는 것입니다.

### 2. 데이터베이스에서 row 제거시 foreign key 문제

#### 이슈 > await Room.destroy를 먼저 사용했더니 await Chat.destroy가 제대로 사용되지 않았다.

#### 해결 > 이 이슈는 await Chat.destory를 await Room.destroy 보다 먼저 사용하여 해결하였다. 문제의 원인은 chat 테이블이 Room 테이블의 ID를 foreign key로 사용하는 것에 있는 것 같다. Room 테이블의 row가 제거되면 어떻게 할지 아무것도 설정하지 않았기 때문이다.

on delete cascade & on update cascade >  
cascade : 참조되는 테이블에서 데이터를 삭제하거나 수정하면, 참조하는 테이블에서도 삭제와 수정이 같이 이루어진다

(참고)  
set null : 참조되는 테이블에서 데이터를 삭제하거나 수정하면, 참조하는 테이블의 데이터는 NULL로 변경된다.
no action : 참조되는 테이블에서 데이터를 삭제하거나 수정해도, 참조하는 테이블의 데이터는 변경되지 않는다.

시퀄라이즈 적용 >  
hasMany에 onDelete: 'CASCADE', hooks: true를 작성해 주었다. 왜 belongsTo에는 onDelete가 적용되지 않는지 모르겠다.

### 3. 데이터베이스 스키마 변경시 데이터배이스 반영 문제

#### 이슈 > 개발 과정 중 실수로 테이블에서 컬럼 하나를 빼먹었다.

#### 해결 > 아무것도 몰라서 그냥 데이터베이스를 지우고 model을 수정한 뒤 새로 데이터베이스를 생성하였다.

#### 다른 방법 > 1. Sequelize.sync({force: true})
가장 간단한 방법이다. 컬럼을 직접 변경 (스키가 정의한 파일을 변경)하면 자동을 데이터 베이스를 갱신해준다. 물론 기존에 있던 데이터는 모두 사라지게 된다. 따라서 서비스 중에는 적합하지 않은 방식이며 굉장히 조심해야하는 옵션이다.

#### 다른 방법 > 2. Sequelize 마이그레이션
그래서 다른 방법을 찾아보니 마이그레이션이라는 방법이 있었다. 사용 방법은 아래와 같다.

1 ) mirgrations 폴더 생성(사실 sequelize init하면 자동으로 생성된다)

2 ) sequelize migration:create --name '사용할 이름'

3 ) 2번 명령어로 생성된 파일에 아래와 같은 예시로 작성

ex) 컬럼 1개 추가 (User라는 테이블에 nickname이라는 컬럼 추가)
```
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn("User", "nickname", {
      type: Sequelize.STRING,
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn("User", "nickname")
  },
}
```
up() 메서드 : 새로운 컬럼 추가하는 부분
down() 메서드 : 추가한 컬럼 삭하는 부분

4-1) sequelize db:migrate --env development
마이그레이션을 진행하는 명령어이다. 뒤에 env 옵션이다. 위 명령어를 통해 마이그레이션을 진행하게 되면 SequelizeMeta라는 테이블이 데이터베이스에 생성된다. 마이그레이션을 수행하면 그 마이그레이션의 파일명을 SequelizeMeta 테이블에 기록한다. 반대로 마이그래이션을 취소하면 테이블에 해당 파일명을 삭제한다.

4-2) sequelize db:migrate:undo --env development : 마이그레이션 취소

추가 ) 다중 마이그레이션 
```
module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn("User", "name", {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn("User", "nickname", {
        type: Sequelize.STRING,
      }),
    ]
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn("Challenges", "name"),
      queryInterface.removeColumn("Challenges", "nickname"),
    ]
  },
}
```
```
module.exports = {
  up: function (queryInterface, Sequelize) {
    var sql = "ALTER TABLE User ADD COLUMN nickname varchar(255) NOT NULL"

    return queryInterface.sequelize.query(sql, {
      type: Sequelize.QueryTypes.RAW,
    })
  },

  down: function (queryInterface, Sequelize) {
    var sql = "ALTER TABLE User DROP COLUMN nickname"

    return queryInterface.sequelize.query(sql, {
      type: Sequelize.QueryTypes.RAW,
    })
  },
}

```
참고 : https://jeonghwan-kim.github.io/sequelize-migration/

#### 의문점 >
1. 테이블 추가 (테이블 추가에 따른 foreign key 설정 등)

답변 > 
```
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Person', {
      name: Sequelize.DataTypes.STRING,
      isBetaMember: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Person');
  }
};
```

foreign key 가지는 경우
```
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Person', {
      name: Sequelize.DataTypes.STRING,
      isBetaMember: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      userId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'users',
            schema: 'schema'
          },
          key: 'id'
        },
        allowNull: false
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Person');
  }
}
```

/*----------------
  name : DT_USRM Table
  desc : 사용자등록룸 테이블
  pram : 
  /*----------------*/ 
  var DT_USRM = sequelize.define('ooodmusrm', {
    ROOM_ID:{
          type: Sequelize.STRING,
          primaryKey: true
    },
    USR_ID:{
          type: Sequelize.STRING,
          primaryKey: true
    },
    COMP_CD : {
      type: Sequelize.STRING,
      foreignKey: true
    },
    SUC_YN:{
          type: Sequelize.STRING
    },
    EXC_TIME:{
          type: Sequelize.STRING
    },
    STORY_VAL:{
      type: Sequelize.STRING
    },
    LEVEL_VAL:{
      type: Sequelize.STRING
    },
    HORROR_VAL:{
      type: Sequelize.STRING
    },
    ACT_VAL:{
      type: Sequelize.STRING
    },
    TOTAL_VAL:{
      type: Sequelize.STRING
    }
}, {
    freezeTableName: true, // Model tableName will be the same as the model name
    timestamps: false
});


  /*----------------
  name : DT_ROOM Table
  desc : 방 테이블
  pram : 
  /*----------------*/ 
    var DT_ROOM = sequelize.define('ooodmroom', {
      ROOM_ID:{
            type: Sequelize.STRING, 
            primaryKey: true,
      },
      COMP_CD : {
        type: Sequelize.STRING,
        foreignKey: true,
        autoIncrement: true, 
      },
      ROOM_NAME:{
            type: Sequelize.STRING
      },
      SEQ:{
            type: Sequelize.STRING
      },
      LEVEL:{
            type: Sequelize.INTEGER
      },
      ROOM_INFO:{
        type: Sequelize.STRING
      }
      
}, {
      freezeTableName: true, // Model tableName will be the same as the model name
      timestamps: false
});

  /*----------------
  name : DT_COMP Table
  desc : 업체 테이블
  pram : 
  /*----------------*/ 
  var DT_COMP = sequelize.define('ooodmcomp', {
    COMP_CD : {
          type: Sequelize.STRING,
          primaryKey: true,
          autoIncrement: true
    },
    COMP_NAME:{
          type: Sequelize.STRING
    },
    COMP_INFO:{
          type: Sequelize.STRING
    },
    SEQ:{
          type: Sequelize.STRING
    }
}, {
    freezeTableName: true, // Model tableName will be the same as the model name
    timestamps: false
});





/*----------------
  name : DT_FAVT Table
  desc : ㅈㅡㄹㄱㅕㅊㅏㅈㄱㅣ 테이블
  pram : 
  /*----------------*/ 
  var DT_FAVT = sequelize.define('ooodmfavt', {
      COMP_CD : {
            type: Sequelize.STRING,
            primaryKey: true
      },
      USR_ID:{
            type: Sequelize.STRING,
            primaryKey: true
      },
      FAV_YN:{
            type: Sequelize.STRING
      },
      FIRST_USR_ID:{
            type: Sequelize.STRING
      },
      FIRST_SYS_DTM:{
        type: Sequelize.DATE
      },
      LAST_USR_ID:{
        type: Sequelize.STRING
      },
      LAST_SYS_DTM:{
        type: Sequelize.DATE
      }
  }, {
      freezeTableName: true, // Model tableName will be the same as the model name
      timestamps: false
  });
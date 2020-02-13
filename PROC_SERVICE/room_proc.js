var mysql = require('mysql');
var orm = require("orm");
var squel = require("squel");
//var table = require("../dataBase/dataTable.js")


// host     : 'localhost',
// user     : 'root',
// password : '1234qwer!',
// database : 'roomesc',

//var hostName = '10.0.0.1';
// var hostName = 'localhost';
// var user = 'tk32189';
// var database = 'tk32189';
// var password = 'snack539223..';
// var port = '3306';

// var hostName = 'localhost';
// var user = 'root';
// var database = 'roomesc';
// var password = '1234qwer!';
// var port = '3306';


//--------------------------------------------
// 리얼 디비 정보
var hostName = '10.0.0.1';
var user = 'tk32189';
var database = 'tk32189';
var password = 'snack539223!';
var port = '3306';
//--------------------------------------------

var express = require('express');
var bodyParser = require('body-parser');
var Sequelize = require("sequelize");
var sequelize = new Sequelize(database, user, password, {
  host: hostName,
  port: port,
  dialect: 'mysql',
  pool: { max: 5, min: 0, idle: 5 },
});

var conn = mysql.createConnection({
  host: hostName,
  user: user,
  password: password,
  database: database,
  port: port,
  insecureAuth: true
});

conn.connect();

//===== MySQL 데이터베이스 연결 설정 =====//
var pool = mysql.createPool({
  connectionLimit: 10,
  host: hostName,
  user: user,
  password: password,
  database: database,
  port: port,
  debug: true
});


var testquery;

var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var fs = require('fs');

var xml = fs.readFileSync(__dirname + '/../query/query.xml', 'utf-8');
var sqlResult = "";

parser.parseString(xml, function (err, result) {

  sqlResult = result;

  console.log(sqlResult);

  // var query = "";
  // for (var i = 0; i <result.list.item.length; i++) {
  //   if (result.list.item[i].id == "test111")
  //   {
  //     query = result.list.item[i]['description'][0];
  //   }
  //  }

  // console.log(query);
});

/*----------------
name : Idㅇㅔ ㅎㅐㄷㅏㅇㅎㅏㄴㅡㄴ ㅋㅜㅓㄹㅣ ㄹㅣㅌㅓㄴ
desc : 룸을 조회하는 화면
pram : 
/*----------------*/
const queryFinder = function (id) {
  console.log("test!!!!!!");
  console.log(sqlResult);
  var query;
  for (var i = 0; i < sqlResult.list.item.length; i++) {
    if (sqlResult.list.item[i].id == id) {
      query = sqlResult.list.item[i]['description'][0];
    }
  }


  console.log(query);

  return query;

}






const test = function (req, res) {
  console.log("test : ");

  // 커넥션 풀에서 연결 객체를 가져옴
  pool.getConnection(function (err, conn) {
    if (err) {
      if (conn) {
        conn.release();  // 반드시 해제해야 함
      }

      callback(err, null);
      return;
    }
    console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

    // 데이터를 객체로 만듦
    //var data = {id:id, name:name, age:age, password:password};

    var sql = 'select * from ooodmroom';
    // SQL 문을 실행함
    var exec = conn.query(sql, function (err, result) {
      conn.release();  // 반드시 해제해야 함
      console.log('실행 대상 SQL : ' + exec.sql);

      if (err) {
        console.log('SQL 실행 시 에러 발생함.');
        console.dir(err);

        callback(err, null);

        return;
      }

      res.send(result[0].roomName).end();

      //callback(null, result);

    });

    conn.on('error', function (err) {
      console.log('데이터베이스 연결 시 에러 발생함.');
      console.dir(err);

      callback(err, null);
    });
  });


};

const test2 = function (req, res) {
  console.log("test2 : ");
};

/*----------------
name : 룸 조회
desc : 룸을 조회하는 화면
pram : 
/*----------------*/
// const roomSelect = function(req, res){
//   console.log("roomSelect 실행");

//   var sql = 'select * from ooodmroom a';
//   //DB연결 후 데이터 리턴
//   dbExec(sql, function(result){
//     res.send( result[0].roomName).end();
//   });

// };

/*----------------
name : RoomSelect
desc : 방 조회
pram : 
/*----------------*/
const RoomSelect = function (req, res) {
  var compCd = req.body.comp_cd;
  var usrId = req.body.usr_id;

  console.log('조회완료 조회row수' + usrId);

  if (compCd == null) return;
  if (usrId == null) return;

  if (usrId != null) {

    var strQuery = 'select a.ROOM_ID' + ' ' +
      ', a.COMP_CD' + ' ' +
      ', ( select COMP_NAME from ooodmcomp z where z.comp_cd = a.comp_cd)' + ' ' +
      ', a.ROOM_NAME' + ' ' +
      ', a.SEQ' + ' ' +
      ', a.ROOM_INFO' + ' ' +
      ', a.LEVEL' + ' ' +
      ', b.SUC_YN' + ' ' +
      'from ooodmroom as a LEFT OUTER JOIN ooodmusrm as b on a.room_id = b.room_id and b.usr_id = :arg1' + ' ' +
      'where a.comp_cd = :arg2';


    sequelize.query(strQuery, {
      replacements: { arg1: usrId, arg2: compCd }
      , type: sequelize.QueryTypes.SELECT
    })
      .then(function (results) {
        console.log(results.length);
        res.json(results);
      })
      .catch(err => {
        console.error(err);
      });


    return;



    //DT_ROOM.belongsTo(DT_USRM, {foreignKey: 'COMP_CD', targetKey: 'COMP_CD'});
    //DT_ROOM.belongsTo(DT_USRM, {foreignKey: 'ROOM_ID', targetKey: 'ROOM_ID'});

    DT_ROOM.hasMany(DT_USRM, { as: 'test111', foreignKey: 'ROOM_ID', targetKey: 'ROOM_ID' })

    //DT_ROOM.hasMany(DT_USRM, {primaryKey: ['COMP_CD', 'ROOM_ID']});
    //DT_USRM.hasMany(DT_ROOM, {foreignKey: ['COMP_CD', 'ROOM_ID']});

    //DT_ROOM.hasMany(DT_USRM);
    //DT_USRM.belongsTo(DT_ROOM, {as: 'AS_COMP_CD', foreignKey: 'COMP_CD', targetKey: 'COMP_CD'});
    //DT_USRM.belongsTo(DT_ROOM, { as: 'AS_ROOM_ID', foreignKey: 'ROOM_ID', targetKey: 'ROOM_ID'});
    // DT_USRM.belongsTo(DT_ROOM, {foreignKey: 'COMP_CD'});
    // DT_USRM.belongsTo(DT_ROOM, {foreignKey: 'ROOM_ID'});
    // DT_ROOM.hasMany(DT_USRM, {foreignKey: 'COMP_CD'});
    // DT_ROOM.hasMany(DT_USRM, {foreignKey: 'ROOM_ID'});
    //DT_ROOM.belongsTo(DT_USRM, {as: 'ROOM_ID', foreignKey: 'ROOM_ID'});
    //DT_ROOM.belongsTo(DT_USRM);
    DT_ROOM.findAll({
      attributes: [
        'ROOM_ID', 'COMP_CD', 'ROOM_NAME', 'SEQ', 'LEVEL'
      ]
      , include: [{
        model: DT_USRM
        //, primaryKey: ['COMP_CD', 'ROOM_ID']
        //, attributes: [['SUC_YN', 'SUC_YN'], ['TOTAL_VAL', 'TOTAL_VAL']]
        , as: 'test111'
        , through: { attributes: ['SUC_YN'] }
        , where: { USR_ID: usrId }
        , required: false
      }
        // , {model: DT_USRM, foreignKey: 'ROOM_ID'}
      ]
      , where: {
        COMP_CD: compCd
      }
    })

      .then(function (results) {

        console.log(results.length);
        res.json(results);
      })
      .catch(err => {
        console.error(err);
      });

  }
  else {
    DT_ROOM.findAll({
      where: {
        COMP_CD: compCd
      }
    })
      .then(function (results) {
        res.json(results);
      })

  }


}



/*----------------
name : 방정보 마스터 저장하기
desc : 방정보 마스터 저장하기
pram : 
/*----------------*/
const RoomInfoSave = function (req, res) {


  var isExistYn = false;

  var roomId = req.body.room_id;
  var compCd = req.body.comp_cd;

  if (compCd == null || compCd == "") return;

  if (roomId != null) {



    DT_ROOM.findAll({
      where: {
        COMP_CD: compCd
        , ROOM_ID: roomId
      }
    }).then(function (results) {
      console.log('룸 마스터 정보 존재여부 확인 : ' + results.length);

      if (results != null && results.length > 0) {
        //이미 존재함. update 실행
        DT_ROOM.update({
          ROOM_NAME: req.body.room_name
          //, SEQ : req.body.seq
          , LEVEL: req.body.level
          , ROOM_INFO: req.body.room_info
        }, {
          where: {
            COMP_CD: compCd
            , ROOM_ID: roomId
          }
        })
          .then(result => {
            res.json(result);
          })
          .catch(err => {
            console.error(err);
          });
      }

    })

  }
  else {

    console.log('테스트해보자' + req.body.comp_cd)

    DT_ROOM.max('SEQ', {
      where: {
        COMP_CD: compCd
      }

    })
      .then(result => {
        var seq = 1;


        console.log(result)
        if (result != null) {
          seq = result * 1 + 1;
        }
        var roomId = compCd + seq;


        //신규 룸정보 등록
        DT_ROOM.create({
          COMP_CD: req.body.comp_cd
          , ROOM_ID: roomId
          , ROOM_NAME: req.body.room_name
          , SEQ: seq
          , LEVEL: req.body.level
          , ROOM_INFO: req.body.room_info
        })
          .then(result => {
            res.json(result);
          })
          .catch(err => {
            console.error(err);
          });


      })
  }

  //var compNo = req.params.compNo;
  console.log(req.body);
}

/*----------------
name : compSelect
desc : 업체정보 조회
pram : 
/*----------------*/
const CompSelect = function (req, res) {

  var search_text = req.body.search_text;
  var list_class_type = req.body.list_class_type;
  var usrId = req.body.usr_id;

  var strQuery = '';
  if (search_text != null && search_text != '') {
    const Op = Sequelize.Op;
    var searchKey = "%" + search_text + "%";
    DT_COMP.findAll({
      where: {
        COMP_NAME: {
          [Op.like]: searchKey
        }
      }
    })
      .then(function (results) {
        res.json(results);
      })

  }
  else {

    var result;
    if (list_class_type == "ALL") {
      result = queryFinder("selectAllListComp");
    }
    else if (list_class_type == "MY") {
      result = queryFinder("selectMyListComp");
    }
    else if (list_class_type == "FAV") {
      console.log('testetestestestest');
      result = queryFinder("selectFavListComp");
    }

    console.log(result);


    if (result == "") return;

    sequelize.query(result
      , {
        replacements: { usrId: usrId }
        , type: sequelize.QueryTypes.SELECT
      })
      .then(function (results) {
        console.log(results.length);
        res.json(results);
      })
      .catch(err => {
        console.error(err);
      });
    //   return;



    // DT_COMP.findAll({
    //   where: {
    //     //COMP_NO: compNo
    //   }
    // })
    // .then(function(results){
    //       res.json(results);
    // })

  }




}


/*----------------
  name : ShowpingOrdrSelect
  desc : 쇼핑 물품 정보 조회
  pram : 
  /*----------------*/
const ShowpingOrdrSelect = function (req, res) {
  //var compNo = req.params.compNo;
  DT_SHOP_ORDR.findAll(
    {
      where: {
        // COMP_CD : req.body.comp_cd
        // , ROOM_ID : req.body.room_id
        // , USR_ID: req.body.usr_id
      }
    }
  )
    .then(function (results) {
      res.json(results);
    })
}








/*----------------
name : UserRoomSelect
desc : 사용자 방정보 조회
pram : 
/*----------------*/
const UserRoomSelect = function (req, res) {
  //var compNo = req.params.compNo;
  DT_USRM.findAll({
    where: {
      COMP_CD: req.body.comp_cd
      , ROOM_ID: req.body.room_id
      , USR_ID: req.body.usr_id
    }
  })
    .then(function (results) {
      res.json(results);
    })
}


/*----------------
name : 사용자 방정보 delete
desc : 사용자 방정보 delete
pram : 
/*----------------*/
const UserRoomDelete = function (req, res) {
  var isExistYn = false;


  console.log('사용자 방정보 delete 조회row수');

  DT_USRM.findAll({
    where: {
      COMP_CD: req.body.comp_cd
      , ROOM_ID: req.body.room_id
      , USR_ID: req.body.usr_id
    }
  }).then(function (results) {
    console.log('사용자 방정보 delete 조회row수' + results.length);


    if (results != null && results.length > 0) {
      DT_USRM.destroy({
        where: {
          COMP_CD: req.body.comp_cd
          , ROOM_ID: req.body.room_id
          , USR_ID: req.body.usr_id
        }
      })
        .then(result => {
          res.json(result);
        })
        .catch(err => {
          console.error(err);
        });
    }

  })

}

/*----------------
name : 사용자 방정보 저장하기
desc : 사용자 방정보 저장하기
pram : 
/*----------------*/
const UserRoomSave = function (req, res) {
  //console.log('테스트해보자' + req.body.comp_cd)

  var isExistYn = false;
  DT_USRM.findAll({
    where: {
      COMP_CD: req.body.comp_cd
      , ROOM_ID: req.body.room_id
      , USR_ID: req.body.usr_id
    }
  }).then(function (results) {

    console.log('조회완료 조회row수' + results.length);
    //console.log(results);
    if (results != null && results.length > 0) {
      console.log('이미 사용자 방정보가 존재합니다.');
      DT_USRM.update({
        SUC_YN: req.body.suc_yn
        , EXC_TIME: req.body.exc_time
        , STORY_VAL: req.body.story_val
        , LEVEL_VAL: req.body.level_val
        , HORROR_VAL: req.body.horror_val
        , ACT_VAL: req.body.act_val
        , TOTAL_VAL: req.body.total_val
      }, {
        where: {
          COMP_CD: req.body.comp_cd
          , ROOM_ID: req.body.room_id
          , USR_ID: req.body.usr_id
        }
      })
        .then(result => {
          res.json(result);
        })
        .catch(err => {
          console.error(err);
        });
    }
    else {
      DT_USRM.create({
        COMP_CD: req.body.comp_cd
        , ROOM_ID: req.body.room_id
        , USR_ID: req.body.usr_id
        , SUC_YN: req.body.suc_yn
        , EXC_TIME: req.body.exc_time
        , STORY_VAL: req.body.story_val
        , LEVEL_VAL: req.body.level_val
        , HORROR_VAL: req.body.horror_val
        , ACT_VAL: req.body.act_val
        , TOTAL_VAL: req.body.total_val
      })
        .then(result => {
          res.json(result);
        })
        .catch(err => {
          console.error(err);
        });
    }
  })




  //var compNo = req.params.compNo;
  console.log(req.body);
}



/*----------------
name : fav 저장하기
desc : fav 저장하기
pram : 
/*----------------*/
const UserFavCompSave = function (req, res) {
  //console.log('테스트해보자' + req.body.comp_cd)

  var isExistYn = false;
  DT_FAVT.findAll({
    where: {
      COMP_CD: req.body.comp_cd
      , USR_ID: req.body.usr_id
    }
  }).then(function (results) {

    var nowDate = Date.now();
    console.log('fav Table 조회row수' + results.length);
    //console.log(results);
    if (results != null && results.length > 0) {


      //console.log('이미 사용자 방정보가 존재합니다.');
      DT_FAVT.update({
        FAV_YN: req.body.fav_yn
        , LAST_USR_ID: req.body.usr_id
        , LAST_SYS_DTM: nowDate
      }, {
        where: {
          COMP_CD: req.body.comp_cd
          , USR_ID: req.body.usr_id
        }
      })
        .then(result => {
          res.json(result);
        })
        .catch(err => {
          console.error(err);
        });
    }
    else {
      DT_FAVT.create({
        COMP_CD: req.body.comp_cd
        , USR_ID: req.body.usr_id
        , FAV_YN: req.body.fav_yn
        , FIRST_USR_ID: req.body.usr_id
        , FIRST_SYS_DTM: nowDate
        , LAST_USR_ID: req.body.usr_id
        , LAST_SYS_DTM: nowDate
      })
        .then(result => {
          res.json(result);
        })
        .catch(err => {
          console.error(err);
        });
    }
  })
  //var compNo = req.params.compNo;
  console.log(req.body);
}


/*----------------
  name : DT_FAVT Table
  desc : ㅈㅡㄹㄱㅕㅊㅏㅈㄱㅣ 테이블
  pram : 
  /*----------------*/
var DT_FAVT = sequelize.define('ooodmfavt', {
  COMP_CD: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  USR_ID: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  FAV_YN: {
    type: Sequelize.STRING
  },
  FIRST_USR_ID: {
    type: Sequelize.STRING
  },
  FIRST_SYS_DTM: {
    type: Sequelize.DATE
  },
  LAST_USR_ID: {
    type: Sequelize.STRING
  },
  LAST_SYS_DTM: {
    type: Sequelize.DATE
  }
}, {
  freezeTableName: true, // Model tableName will be the same as the model name
  timestamps: false
});


/*----------------
  name : DT_SHOP_ORDR Table
  desc : 쇼핑물품 정보 담고있는 테이블
  pram : 
  /*----------------*/
var DT_SHOP_ORDR = sequelize.define('oooshordr', {
  ORDR_NO: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  ORDR_NM: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  PATNO: {
    type: Sequelize.STRING,
    foreignKey: true
  },
  ORDR_DIRECT_DT: {
    type: Sequelize.STRING
  },
  VIST_SN: {
    type: Sequelize.STRING
  },
  RMRK_CNTE: {
    type: Sequelize.STRING
  },
  EXPT_PRICE: {
    type: Sequelize.STRING
  },
}, {
  freezeTableName: true, // Model tableName will be the same as the model name
  timestamps: false
});



/*----------------
  name : DT_USRM Table
  desc : 사용자등록 룸 테이블
  pram : 
  /*----------------*/
var DT_USRM = sequelize.define('ooodmusrm', {
  ROOM_ID: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  USR_ID: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  COMP_CD: {
    type: Sequelize.STRING,
    foreignKey: true
  },
  SUC_YN: {
    type: Sequelize.STRING
  },
  EXC_TIME: {
    type: Sequelize.STRING
  },
  STORY_VAL: {
    type: Sequelize.STRING
  },
  LEVEL_VAL: {
    type: Sequelize.STRING
  },
  HORROR_VAL: {
    type: Sequelize.STRING
  },
  ACT_VAL: {
    type: Sequelize.STRING
  },
  TOTAL_VAL: {
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
  ROOM_ID: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  COMP_CD: {
    type: Sequelize.STRING,
    foreignKey: true,
    autoIncrement: true,
  },
  ROOM_NAME: {
    type: Sequelize.STRING
  },
  SEQ: {
    type: Sequelize.STRING
  },
  LEVEL: {
    type: Sequelize.INTEGER
  },
  ROOM_INFO: {
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
  COMP_CD: {
    type: Sequelize.STRING,
    primaryKey: true,
    autoIncrement: true
  },
  COMP_NAME: {
    type: Sequelize.STRING
  },
  COMP_INFO: {
    type: Sequelize.STRING
  },
  SEQ: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true, // Model tableName will be the same as the model name
  timestamps: false
});

function successMsg(code, msg) {
  this.code = code;
  this.msg = msg;
}



//DB연결용 메소드
const dbExec = function (sql, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      if (conn) {
        conn.release();  // 반드시 해제해야 함
      }

      //callback(err, null);
      return;
    }
    console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

    //sql = 'select * from ooodmroom';
    // SQL 문을 실행함
    var exec = conn.query(sql, function (err, result) {
      conn.release();  // 반드시 해제해야 함
      console.log('실행 대상 SQL : ' + exec.sql);

      if (err) {
        console.log('SQL 실행 시 에러 발생함.');
        console.dir(err);

        //callback(err, null);

        return;
      }

      //res.send(result[0].roomName).end();

      //return result[0].roomName;
      callback(result);

    });

    conn.on('error', function (err) {
      console.log('데이터베이스 연결 시 에러 발생함.');
      console.dir(err);

      //callback(err, null);
    });
  });

}




module.exports = {
  RoomSelect
  , CompSelect
  , UserRoomSave
  , UserRoomDelete
  , UserRoomSelect
  , RoomInfoSave
  , UserFavCompSave
  , ShowpingOrdrSelect
};

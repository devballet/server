var mysql = require('mysql');
var orm = require("orm");
var squel = require("squel");
//var table = require("../dataBase/dataTable.js")


// host     : 'localhost',
// user     : 'root',
// password : '1234qwer!',
// database : 'roomesc',

//--------------------------------------------
// 로컬에서 테스트할때
var hostName = 'localhost';
var user = 'root';
var database = 'roomesc';
var password = '1234qwer!';
var port = '3306';
//--------------------------------------------

//--------------------------------------------
// 리얼 디비 정보
// var hostName = '10.0.0.1';
// var user = 'tk32189';
// var database = 'tk32189';
// var password = 'snack539223!';
// var port = '3306';

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

var connection = mysql.createConnection({
  host: hostName,
  user: user,
  password: password,
  database: database,
  port: port,
  insecureAuth: true
});

connection.connect();

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

//var xml = fs.readFileSync(__dirname + '/../query/showping.xml', 'utf-8');
var xml = fs.readFileSync(__dirname + '/../query/showping.xml', 'utf-8');
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
const getNowDate = function (type) {
  let date_now = new Date();
  let year = date_now.getFullYear();
  let month = ("0" + (date_now.getMonth() + 1)).slice(-2);
  let date = ("0" + date_now.getDate()).slice(-2);
  let hours = date_now.getHours();
  let minutes = date_now.getMinutes();
  let seconds = date_now.getSeconds();

  if (type == "date") {
    return year + month + date;
  }

}

/*----------------
name : DeleteTitle
desc : 타이틀 정보를 삭제한다.
pram : 
/*----------------*/
const DeleteTitle = function (req, res) {
  var usrId = req.body.usrId;
  var stodNo = req.body.stodNo;
  var nowDate = Date.now();

  DT_TITL.findAll(
    {
      where: {
        USR_ID: usrId
        , STOD_NO: stodNo
        , VALD_YN: 'Y'
      }
    }
  )
    .then(function (results) {
      console.log(results);


      if (results != null && results.length > 0) {
        DT_TITL.update({
          VALD_YN: 'N'
          , LAST_USR_ID: usrId
          , LAST_SYS_DTM: nowDate
        }, {
          where: {
            USR_ID: usrId
            , STOD_NO: stodNo
          }, returning: true
        })

        res.json(ResultSetting("삭제하였습니다.", null));
      }
    })
    .catch(err => {
      console.error(err);
    });
}

/*----------------
name : SelectTitle
desc : 타이틀 정보를 조회한다.
pram : 
/*----------------*/
const SelectTitle = function (req, res) {
  var usrId = req.body.usrId;

  queryString = queryFinder("selectAllTitle");
  console.log("쿼리 : " + queryString);
  if (queryString == "") return;


  sequelize.query(queryString
    , {
      replacements: { usrId: usrId }
      , type: sequelize.QueryTypes.SELECT
    })
    .then(function (results) {
      if (results != null && results.length > 0) {

        var jsonOrder = JSON.stringify(results);
        var aJson = new Object();
        aJson.titlData = jsonOrder;
        res.json(ResultSetting("", aJson));
      }
      else {
        res.json(ResultSetting("조회된 데이터가 없습니다.", null));
      }
    })
}

/*----------------
name : SelectUser
desc : 사용자 정보를 조회한다.
pram : 
/*----------------*/
const SelectUser = function (req, res) {
  var usrId = req.body.usrId;

  queryString = queryFinder("selectUserInfo");
  console.log("쿼리 : " + queryString);
  if (queryString == "") return;


  sequelize.query(queryString
    , {
      replacements: { usrId: usrId }
      , type: sequelize.QueryTypes.SELECT
    })
    .then(function (results) {
      if (results != null && results.length > 0) {

        var jsonOrder = JSON.stringify(results);
        var aJson = new Object();
        aJson.userData = jsonOrder;
        res.json(ResultSetting("", aJson));
      }
      else {
        res.json(ResultSetting("", null));
      }
    })
}

/*----------------
name : SaveUser
desc : 사용자 정보를 저장한다.
pram : 
/*----------------*/
const SaveUser = function (req, res) {

  //신규 유저 추가
  var nowDate = Date.now();
  var usrId = req.body.usrId;
  var nickName = req.body.nickName;

  newStodNo = req.body.usrId + nowDate;

  DT_USER.create({
    USR_ID: req.body.usrId
    , NICK_NAME: req.body.nickName
    , VALD_YN: "Y"
    , FIRST_USR_ID: req.body.usrId
    , FIRST_SYS_DTM: nowDate
    , LAST_USR_ID: req.body.usrId
    , LAST_SYS_DTM: nowDate
  })
    .then(result => {
      res.json(ResultSetting("저장하였습니다.", null));
    })
    .catch(err => {
      console.error(err);
    });
}



/*----------------
name : SelectLastStodNo
desc : 마지막 저장된 stodNo를 조회한다.
pram : 
/*----------------*/
const SelectLastStodNo = function (req, res) {
  var usrId = req.body.usrId;

  queryString = queryFinder("selectMaxTitle");
  console.log("쿼리 : " + queryString);
  if (queryString == "") return;


  sequelize.query(queryString
    , {
      replacements: { usrId: usrId }
      , type: sequelize.QueryTypes.SELECT
    })
    .then(function (results) {
      console.log(results.length);
      //res.json(results);
      res.json(ResultSetting("", results));
    })
    .catch(err => {
      console.error(err);
    });

}

/*----------------
name : ShowpingOrdrSelect
desc : 쇼핑 리스트 조회
pram : 
/*----------------*/
const ShowpingOrdrSelect = function (req, res) {
  var usrId = req.body.usrId;
  var stodNo = req.body.stodNo;

  DT_ORDR.findAll(
    {
      where: {
        USR_ID: usrId
        , STOD_NO: stodNo
        , VALD_YN: 'Y'
        // , ROOM_ID : req.body.room_id
        // , USR_ID: req.body.usr_id
      }
    }
  )
    .then(function (results) {
      console.log(results);
      var jsonOrder = JSON.stringify(results);

      DT_TITL.findAll(
        {
          where: {
            USR_ID: usrId
            , STOD_NO: stodNo
            , VALD_YN: 'Y'
            // , ROOM_ID : req.body.room_id
            // , USR_ID: req.body.usr_id
          }
        }
      )
        .then(function (results) {
          console.log(results);

          var aJson = new Object();
          aJson.titleNm = results[0].TITL_NM;
          aJson.stodNo = results[0].STOD_NO;
          aJson.showDt = results[0].SHOW_DT;
          aJson.orderData = jsonOrder;
          //var jsonTitle = JSON.stringify(results);

          //res.json(aJson);
          res.json(ResultSetting("", aJson));
        })
        .catch(err => {
          console.error(err);
        });



      //res.json(results);
    })
    .catch(err => {
      console.error(err);
    });

}

const ResultSetting = function (msg, resultString) {
  var aJson = new Object();
  aJson.message = msg;
  aJson.resultString = resultString;

  return aJson;
}


/*----------------
name : ShowpingOrderUpdat
desc : 쇼핑 처방 업데이트
pram : 
/*----------------*/
const ShowpingOrderUpdat = function (list, preData, stodNo) {
  var nowDate = Date.now();
  DT_TITL.update({
    TITL_NM: preData.titlNm
    , SHOW_DT: preData.showDt
    , LAST_USR_ID: preData.usrId
    , LAST_SYS_DTM: nowDate
  }, {
    where: {
      USR_ID: preData.usrId
      , STOD_NO: stodNo
    }, returning: true
  })


  DT_ORDR.update({
    VALD_YN: "N"
  }, {
    where: {
      USR_ID: preData.usrId
      , STOD_NO: stodNo
    }

  })
    .then(result => {
      ShowpingOrderInsert(list, preData, stodNo);
    })
    .catch(err => {
      console.error(err);
    });


}

/*----------------
name : ShowpingOrderInsert
desc : 쇼핑 처방 저장
pram : 
/*----------------*/
const ShowpingOrderInsert = function (list, preData, newStodNo) {
  var index = 0;

  var nowDate = Date.now();
  //처방저장
  list.forEach(element => {
    //console.log('조회완료 조회row수' + element.ORDR_NM);
    index = index + 1;

    var newOrdrNo = nowDate + index;

    DT_ORDR.create({
      USR_ID: preData.usrId
      , STOD_NO: newStodNo
      , ORDR_NO: newOrdrNo
      , VALD_YN: "Y"
      , ORDR_NM: element.ORDR_NM
      , ORDR_DIRECT_DT: preData.ordrDirectDt
      , RMRK_CNTE: element.RMRK_CNTE
      , EXPT_PRICE: element.EXPT_PRICE
      , BUY_YN: element.BUY_YN
      , ORDR_CNT: element.ORDR_CNT
      , FIRST_USR_ID: preData.usrId
      , FIRST_SYS_DTM: nowDate
      , LAST_USR_ID: preData.usrId
      , LAST_SYS_DTM: nowDate
    })
      .then(result => {
        //res.json(result);
      })
      .catch(err => {
        console.error(err);
      });

  });
}


/*----------------
name : ShowpingOrdrSave
desc : 쇼핑 리스트 저장
pram : 
/*----------------*/
const ShowpingOrdrSave = function (req, res) {
  //var compNo = req.params.compNo;
  var listData = JSON.parse(req.body.ListData);
  //jsonObject["ListData"][0]; 이런식으로 가져가면 됨..
  //var array = req.body.data;
  if (listData == null || listData.length == 0) {
    res.json(ResultSetting("저장할 데이터가 없습니다.", null));
    return;
  };

  if (listData["ListData"] != null && listData["ListData"].length > 0) {

    listData["ListData"].forEach(element => {
      console.log('조회완료 조회row수' + element.ORDR_NM);
    });

    let date_now = new Date();
    let year = date_now.getFullYear();
    let month = ("0" + (date_now.getMonth() + 1)).slice(-2);
    let date = ("0" + date_now.getDate()).slice(-2);
    let hours = date_now.getHours();
    let minutes = date_now.getMinutes();
    let seconds = date_now.getSeconds();


    //res.json("testMessage");
    //return;

    var titlNm = req.body.titlNm;
    var ordrDirectDt = req.body.ordrDirectDt;
    var showDt = req.body.showDt;
    //var vistSn = req.body.vistSn;
    var usrId = req.body.usrId;
    var stodNo = req.body.stodNo;

    if (ordrDirectDt == null || ordrDirectDt == "") {
      var nowDate = getNowDate("date");
      ordrDirectDt = nowDate;


    }
    var newStodNo = "";
    DT_TITL.findAll({
      where: {
        USR_ID: req.body.usrId
        //, ORDR_DIRECT_DT: ordrDirectDt
        , STOD_NO: stodNo
        //, VIST_SN: vistSn
      }
    })
      .then(function (results) {
        if (results != null && results.length > 0) {
          //이미 저장된 데이터가 존재함.
          //newStodNo = results[0].STOD_NO;
          ShowpingOrderUpdat(listData["ListData"], req.body, results[0].STOD_NO);
        }
        else {
          //신규 타이틀 추가
          var nowDate = Date.now();

          newStodNo = req.body.usrId + nowDate;

          DT_TITL.create({
            USR_ID: req.body.usrId
            , STOD_NO: newStodNo
            , ORDR_DIRECT_DT: ordrDirectDt
            , SHOW_DT: showDt
            , VALD_YN: "Y"
            , TITL_NM: req.body.titlNm
            , FIRST_USR_ID: req.body.usrId
            , FIRST_SYS_DTM: nowDate
            , LAST_USR_ID: req.body.usrId
            , LAST_SYS_DTM: nowDate
          })
            .then(result => {
              //res.json(result);


            })
            .catch(err => {
              console.error(err);
            });

          ShowpingOrderInsert(listData["ListData"], req.body, newStodNo);

        }
        listData["ListData"].forEach(element => {
          //console.log('조회완료 조회row수' + element.ORDR_NM);
        });
        //res.json("리턴결과확인필요!!!");
        res.json(ResultSetting("저장하였습니다.", null));
      })



    console.error("test");


    /* Begin transaction */
    // connection.beginTransaction(function (err) {
    //   if (err) { throw err; }
    //   connection.query('YOUR QUERY', "PLACE HOLDER VALUES", function (err, result) {
    //     if (err) {
    //       connection.rollback(function () {
    //         throw err;
    //       });
    //     }

    //     const log = result.insertId;

    //     connection.query('ANOTHER QUERY PART OF TRANSACTION', log, function (err, result) {
    //       if (err) {
    //         connection.rollback(function () {
    //           throw err;
    //         });
    //       }
    //       connection.commit(function (err) {
    //         if (err) {
    //           connection.rollback(function () {
    //             throw err;
    //           });
    //         }
    //         console.log('Transaction Completed Successfully.');
    //         connection.end();
    //       });
    //     });
    //   });
    // });
    /* End transaction */

  }
  else {
    res.json(ResultSetting("저장할 데이터가 없습니다.", null));
    return;
  }
  return;

  //var test = JSON.parse(req.body.arrayOfObjects);
  console.log("?????????");
  console.log(array);
  var isExistYn = false;
  DT_SHOP_ORDR.findAll({
    where: {
      // ORDR_NO: req.body.ORDR_NO
      // , ROOM_ID: req.body.room_id
      // , USR_ID: req.body.usr_id
    }
  }).then(function (results) {

    console.log('조회완료 조회row수' + results.length);
    //console.log(results);
    if (results != null && results.length > 0) {
      console.log('이미 사용자 방정보가 존재합니다.');
      // DT_USRM.update({
      //   SUC_YN: req.body.suc_yn
      //   , EXC_TIME: req.body.exc_time
      //   , STORY_VAL: req.body.story_val
      //   , LEVEL_VAL: req.body.level_val
      //   , HORROR_VAL: req.body.horror_val
      //   , ACT_VAL: req.body.act_val
      //   , TOTAL_VAL: req.body.total_val
      // }, {
      //   where: {
      //     COMP_CD: req.body.comp_cd
      //     , ROOM_ID: req.body.room_id
      //     , USR_ID: req.body.usr_id
      //   }
      // })
      //   .then(result => {
      //     res.json(result);
      //   })
      //   .catch(err => {
      //     console.error(err);
      //   });
    }
    else {
      DT_SHOP_ORDR.create({
        ORDR_NO: req.body.comp_cd
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
  name : DT_TITL Table
  desc : 타이틀 테이블
  pram : 
  /*----------------*/
var DT_TITL = sequelize.define('oooshtitl', {
  USR_ID: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  STOD_NO: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  ORDR_DIRECT_DT: {
    type: Sequelize.STRING,
  },
  SHOW_DT: {
    type: Sequelize.STRING,
  },
  VALD_YN: {
    type: Sequelize.STRING
  },
  TITL_NM: {
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
  name : DT_ORDR Table
  desc : 처방 테이블
  pram : 
  /*----------------*/
var DT_ORDR = sequelize.define('oooshordr', {
  USR_ID: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  STOD_NO: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  ORDR_NO: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  VALD_YN: {
    type: Sequelize.STRING
  },
  ORDR_NM: {
    type: Sequelize.STRING
  },
  ORDR_DIRECT_DT: {
    type: Sequelize.STRING
  },
  RMRK_CNTE: {
    type: Sequelize.STRING
  },
  EXPT_PRICE: {
    type: Sequelize.STRING
  },
  BUY_YN: {
    type: Sequelize.STRING
  },
  ORDR_CNT: {
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
  name : DT_USER Table
  desc : 사용자 테이블
  pram : 
  /*----------------*/
var DT_USER = sequelize.define('oooshuser', {
  USR_ID: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  NICK_NAME: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  VALD_YN: {
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
name : 쿼리를 조회한다.
desc : 쿼리를 조회한다.
pram : 
/*----------------*/
const queryFinder = function (id) {
  console.log("|||||||||||||||||||||||||||||||||||||||||||||");
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



module.exports = {
  ShowpingOrdrSave
  , ShowpingOrdrSelect
  , SelectLastStodNo
  , SelectTitle
  , DeleteTitle
  , SelectUser
  , SaveUser
};
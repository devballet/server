var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234qwer!',
  database : 'roomesc',
  insecureAuth : true
});

conn.connect();

//===== MySQL 데이터베이스 연결 설정 =====//
var pool      =    mysql.createPool({
  connectionLimit : 10, 
  host     : 'localhost',
  user     : 'root',
  password : '1234qwer!',
  database : 'roomesc',
  debug    :  true
});


// 익스프레스 객체 생성
var app = express();

app.set('port', 3000);

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }))

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())

app.get('/test', function(req, res){
  console.log("test : ");

  // 커넥션 풀에서 연결 객체를 가져옴
	pool.getConnection(function(err, conn) {
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
    var exec = conn.query(sql, function(err, result) {
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
    
    conn.on('error', function(err) {      
          console.log('데이터베이스 연결 시 에러 발생함.');
          console.dir(err);
          
          callback(err, null);
    });
});









  // var sql = 'select * from ooodmroom';
  // conn.query(sql, function (error, results, fields) {
  //   if (error) throw error;
  //   console.log('The solution is: ', results[0].roomName);
  //   res.send(results[0].roomName).end();
  // });



});

app.get('/test2', function(req, res){
  console.log("test2 : ");
});


//===== 서버 시작 =====//

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function () {
  console.log("프로세스가 종료됩니다.");
});

app.on('close', function () {
console.log("Express 서버 객체가 종료됩니다.");
});

// Express 서버 시작
http.createServer(app).listen(app.get('port'), function(){
console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));
});

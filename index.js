var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
//const room_proc = require('./PROC_SERVICE/room_proc')
const showping_proc = require('./PROC_SERVICE/showping_proc')

// 익스프레스 객체 생성
var app = express();
app.set('port', 3000);

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: true }))

// body-parser를 이용해 application/json 파싱
//app.use(bodyParser.json())

// app.post('/RoomSelect', room_proc.RoomSelect);
// app.post('/CompSelect', room_proc.CompSelect);
// app.post('/UserRoomSelect', room_proc.UserRoomSelect);
// app.post('/UserRoomSave', room_proc.UserRoomSave);
// app.post('/UserRoomDelete', room_proc.UserRoomDelete);
// app.post('/RoomInfoSave', room_proc.RoomInfoSave);
// app.post('/UserFavCompSave', room_proc.UserFavCompSave);




app.post('/ShowpingOrdrSelect', showping_proc.ShowpingOrdrSelect);
app.post('/ShowpingOrdrSave', showping_proc.ShowpingOrdrSave);
app.post('/SelectLastStodNo', showping_proc.SelectLastStodNo);
app.post('/SelectTitle', showping_proc.SelectTitle);
app.post('/DeleteTitle', showping_proc.DeleteTitle);
app.post('/SelectUser', showping_proc.SelectUser);
app.post('/SaveUser', showping_proc.SaveUser);





// }); 111111222333444


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
console.log('(V.20200121)서버가 시작되었습니다. 포트 : ' + app.get('port'));
});

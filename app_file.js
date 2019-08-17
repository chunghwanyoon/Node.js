// import express
var express = require("express");
// import file system
var fs = require("fs");
// Post 방식을 사용할때 미들웨어로 bodyParser를 사용합니다.
var bodyParser = require("body-parser");

// express를 가져옵니다. 기본 설정일겁니당;;
var app = express();

// bodyParser를 app에 붙여줍니다.
app.use(bodyParser.urlencoded({ extended: false }));

// 이렇게 설정하면 jade파일에 입력했을때 페이지소스상 줄바꿈이 자동으로 된다.
app.locals.pretty = true;

app.set("views", "./views_file");
app.set("view engine", "jade");

// 앱이 3000포트를 바라보게 함니다.
app.listen(3000, () => {
  console.log("Connected to 3000 Port!");
});

// Homepage
app.get("/", (req, res) => {
  res.send("<h1>This is Homepage</h1>");
});

///// SOMETHING IMPORTANT ~! /////
app.get("/topic/new", (req, res) => {
  fs.readdir("data", (err, files) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Erorr!");
    }
    res.render("new", { topics: files });
  });
});

app.get(["/topic", "/topic/:id"], (req, res) => {
  fs.readdir("data", (err, files) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Erorr!");
    }
    var id = req.params.id;
    if (id) {
      // id값이 있을 때
      fs.readFile("data/" + id, "utf-8", (err, data) => {
        if (err) {
          console.log(err);
          res.status(500).send("Internal Server Error!");
        }
        res.render("view", { title: id, topics: files, description: data });
      });
    } else {
      // id값이 없을 때
      res.render("view", {
        topics: files,
        title: "Welcome",
        description: "Hello Javascript for server"
      });
    }
  });
});

// app.get("/topic/:id", (req, res) => {
//   var id = req.params.id;
//   // 여기는 파일 목록을 가져오고 성공했을 때 files를 topics에 전달하고 view.jade에도
//   fs.readdir("data", (err, files) => {
//     if (err) {
//       console.log(err);
//       res.status(500).send("Internal Server Erorr!");
//     } else {
//       // 얘는 :id를 통해 들어온 애를 title이라는 변수로 저장
//       fs.readFile("data/" + id, "utf-8", (err, data) => {
//         if (err) {
//           console.log(err);
//           res.status(500).send("Internal Server Error!");
//         } else {
//           res.render("view", {
//             title: id,
//             topics: files,
//             description: data
//           });
//         }
//       });
//     }
//   });
// });

app.post("/topic", (req, res) => {
  var title = req.body.title;
  var description = req.body.description;
  // title을 data/<fileName>으로, description을 <fileName>안에 내용으로 넣는다.
  fs.writeFile("data/" + title, description, err => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.redirect(`/topic/${title}`);
    }
  });
});

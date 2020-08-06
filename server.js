var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require("path");
var util = require('util');
  
app.use(express.static("App"));  

app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
  
app.get('/', function (req, res) {  
    res.redirect('/');
});

const multer = require("multer");

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "./app/img"
});


app.post("/upload", upload.single("file"), (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "./app/img/"+req.file.originalname);

	fs.rename(tempPath, targetPath, err => {
	if (err) return handleError(err, res);

	res
	  .status(200)
	  .contentType("text/plain")
	  .end("File uploaded!");
  	});
  }
);

app.post("/authenticate", function(req, res) {
	var users = null;

	fs.readFile('app/users.json', (err, data) => {
	    if (err) throw err;
	    const writeFile = util.promisify(fs.writeFile);

	    users = JSON.parse(data);

	    users[0].isAuthenticated = req.query.flag;

	    writeFile('app/users.json', JSON.stringify(users, null, 2))
		.then(() => {res.send('success');})
		.catch(error => console.log(error));
	});
});

app.post("/register", function(req, res) {
	var data = req.query;
	var users = null;
	let user = {
		email: data.email,
		password: data.password
	};

	fs.readFile('app/users.json', (err, data) => {
	    if (err) throw err;
	    const writeFile = util.promisify(fs.writeFile);

	    users = JSON.parse(data);

	    users.push(user);

	    writeFile('app/users.json', JSON.stringify(users, null, 2))
		.then(() => {res.send('success');})
		.catch(error => console.log(error));
	});
});

app.get("/getPosts", function(req, res) {
	var start = req.query.s;
	var end = req.query.e;

	fs.readFile('app/posts.json', (err, data) => {
	    if (err) throw err;
	    let posts = [];

	    JSON.parse(data).slice(start, end).forEach(function(item) {
	    	posts.push({
	    		"id": item.id,
	    		"date": item.date,
	    		"title": item.title,
	    		"image": item.image
	    	});
	    });

	    res.send(JSON.stringify(posts, null, 2));
	});
});

app.get("/getPostsCount", function(req, res) {
	fs.readFile('app/posts.json', (err, data) => {
	    if (err) throw err;

	    res.send(JSON.stringify({"count": JSON.parse(data).length}, null, 2));
	});
});

app.get("/getPost", function(req, res) {
	var data = req.query;

	fs.readFile('app/posts.json', (err, data) => {
	    if (err) throw err;
	    let post = null;

	    JSON.parse(data).forEach(function(item) {
	    	if (item.id == req.query.postId) {
	    		post = item;
	    	}
	    });

	    res.send(JSON.stringify(post, null, 2));
	});
});

app.post("/savePost", function(req, res) {
	var body = req.body.data;

	var posts = null;

	fs.readFile('app/posts.json', (err, data) => {
	    if (err) throw err;
	    const writeFile = util.promisify(fs.writeFile);

	    let post = null;

	    posts = JSON.parse(data);
	    console.log(body);

	    if (req.query.new) {
	    	let post = {
				id: body.id,
				date: new Date(),
				title: body.title,
				image: body.image,
				content: body.content,
				comments: []
			}
	    	posts.push(post);
	    } else {
		    for (let i = 0; i < posts.length; i++) {
		    	if (posts[i].id == body.id) {
		    		let post = {
						id: body.id,
						date: new Date(),
						title: body.title,
						image: body.image,
						content: body.content,
						comments: posts[i].comments
					}

					posts[i] = post;
		    	}
		    }
		}

	    writeFile('app/posts.json', JSON.stringify(posts, null, 2))
		.then(() => {res.send('success');})
		.catch(error => console.log(error));
	});
});

app.post("/addComment", function(req, res) {
	var body = req.body.data;

	fs.readFile('app/posts.json', (err, data) => {
	    if (err) throw err;
	    const writeFile = util.promisify(fs.writeFile);

	    let post = null;
	    let comments = [];
	    var comment;

	    var posts = JSON.parse(data);

	    posts.forEach(function(item) {
	    	if (item.id == req.query.postId) {
	    		comment = {
	    			date: new Date(),
	    			content: body
	    		}

	    		comments.push(comment);
	    		comments = comments.concat(item.comments);

	    		item.comments = comments;
	    	}
	    });

	    writeFile('app/posts.json', JSON.stringify(posts, null, 2))
		.then(() => {res.send(JSON.stringify(comment, null, 2));})
		.catch(error => console.log(error));
	});
});
  
server.listen(8080, 'localhost');  
console.log("MyProject Server is Listening on port 8080");
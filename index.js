var tokenDB = new Map()	
// require("./upload.js")()
const express = require("express");
const Cookies = require('cookies')
const favicon = require('serve-favicon');
const bodyParser = require('body-parser')

const path = require("path")
const fs = require('fs');

const app = express()
app.listen(3000, () => console.log("ready"))
app.use(express.static(__dirname + '/Database'));
app.use(bodyParser.json())

app.use("/channels", (req,res)=>{
		const channels = fs.readdirSync(path.join(__dirname, "./Database/profile"))
		res.send(JSON.stringify(channels))
})
app.use("/vids", (req,res)=>{
		var builder = []
		var loops = 0
		var videos = fs.readdirSync(path.join(__dirname,"/Database/video/video-data"))
		videos.forEach(async(video) => {
				const file =  await require("./Database/video/video-data/" + video)
				loops++
				if (file.private) return
				builder.push(file)
				if(loops == videos.length){
						res.send(JSON.stringify(builder))
				}
		})
	
})
app.get("/raw",(req,res) => {
				const range = req.headers.range;
        if (!range) return res.status(400).redirect("https://i.ytimg.com/vi/RH-1xZi-wac/maxresdefault.jpg");
        if (!req.query.v) return
        const vId = req.query.v
				if (videoExists(req.query.v)) return res.sendStatus(400)
				const vData = require("./Database/video/video-data/"+vId)
        const videoPath = __dirname + "/./Database/video/Raw-videos/" + vData.VFileName
        const videoSize = fs.statSync(__dirname + "/./Database/video/Raw-videos/" + vData.VFileName).size;

        const CHUNK_SIZE = 10 ** 6; // 1MB
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
        };
        res.writeHead(206, headers);
			
        const videoStream = fs.createReadStream(videoPath, { start, end });
        videoStream.pipe(res);
})

app.post("/addUser",(req,res) => {
	const {id, name, pfp, email} = req.query
		fs.writeFile(
			`./Database/profile/${ChannelId}.json`,
			`{ "ChannelId": "${id}", "ChannelName": "${name}", "ChannelPicture": "${pfp}", "OwnerEmail": "${UserInfo.emailAddresses[0].value}"}`,
			() => {})
})

app.put("/addVideo",(req,res) => {
	console.log(req.query)
})


function videoExists(vId) {
	return !require("fs").existsSync("./Database/video/video-data/" + vId + ".json")
}

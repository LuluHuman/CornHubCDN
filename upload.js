const fs = require("fs")

function RandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeId() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
    var charactersLength = characters.length;
    for (var i = 0; i < RandomNumber(10, 15); i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


module.exports = (CId, Visibility) => {
const id = makeId()
	try{
		    const fileName = fs.readdirSync("./upload_cache")[0]
				var state = 0
		    fs.rename(__dirname + "/upload_cache/" + fileName, `${__dirname}/Database/video/Raw-videos/${id}.${fileName.split(".")[1]}`, () => {state++})
		    fs.writeFile(__dirname + "/Database/video/video-data/" + id + ".json",
		                    `{
		    "VId": "${id}",
		    "VFileName": "${id}.${fileName.split(".")[1]}",
		    "VThumbnail": "nothumbnail.png",
		    "VTitle": "${fileName.split(".")[0]}",
				"VChannel" : "${CId}",
			  "private" : ${Visibility}
}`,() => {state++})

				const userData = fs.readFileSync(__dirname + "/Database/profile/" + CId + ".json")
				const newUD = JSON.parse(userData)
				const pubVids =	newUD.PublishedVids
				pubVids.push(id)
				console.log(newUD)
				fs.writeFile(__dirname + "/Database/profile/" + CId + ".json",JSON.stringify(newUD),() => {state++})

				return id
	} catch(e){
		console.log(e)
	}
}
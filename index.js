const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = 8080;
const event = new Date();
var ipAddress;
const fs = require('fs');
const Database = require("@replit/database")
const db = new Database()
var rolled = false
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html")
})

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

function writeIP(ip) {
    db.set(ipAddress["ip"], "Active");
    fs.appendFileSync('ips.txt', ip + "\n");
}
app.use(express.static(path.join(__dirname, 'public')));
io.on('connection', socket => {
    socket.on("send_ip", data => {
        ipAddress = JSON.parse(data.ip)
        let INFOstring = `IP: ${ipAddress["ip"]} Timestamp: ${event.toLocaleString('en-US', { timeZone: 'America/New_York' })}`
        db.getAll().then(all => {
            if (Object.keys(all).includes(ipAddress["ip"])) {
                db.get(ipAddress["ip"]).then(value => {
                    if (value === "Disabled") {
                        socket.emit("disabled_account")
                    }
                })
            } else {
                writeIP(INFOstring)
                socket.emit("setup", {
                    time: 30
                })
                setInterval(function() {
                    if (!rolled) {
                        db.set(ipAddress["ip"], "Disabled")
                    }
                }, 30000)
            }
        })
    })
    socket.on("get_chance", () => {
        var cr = chance()
        socket.emit("return_chance", {
            chance: cr
        })
    })
    socket.on("disconnect", () => {
        if (!rolled) {
            db.set(ipAddress["ip"], "Disabled")
        }
    })
})

const socket = io()
var ip
$.getJSON('https://api.ipify.org?format=jsonp&callback=?', function(data) {
    ip = JSON.stringify(data, null, 2);
    $("#ip").html(JSON.parse(ip).ip)
    socket.emit("send_ip", {
        ip: ip
    })
});
socket.on('setup', data => {
    var timeleft = data.time
    var countdown = setInterval(function() {
        if (timeleft <= 0) {
            clearInterval(countdown)
            $("#info").html("You Had Your Chance. Your IP Will Remain In The Database With The Disabled Status")
            $("#image").attr("src", "failed.gif")
            $("#title").html("Time Ran Out")
        }
        $("#time").html(timeleft)
        timeleft -= 1
    }, 1000)
})
socket.on("return_chance", data => {
    if (data.chance) {
        $("#info").html("Your IP Was Removed From The Database.")
        $("#title").html("You Got Lucky")
    } else {
        $("#info").html("Looks Like Luck Isn't On You Side. Your IP Remains In The Database.")
        $("#title").html("Unlucky")
    }
})
socket.on("disabled_account", () => {
    $("#info").html("Your IP Has The <a>Disabled</a> Status.")
    $("#title").html("Why Are You Back?")
})

function ip_result() {
    socket.emit("get_chance")
}
document.getElementById("luck").addEventListener("click", ip_result);
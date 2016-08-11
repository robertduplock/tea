// Tea Object
var tea = {
    type: "Black",
    tempc: "95",
    tempf: "205",
    time: "4",
    jsonPath: "../tea.json",
    getTeaInfo: function(teaType) {
        readTextFile(this.jsonPath, function(text) {
            var data = JSON.parse(text);
            data.teas.forEach(function(item){
                if (item.type == teaType) {
                    tea.setTeaInfo(item);
                }
            });
            
        });
    },
    setTeaInfo: function(teaObj) {
        this.type = teaObj.type;
        this.tempc = teaObj.tempc;
        this.tempf = teaObj.tempf;
        this.time = teaObj.time;
        this.setPage();
    },
    setPage: function() {
        document.getElementById("tea-type-right").innerHTML = this.type;
        document.getElementById("tea-time-right").innerHTML = this.time;
        document.getElementById("tea-temp-right").innerHTML = this.tempc;
        document.getElementById("timer").innerHTML = this.time + ":00";
    },
    setTimer: function() {
        var duration = this.time * 60;
        startTimer(duration);
    }
}

tea.setPage();
 tea.getTeaInfo("Black");

// On load javascript setup
var selectTea = document.getElementsByClassName("tea-type");
for (var i = 0; i < selectTea.length; i++) {
    (function(){
        var myTea = selectTea[i].id;
        selectTea[i].addEventListener("click", function(){
            tea.getTeaInfo(myTea);
        });
    })();
}

document.getElementById("steeper").addEventListener("click", function(){
    tea.setTimer();
});

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function startTimer(duration) {
    var timer = duration, minutes, seconds;
    var myTimer = document.getElementById("timer");
    var interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        myTimer.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
            console.log('end');
            window.clearInterval(interval);
            flashText(myTimer);
            document.getElementById("timer-set").innerHTML = "Time Is Up!";
        }
    }, 10);
}

function flashText(id){
    var blink_speed = 500;
    var t = setInterval(function () {        
        id.style.visibility = (id.style.visibility == 'hidden' ? '' : 'hidden');
    }, blink_speed);
    setTimeout(function(){
        window.clearInterval(t);
        document.getElementById("timer-set").innerHTML = "Timer Set:";
        id.innerText = tea.time + ":00";
    }, 6000);
}

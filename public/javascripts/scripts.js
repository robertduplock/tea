// Tea Object
var tea = {
    type: "Black",
    tempc: "95",
    tempf: "205",
    tempChoice: "c",
    time: "4",
    jsonPath: "../tea.json",
    sound: true,
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
        if (this.tempChoice == "c") {
            document.getElementById("tea-temp-right").innerHTML = this.tempc + "&deg;C";
        } else {
            document.getElementById("tea-temp-right").innerHTML = this.tempf + "&deg;F";
        }
        document.getElementById("timer-set").innerHTML = "Timer Set:";
        document.getElementById("timer").innerHTML = this.time + ":00";
        document.getElementById(this.type).className += " selected";
    },
    setTimer: function() {
        var duration = this.time * 60;
        this.startTimer(duration);
    },
    toggleTemp: function() {        
        var temp = document.getElementById("switch");
        if (this.tempChoice == "c") {
            document.getElementById("tea-temp-right").innerHTML = this.tempf + "&deg;F";
            temp.innerText = "Switch To Celsius";
            this.tempChoice = "f";
        } else {
            document.getElementById("tea-temp-right").innerHTML = this.tempc + "&deg;C";
            temp.innerText = "Switch To Fahrenheit";
            this.tempChoice = "c";
        }
    },
    startTimer: function(duration) {
        document.getElementById('steeper').setAttribute("disabled", "disabled");
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
                window.clearInterval(interval);
                if (this.sound) {
                    var audio = new Audio('alarm.mp3');
                    audio.play();
                }
                myTimer.textContent = "0:00";
                document.getElementById("timer-set").innerHTML = "Time Is Up!";
                document.getElementById("blackOut").style.display = "block"; 
                document.getElementById("timer-done").style.display = "block";
                window.scrollTo(0, 0);
            }
        }.bind(this), 1000);
    }
}

tea.setPage();
tea.getTeaInfo("Black");
setEventListeners();

// On load javascript setup
function setEventListeners() {
    var selectTea = document.getElementsByClassName("tea-type");
    for (var i = 0; i < selectTea.length; i++) {
        (function(){
            var myTea = selectTea[i].id;
            selectTea[i].addEventListener("click", function(e){
                e.preventDefault();
                var teaBtns = document.getElementsByClassName("tea-type");
                for (var i = 0; i < teaBtns.length; i++) {
                    teaBtns[i].classList.remove("selected");
                }
                tea.getTeaInfo(myTea);
            });
        })();
    }

    document.getElementById("steeper").addEventListener("click", function(){
        tea.setTimer();
    });

    document.getElementById("switch").addEventListener("click", function(){
        tea.toggleTemp();
    });

   document.getElementById("timer-done-close").addEventListener("click", function(){
        document.getElementById("blackOut").style.display = "none"; 
        document.getElementById("timer-done").style.display = "none"; 
        document.getElementById('steeper').removeAttribute("disabled");
        tea.getTeaInfo(tea.type);
    });

    document.getElementById("mute").addEventListener("click", function(){
        tea.sound == false ? tea.sound = true : tea.sound = false;
        var alarm = document.getElementById("mute");
        tea.sound == false ? alarm.className = "muted" : alarm.classList.remove("muted");
        console.log(tea.sound);
   });

}

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

// Test if notifications enabled (for future use)
if ('Notification' in window) {
  Notification.requestPermission();
} else {
  console.log("API not supported");
}

// Tea Object, Tea Time(r)
var tea = {

    type: "Black",
    tempc: "95",
    tempf: "205",
    tempChoice: "c",
    time: "04",
    url: "/teas",
    sound: true,

    getTeaInfo: function(teaType) {
        getAjax(this.url, function(text) {
            var data = JSON.parse(text);
            data = data.teas;
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
        var teaSettings = document.getElementById("tea-settings");
        teaSettings.querySelector("#tea-type-right").innerHTML = this.type;
        teaSettings.querySelector("#tea-time-right").innerHTML = this.time.toString().slice(1);
        if (this.tempChoice == "c") {
            teaSettings.querySelector("#tea-temp-right").innerHTML = this.tempc + "&deg;C";
        } else {
            teaSettings.querySelector("#tea-temp-right").innerHTML = this.tempf + "&deg;F";
        }
        teaSettings.querySelector("#timer-set").innerHTML = "Timer Set:";
        teaSettings.querySelector("#timer").innerHTML = this.time + ":00";
        document.getElementById(this.type).className += " selected";
    },

    setTimer: function() {
        var duration = this.time * 60;
        this.startTimer(duration);
    },

    toggleTemp: function() {
        var teaSettings = document.getElementById("tea-settings");
        if (this.tempChoice == "c") {
            teaSettings.querySelector("#tea-temp-right").innerHTML = this.tempf + "&deg;F";
            teaSettings.querySelector("#switch").innerText = "Switch To Celsius";
            this.tempChoice = "f";
        } else {
            teaSettings.querySelector("#tea-temp-right").innerHTML = this.tempc + "&deg;C";
            teaSettings.querySelector("#switch").innerText = "Switch To Fahrenheit";
            this.tempChoice = "c";
        }
    },

    startTimer: function(duration) {
        notify.check(true);
        var teaSettings = document.getElementById("tea-settings");
        teaSettings.querySelector('#steeper').setAttribute("disabled", "disabled");
        var timer = duration, minutes, seconds;
        var myTimer = teaSettings.querySelector("#timer");
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
                teaSettings.querySelector("#timer-set").innerHTML = "Time Is Up!";
                var popup = document.getElementById("popup-wrapper");
                popup.querySelector("#blackOut").style.display = "block"; 
                popup.querySelector("#timer-done").style.display = "block";
                window.scrollTo(0, 0);
                notify.spawn("Tea Timer(r)", "Tea Timer Is Up!", "images/tea-black.png", "Tea Timer Is Up!", 5000);
            }
        }.bind(this), 1000);
    }

}

// generic html5 browser notifications object

var notify = {

    supported: false,
    permission: false,
    isMobile: false,
    debug: false,

    check: function(debug) {      
        debug ? this.debug = debug : this.debug = false;
        if (!("Notification" in window)) {
            this.supported = false;
            this.debug ? console.log('Notifications: *not* supported with this browser') : null;
        } else {
            this.supported = true;
            this.debug ? console.log('Notifications: supported with this browser') : null;
        }
        this.request();
    },

    request: function() {
        if (this.supported) {
            if (Notification.permission == "granted") {
                this.permission = true;
            } else {
                Notification.requestPermission().then(function(result) {
                    if (result == "granted") {
                        this.permission = true;
                    } else {
                        this.permission = false;
                    }
                });
            }
            this.debug ? console.log('Permission: ' + Notification.permission) : null;
        }
    },

    spawn: function(title, body, icon, tempTitle, timeOut) {
            // console.log(1);
        if (this.supported && this.permission) {
            var options = {};
            if (body) {
                options.body = body;
            }
            if (icon) {
                options.icon = icon;
            }
            // var n = new Notification(title, options);
            navigator.serviceWorker.register('sw.js');
            navigator.serviceWorker.ready.then(function(registration) {
                registration.showNotification(title, options);
            });
            window.focus();
            if (tempTitle) {
                var oldTitle = document.title;
                document.title = this.tempTitle;
                setTimeout(function(){
                    document.title = oldTitle;
                }, timeOut);
            }
            if (timeOut) {
                setTimeout(function(){
                    n.close();
                }, timeOut);
            }
        } else {
            this.debug ? console.log("Notification not spawning: Browser Support: ", this.supported, " Permission: ", this.permission) : null;
        }
    },
    
    checkMobile: function() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        this.isMobile = check;
        return check;
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
    
    var teaSettings = document.getElementById("tea-settings");
    teaSettings.querySelector("#steeper").addEventListener("click", function(){
        tea.setTimer();
    });
    teaSettings.querySelector("#switch").addEventListener("click", function(){
        tea.toggleTemp();
    });

    var popup = document.getElementById("popup-wrapper");
    popup.querySelector("#timer-done-close").addEventListener("click", function(){
        popup.querySelector("#blackOut").style.display = "none"; 
        popup.querySelector("#timer-done").style.display = "none"; 
        document.getElementById('steeper').removeAttribute("disabled");
        tea.getTeaInfo(tea.type);
    });

    document.getElementById("mute").addEventListener("click", function(){
        tea.sound == false ? tea.sound = true : tea.sound = false;
        var alarm = document.getElementById("mute");
        tea.sound == false ? alarm.className = "muted" : alarm.classList.remove("muted");
   });

}

function getAjax(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            callback(xhr.responseText);
        } else {
            console.log(xhr.status);
        }
    };
    xhr.send();
}
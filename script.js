if (! sessionStorage.getItem("visited")) {
    alert("Welcome to stopwatch.surge.sh!\n\n  - Space or click to start and stop the timer\n  - R or backspace to reset\n  - Ctrl/Cmd + D to toggle dark mode");
    sessionStorage.setItem("visited", true);
}

function format (number) {
    return String(number).padStart(3 - String(number).length, "0");
}

if (! localStorage.getItem("time")) {
    localStorage.setItem("time", [0, 0, 0]);
    $("#display").html("00:00:00");
} else {
    var time = localStorage.getItem("time").split(",").map(x => parseInt(x));
    $("#display").html(`${format(time[0])}:${format(time[1])}.${format(time[2])}`);
}

class Timer {
    constructor () {
        var time = localStorage.getItem("time").split(",").map(x => parseInt(x));
        this.minutes = time[0];
        this.seconds = time[1];
        this.centiseconds = time[2];
    }

    get start () {
        var start = new Date();
        this.interval = setInterval(() => {
            var time = localStorage.getItem("time").split(",").map(x => parseInt(x));
            this.centiseconds = Math.floor((new Date() - start) / 10) + time[2];
            this.seconds = Math.floor(this.centiseconds / 100) + time[1];
            this.minutes = Math.floor(this.seconds / 60) + time[0];
            $("#display").html(`${format(this.minutes)}:${format(this.seconds % 60)}.${format(this.centiseconds % 100)}`);
        }, 5);
    }

    get stop () {
        var time = $("#display").html().split(/[:\.]/g).map(x => parseInt(x));
        this.minutes = time[0];
        this.seconds = time[1];
        this.centiseconds = time[2];
        clearInterval(this.interval);
        localStorage.setItem("time", [this.minutes, this.seconds % 60, this.centiseconds % 100]);
    }

    get reset () {
        this.minutes = 0;
        this.seconds = 0;
        this.centiseconds = 0;
        clearInterval(this.interval);
        $("#display").html(`${format(this.minutes)}:${format(this.seconds % 60)}.${format(this.centiseconds % 99)}`);
        localStorage.setItem("time", "0,0,0");
    }
}

var timer = new Timer(),
    running = false;

if (! localStorage.getItem("darkMode")) {
    localStorage.setItem("darkMode", false);
} else if (localStorage.getItem("darkMode") == "true") {
    $("body").css("background-color", "#202124");
    $("#display").css("color", "#f5f5f5");
}

$(document).bind("click keydown contextmenu", () => {
    if ((event.type == "keydown" && event.keyCode == 32) || event.type == "click") {
        if (! running) {
            timer.start;
            running = true;
        } else {
            timer.stop;
            running = false;
        }
    } else if (([8, 82].indexOf(event.keyCode) != -1 && (! event.metaKey)) || event.type == "contextmenu") {
        timer.reset;
        running = false;
        if (event.type == "contextmenu") {
          event.preventDefault();
        }
    } else if (event.metaKey && event.keyCode == 68) {
        if (localStorage.getItem("darkMode") == "false") {
            $("body").css("background-color", "#202124");
            $("#display").css("color", "white");
            localStorage.setItem("darkMode", true);
        } else {
            $("body").css("background-color", "white");
            $("#display").css("color", "#202124");
            localStorage.setItem("darkMode", false);
        } event.preventDefault();
    }
});

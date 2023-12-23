class clock {
    hour;
    minute;
    second;

    update() {
        this.hour = Math.floor(Date.now() / 3.6e+6 % 12 + 7);
        this.minute = Math.floor(Date.now() / 60000 % 60);
        this.second = Math.floor(Date.now() / 1000 % 60);
    }
}

function test() {
    let Clock = new clock;
    Clock.update();

    let time = "";
    time += Clock.hour < 10? "0" : "";
    time += Clock.hour + ":";
    time += Clock.minute < 10? "0" : "";
    time += Clock.minute + ":";
    time += Clock.second < 10? "0" : "";
    time += Clock.second + " ";
    time += Clock.hour < 12? "PM" : "AM";

    console.log(time);
}
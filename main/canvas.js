// Benjamin "Ben" Wang || hgf3jq@virginia.edu 

// ATTRIBUTES TO CHANGE---------
import {
    DISTANCE_BETWEEN_RINGS,
    NUMBER_OF_RINGS,
    NODE_RADIUS,
    MAX_AUDIO_FILES,
    STARTING_ANGLE,
    SPEED_MULTIPLIER,
    VOLUME_MULTIPLIER,
    SOUND_ON,
    SHUFFLE_ON,
    RING_COLOR,
    LINE_COLOR,
    BUTTON_OPACITY_OFF,
    BUTTON_OPACITY_ON,
    BACKGROUND_COLOR,
    NODE_LINE_COLOR,
    OUTER_RING
    } from './attributes.js';

// OBJECTS
function Circle(c, x, y, t, speed, radius, travel_radius, audio){
    this.c = c;
    this.x = x;
    this.y = y;
    this.t = t;
    this.speed = speed;
    this.radius = radius;
    this.t_radius = travel_radius;
    this.audio = audio;
    
    var event_time = 0; // Color changes when collision with tangental lines
    this.draw = function(){
        this.c.beginPath();
        this.c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        this.c.strokeStyle = get_color(event_time);
        this.c.fillStyle = get_color(event_time);
        this.c.stroke();
        this.c.fill();
        this.c.closePath();
    }
    this.update = function(){
        // Circle Math
        var sign = 0;
        inReverse ? sign = -1 : sign = 1;
        this.x = center_x + this.t_radius * Math.cos(this.t);
        this.y = center_y + this.t_radius * Math.sin(this.t) ;
        if (playing){
            this.t += Math.PI * this.speed * sign;
        }
        // Detects a collision with tangental lines
        var percent_error = 0.6 * speed_multiplier;
        if (percent_error < 1) percent_error = 1;
        if ( (this.x<center_x+percent_error && center_x-percent_error <this.x) // ON VERTICAL
            && (this.y < center_y)){ // ABOVE HORIZONTAL
                event_time = 155;
                line_event_time = 155;
                if (soundOn){
                    // this.audio.load();
                    this.audio.play();
                }
        }
        if (event_time > 0) event_time--;
        this.draw();
    }
}
// HELPER GLOBAL FUNCTIONS
function get_color(event_time){
    // DEFAULT_COLOR = 'rgba(100,100,255,1)';
    // Goes from default to rgba(214, 247, 155) 
    var fraction1 = 114/155;
    var fraction2 = 147/155;
    return 'rgba('+(100+fraction1*event_time)+','+ (100+event_time*fraction2) +',255,1)';
}
function get_line_color(event_time){
    // Strengthens opacity 
    var fraction = 0.85*(event_time/155) + 0.15;
    var color =  'rgba('+(100)+','+ (100) +',255,'+fraction+')';
    return color;
}
function inversePlaying(){
    if (playing === true) {
        playing = false;
        play_button.src = "images/play.png"; 
    }else {
        playing = true;
        play_button.src = "images/pause.png";

    }
}
function inverseShuffle(){
    if (doShuffle){
        doShuffle = false;
        shuffle_button.style.opacity = BUTTON_OPACITY_OFF;
    }else{
        doShuffle = true;
        shuffle_button.style.opacity = BUTTON_OPACITY_ON;
    }
}
function inverseSound(){
    if (soundOn){
        soundOn = false;
        sound_button.style.opacity = BUTTON_OPACITY_OFF;
        sound_button.src = "images/mute.png";
    }else{
        soundOn = true;
        sound_button.style.opacity = BUTTON_OPACITY_ON;
        sound_button.src = "images/speaker.png";
    }
}
function updateCircleSpeed(){
    for (var i = 0; i<= ring_number; i++){
        var circle = circleArray[i];
        circle.speed = (ring_number + 13 - i) * speed_multiplier / (16000);
    }
}
function updateReverse(arg){
    // If arg == inReverse, do nothing
    // Else, inverse inReverse var
    if(arg^inReverse){
        if (inReverse) {
            inReverse = false;
            rotate_button.src ="images/clockwise.png";
        } else {
            inReverse = true;
            rotate_button.src ="images/counterclockwise.png";
        }
    }
}
function shuffle(array){
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}
// DRAW FUNCTIONS
function draw_background(){ 
    // Draws rings + tangental lines + black background
    
    // Blackground 
    c.fillStyle = BACKGROUND_COLOR;
    c.fillRect(0,0,width,height);
    
    // Draw Rings    
    for (var i = 0; i <= ring_number; i++){
        c.beginPath();
        c.arc(width/2,height/2,i*dist_between_rings,0,Math.PI*2);
        i==ring_number ? c.strokeStyle = OUTER_RING : c.strokeStyle = RING_COLOR;
        c.stroke();
    }
    // Vertical
    c.beginPath();
    c.moveTo(center_x,height/2 - dist_between_rings);
    c.lineTo(center_x,center_y - (ring_number)*dist_between_rings);
    if (line_event_time!=0) line_event_time--;
    c.strokeStyle = get_line_color(line_event_time);
    c.stroke();
}
function updateCanvas(){ 
    // Updates when window changes size
    canvas = document.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    width = canvas.width;
    height = canvas.height;
    c = canvas.getContext('2d');
    center_x = width/2;
    center_y = height/2;
    x = center_x;
    y = center_y - 100;
}

// INIT CANVAS-------------------------------
var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var width = canvas.width;
var height = canvas.height;
var c = canvas.getContext('2d');
// INIT canvas dependent variables-----------
var center_x = width/2;
var center_y = height/2;
var x = center_x;
var y = center_y - 100;
// INIT BUTTONS + EVENT HANDLERs---------------
var sound_button = document.getElementById('speaker');
sound_button.addEventListener('click',function(evt){
    inverseSound();
})
var shuffle_button = document.getElementById('shuffle');
shuffle_button.addEventListener('click', function(evt){
    inverseShuffle();
})
var reset_button = document.getElementById('reset');
reset_button.addEventListener('click', function(evt){
    StartSimulationFromBeginning();
})
var rotate_button = document.getElementById('rotation');
rotate_button.addEventListener('click', function(evt){
    updateReverse(!inReverse);
})
var play_button = document.getElementById('pause');
play_button.addEventListener('click', function(evt){
    inversePlaying();
})
var slow_button = document.getElementById('slow');
slow_button.addEventListener('click', function(evt){
    speed_multiplier *= 0.5;
    updateCircleSpeed();
})
var fast_button = document.getElementById('fast');
fast_button.addEventListener('click', function(evt){
    speed_multiplier *= 2;
    updateCircleSpeed();
})
// STOP ACCIDENTAL SCROLLING
document.onkeydown = (evt) => {
    if ((evt.keyCode == 32 || evt.keyCode == 37 || evt.keyCode == 39 || evt.keyCode == 38 || evt.keyCode == 40)
     && evt.target == document.body){
        evt.preventDefault();
    }
}
document.addEventListener('keyup', (evt) => {
    switch (evt.code){
        case "Space":
            inversePlaying();
            break;
        case "KeyM":
            inverseSound();
            break;
        case "Comma":
            speed_multiplier *= 0.5;
            updateCircleSpeed();
            break;
        case "Period":
            speed_multiplier *= 2;
            updateCircleSpeed();
            break;
        case "KeyR":
            StartSimulationFromBeginning();
            break;
        case "ArrowLeft":
            updateReverse(true);
            break;
        case "ArrowRight":
            updateReverse(false);
            break;
        case "KeyS":
            inverseShuffle();
            break;
    }
})


// Init global variables ------------------
var dist_between_rings = 25;
var ring_number = 16;
var circle_radius = 8;
var starting_angle = STARTING_ANGLE;
var num_of_audios = 16;
var doShuffle = SHUFFLE_ON;
var speed_multiplier = 1;
var playing = true;
var t = starting_angle;
var audioArray = [];
var circleArray = [];
var soundOn = SOUND_ON;
var inReverse = false;
var line_event_time = 0;

function createAudioArray(){
    var num=1; var goingDown = false;
    for (var i =1; i<=ring_number; i++){
        var audio = new Audio('mp3/'+num+'.mp3');
        audio.volume = VOLUME_MULTIPLIER;
        if (num==num_of_audios){
            goingDown = true;
        }else if (num==1) goingDown = false;
        goingDown ? num-- : num++;
        audioArray.push(audio);
    }
}

// Start Simulation -------------------------
function StartSimulationFromBeginning(){
    dist_between_rings = DISTANCE_BETWEEN_RINGS;
    ring_number = NUMBER_OF_RINGS;
    circle_radius = NODE_RADIUS;
    starting_angle = STARTING_ANGLE;
    num_of_audios = MAX_AUDIO_FILES;
    speed_multiplier = SPEED_MULTIPLIER;

    updateCanvas();
    // Get Audio Files
    audioArray = [];
    createAudioArray();
    // Shuffle
    if (doShuffle) shuffle(audioArray);
    // MAKE CIRCLE ARRAY
    circleArray = [];
    for (var i = 0; i<= ring_number; i++){
        var s = (ring_number + 7 - i) * speed_multiplier / (16000); // SPEED MATH
        circleArray.push(
            new Circle(
                c,
                x, // Starting X Value
                y-dist_between_rings*i, // Starting Y Value
                t, // Starting Angle
                s, // Speed Value
                circle_radius,  // Radius of Node
                dist_between_rings * (i+1), // Radius of Travel
                audioArray[i] // Audio Hit
            )
        );
    }
    // Janky Update Stuff to make sure visuals match system
    if (soundOn === false) {
        sound_button.src = "images/mute.png";
        sound_button.style.opacity = BUTTON_OPACITY_OFF;
    } 
    if (doShuffle === false) shuffle_button.style.opacity = BUTTON_OPACITY_OFF;
}
function drawLines() {
    c.beginPath();
    var first = circleArray[0];
    c.moveTo(first.x, first.y);
    for (var i=1;i<ring_number;i++){
        var circle = circleArray[i];
        c.lineTo(circle.x, circle.y);
    }
    c.strokeStyle = NODE_LINE_COLOR;
    c.stroke();
}
// Animate Function -------------------
function animate() {
    requestAnimationFrame(animate);
    updateCanvas();
    draw_background();
    drawLines();
    for (var i=0; i<ring_number;i++){
        var circle = circleArray[i];
        circle.update();
    }
}
// MAIN LINE ------------------------
StartSimulationFromBeginning(); 
animate();
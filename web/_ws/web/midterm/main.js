// 用戶資料暫存 (使用 localStorage 儲存用戶資訊)
let users = JSON.parse(localStorage.getItem("users")) || {};

// 註冊新帳號
function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username in users) {
        alert("用戶名稱已存在，請使用其他名稱。");
    } else if (username && password) {
        users[username] = password;
        localStorage.setItem("users", JSON.stringify(users));
        alert("註冊成功！請登入。");
        document.getElementById('loginError').style.display = "none";
    } else {
        alert("請輸入有效的用戶名稱和密碼！");
    }
}

// 驗證登入
function validateLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users[username] === password) {
        document.getElementById('loginModal').style.display = "none"; // 隱藏模態框
        start(); // 啟動遊戲
    } else {
        document.getElementById('loginError').style.display = "block";
    }
}

// 初始執行，讓使用者登錄
window.onload = function () {
    document.getElementById('username').focus();
};

function start(){
    //初始位置
    snake_position();
    //是否結束
    let lose = is_over();
    if(lose){
        //設定暫存
        sessionStorage.setItem("head_col", head.value);
        sessionStorage.setItem("body_col", body.value);
        sessionStorage.setItem("apple_col", apple_color.value);
        sessionStorage.setItem("level_list", level.value);


        document.body.addEventListener('keydown', play_again);
        return;
    }
    //清屏
    clear_screen();
    //eat
    eat();
    //apple
    apple();
    //snake
    snake();
    //score
    draw_score();

    //speed
    set_speed();

    timeout = setTimeout(start,1000/speed);
}
const spd = document.getElementById('speed');
const level = document.getElementById('level');

const c = document.getElementById('game');
const ctx = c.getContext('2d');

const head = document.getElementById('s_head');
const body = document.getElementById('s_body');
const apple_color = document.getElementById('apple');

class my_snake{
    constructor(x,y){
        this.x = x;
        this.y =y;
    }
}//class

let speed = 4;

let pixel_count = 40;   //每格移動大小
let pixel_size = 40;    //每格大小

let s_x = 5;
let s_y = 5;
const snakePart =[];
let s_len = 0;

let apple_x = 2;
let apple_y = 2;

let cont_x = 0;
let cont_y = 0;

let score = 0;
let sle = 0;
let bool_keycode_start = false; //判斷遊戲開始
let bool_s_move = false;        //判斷蛇移動

if(sessionStorage.getItem("head_col")){
    head.value = sessionStorage.getItem("head_col");
    body.value = sessionStorage.getItem("body_col");
    apple_color.value = sessionStorage.getItem("apple_col");
    level.value = sessionStorage.getItem("level_list");
    
    speed = parseInt(level.value, 10);
}//讀入暫存

function snake_position(){
    s_x =s_x + cont_x;
    s_y =s_y + cont_y;
}

function is_over(){
    let over = false;
    if(s_x < 0 || s_x == 10 ||s_y < 0 ||s_y == 10){
        over = true;
    }//超出邊界

    for(let i=0;i<snakePart.length;i++){
            if(s_x == snakePart[i].x && s_y == snakePart[i].y){
                over = true;
            }
    }//碰到身體

    if(over){
        ctx.fillStyle = "white";
        ctx.font = "50px Poppins";
        ctx.fillText("Game Over!", c.width/6.5, c.height /2);
        ctx.font = "40px Poppins";
        ctx.fillText("再玩一次?", c.width/3.5, c.height /2 + 50 );
        ctx.font = "25px Poppins";
        ctx.fillText("按空白鍵", c.width/2.7, c.height /2 +100 );
        bool_keycode = false;
    }//遊戲結束後流程

    return over;
}

function play_again(event) {
    if(event.keyCode == 32){



        location.reload();
    }
}

function clear_screen() {
    ctx.fillStyle= '#181818';
    ctx.fillRect(0, 0, 400, 400);

    ctx.strokeStyle = "#010101";
    for(let x = 0; x < 400; x+=40) {
        for(let y = 0; y < 400; y+=40) {
            ctx.strokeRect(x-0.5, y-0.5, 40, 40);  // 繪製矩形
        }
    }

}
function add_speed(){
    if(level.value == "4"){
        if(score > 10 && score%4 == 0){
            speed++;
        }
    }else if(level.value == "6"){
        if(score > 5 && score%2 == 0){
            speed++;
        }
    }else if(level.value == "7"){
        if(score > 5 && score%2 == 0){
            if(score >=15 && score %15 == 0){
                speed+=2;
            }else {
                speed++;
            }  
        }
    }else if(level.value == "10") {
        if(score > 5 && score%2 == 0){
            if(score >=10 && score %10 == 0){
                speed+=2;
            }else {
                speed+=2;
            } 
        }
    }//變速
}
function eat(){
    if(apple_x == s_x && apple_y == s_y){
        apple_x = Math.floor(Math.random()*10);
        apple_y = Math.floor(Math.random()*10);

        s_len++;
        score++;

        add_speed();
    }//頭碰到蘋果

    for(let i=0;i<snakePart.length;i++){
        let body = snakePart[i];

        if(apple_x == body.x && apple_y == body.y){
            apple_x = Math.floor(Math.random()*10);
            apple_y = Math.floor(Math.random()*10);

            s_len++;
            score++;

            add_speed();
        }//身體碰到蘋果
    }
    
    spd.innerHTML = "speed:"+speed;
}

function apple(){
    
    ctx.fillStyle = apple_color.value;
    ctx.fillRect(apple_x*pixel_count,apple_y*pixel_count,pixel_size,pixel_size);
}

function snake(){
    ctx.fillStyle = body.value;
    for(let i=0;i<snakePart.length;i++){
        let body = snakePart[i];
        ctx.fillRect(0.5+body.x*pixel_count,0.5+body.y*pixel_count,pixel_size,pixel_size);

    }//draw body

    for(let i=0;i<snakePart.length;i++){
        let body = snakePart[i];
        ctx.fillStyle = "white";

        ctx.strokeRect(body.x*pixel_count, body.y*pixel_count, pixel_size, pixel_size);
    }//draw body


    snakePart.push( new my_snake(s_x, s_y));
    if(snakePart.length > s_len){
        snakePart.shift();
    }
    ctx.fillStyle = head.value;
    ctx.fillRect(s_x*pixel_count,s_y*pixel_count,pixel_size,pixel_size);

    bool_s_move = true;
}

function draw_score() {
    ctx.fillStyle = "white";
    ctx.font = "30px Poppins";
    ctx.fillText("Score: " + score, c.width-150, 30);
}
function set_speed(){
    level.addEventListener('change', function(e) {
       if(e.target.value == "4"){
            speed = 4;
       }else if(e.target.value == "6"){
            speed = 6;
       }else if(e.target.value == "7"){
            speed = 7;
       }else{
            speed = 10; 
       }
      })
}


document.body.addEventListener('keydown', keyDown);

function keyDown(event) {
    if(bool_s_move){
        if(event.keyCode== 38 || event.keyCode== 87){
            bool_keycode = true;
            if(cont_y == 1 && s_len != 0){
                return;
            } //up
            cont_y = -1;
            cont_x = 0;

            bool_s_move = false;
        }
        if(event.keyCode == 40 || event.keyCode == 83){
            bool_keycode = true;
            if(cont_y == -1 && s_len != 0){
                return;
            }//down
            cont_y = 1;
            cont_x = 0;
            
            bool_s_move = false;
        }
        if(event.keyCode == 37 || event.keyCode== 65){
            bool_keycode = true;
            if(cont_x == 1 && s_len != 0){ 
                return;
            }//left
            cont_y = 0;
            cont_x = -1;
            
            bool_s_move = false;
        }
        if(event.keyCode == 39 || event.keyCode== 68){
            bool_keycode = true;
            if(cont_x == -1 && s_len != 0){ 
                return;
            }//right
            cont_y = 0;
            cont_x = 1;
            
            bool_s_move = false;
        }
        if(event.keyCode == 27 && bool_keycode == true){
            if(sle == 0){
                clearTimeout(timeout);
                sle++;
            }else{
                start();
                sle = 0;
            }
        }

    }
}

function play_again(event) {
    if(event.keyCode == 32){
        location.reload();
    }
}


start();
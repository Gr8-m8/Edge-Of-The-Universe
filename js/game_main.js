const Keys = [];

const CM = CanvasManager();
const MM = MusicManager();

var InGame = false;

const GOM = GameObjectManager();
const Player = NewPlayer();

//#region InGame
function Load(){
    
    CM.Q();
    MM.Q();

    InGame = false;

    LoadLobby();
    Update();
}

function Update(){
    if (Keys.includes("ESCAPE")){
        console.log("Escape");
        return 1;
    }

    if (Keys.includes("ENTER") && !InGame){
        console.log("Enter");
        InGame = true;
        LoadGame();
    }

    requestAnimationFrame(Update);

    if (InGame){
        UpdateGame();
    } else {
        UpdateLobby();
    }

    Draw();
}

function Draw(){
    CM.Clear();
    
    if (InGame){
        DrawGame();
    } else {
        DrawLobby();
    }
}
//#endregion

//#region InLobby
function LoadLobby(){
    GOM.Q();

    let scale = 0;
    scale = 3;
    GOM.GameObjetsAdd(NewUIText("THE_EDGE_OF_THE_UNIVERSE", [CM.Size()[0]/2, CM.Size()[1] * 1/5], 0, [scale, scale], [50, 0], "img/Blank1.png"));
    
    scale = 1;
    GOM.GameObjetsAdd(NewUIElem("img/Ship0.png", [CM.Size()[0]/2, CM.Size()[1] * 2/3], 180, [32, 32], [50, 57.5]));
    GOM.GameObjetsAdd(NewUIText("PRESS_ENTER_TO_START", [CM.Size()[0]/2, CM.Size()[1] * 2/3], 0, [scale, scale], [50, 0], "img/Blank1.png"));
    

    //GOM.GameObjetsAdd(NewUIText("1234567890_QWERTYUIOPASDFGHJKLZXCVBNM", [CM.Size()[0]/2, CM.Size()[1] - 32], 0, [scale, scale], [50, 0]));

}

function UpdateLobby(){
    GOM.Update();
}

function DrawLobby(){
    GOM.Draw();
}
//#endregion

//#region InPlayGame
function LoadGame(){
    CM.Elem.style.backgroundColor = "#000000";
    //CM.Elem.style.cursor = "none";

    //MM.Play(0);

    GOM.Q();
    GOM.GameObjetsAdd(Player);

    //GOM.GameObjetsAdd(NewPlanet([0, 0]));
}

function UpdateGame(){
    if (Keys.includes("W")){
        Player.Move();
    }

    if (Keys.includes("A")){
        Player.Turn(-1);
    }

    if (Keys.includes("D")){
        Player.Turn(1);
    }

    if (Keys.includes("S")){
        Player.Shoot();
    }

    GOM.Update();
}

function DrawGame(){
    GOM.Draw();
}

//#endregion

//#region Event
window.onload = function(event){
    Load();
}

window.onresize = function(event){
    CM.ReSize();
}

window.onkeydown = function(event){
    let key = event.key.toUpperCase();
    if (!Keys.includes(key)){
        //console.log(`+ ${key}`);
        Keys.push(key);
    }
}

window.onkeyup = function(event){
    let key = event.key.toUpperCase();
    if (Keys.includes(key)){
        //console.log(`- ${key}`);
        Keys.splice(Keys.indexOf(key), 1);
    }
}
//#endregion
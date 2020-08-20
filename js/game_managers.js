function CanvasManager(){
    let newCanvasManager = {};
    newCanvasManager.Elem = document.getElementById("canvas");
    newCanvasManager.Pen = newCanvasManager.Elem.getContext("2d");

    newCanvasManager.ReSize = function(){
        this.Elem.style.width = Math.min(window.innerWidth, window.innerHeight * 16/9) + "px";
        this.Elem.style.height = Math.min(window.innerHeight, window.innerWidth * 9/16) + "px";
        this.Elem.style.left = (window.innerWidth - parseInt(this.Elem.style.width.slice(0, this.Elem.style.width.length-2)))/2 + "px";
        CM.Pen.imageSmoothingEnabled = false;
    };

    newCanvasManager.Size = function(){
        //return [window.outerWidth, window.outerHeight];//window.outerWidth * 8/16];
        //return [window.innerWidth, window.innerHeight];
        return [this.Elem.width, this.Elem.height];
    };

    newCanvasManager.Clear = function(){
        this.Pen.clearRect(0, 0, this.Size()[0], this.Size()[1]);
    }

    newCanvasManager.Q = function(){
        this.ReSize();
    };

    return newCanvasManager;
}

function GameObjectManager(){
    let newGameObjectManager = {};
    newGameObjectManager.GameObjets = [];

    newGameObjectManager.Planets = [];

    newGameObjectManager.GameObjetsAdd = function(object){
        this.GameObjets.push(object);
        this.GameObjets[this.GameObjets.length -1].Q();
    }

    newGameObjectManager.GameObjetsRemove = function(object){
        if (this.GameObjets.includes(object)){
            this.GameObjets.splice(this.GameObjets.indexOf(object), 1);
        }
        return 0;
    }

    newGameObjectManager.SpawnPlanetCheck = function(){
        let spawnPosition = 
            [
                Math.floor(Player.Position[0]/CM.Size()[0]), 
                Math.floor(Player.Position[1]/CM.Size()[1])
            ];

        if (!this.Planets.includes(spawnPosition.toString())){
            this.Planets.push(spawnPosition.toString());
            this.GameObjetsAdd(NewPlanet([spawnPosition[0] + CM.Size()[0] * Math.random(), spawnPosition[1] + CM.Size()[1] * Math.random()]));
        }

        console.log(spawnPosition);
        console.log([spawnPosition[0] + CM.Size()[0] * Math.random(), spawnPosition[1] + CM.Size()[1] * Math.random()]);
    }

    newGameObjectManager.Update = function(){
        let markedForUpdate = [];
        let markedForDelete = [];

        for (let i = 0; i < this.GameObjets.length; i++){
            if (Math.abs(Player.Position[0] - this.GameObjets[i].Position[0]) < CM.Size()[0] && Math.abs(Player.Position[1] - this.GameObjets[i].Position[1]) < CM.Size()[1]){
                markedForUpdate.push(this.GameObjets[i]);
            } else {
                switch(this.GameObjets[i].Type){
                    default:
                        markedForDelete.push(this.GameObjets[i]);
                        break;

                        case "Planet":
                            break;

                        case "Item":
                            break;
                }
            }
        }

        for (let i = 0; i < markedForDelete.length; i++){
            this.GameObjetsRemove(markedForDelete[i]);
        }

        for (let i = 0; i < markedForUpdate.length; i++){
            markedForUpdate[i].Update();
            for (let j = markedForUpdate.length-1; j > 0; j--){
                if (i != j){
                    markedForUpdate[i].Collision(markedForUpdate[j]);
                }
            }
        }
    };

    newGameObjectManager.Draw = function(){
        let layers = [[], [], [], [], []];

        for (let k = 0; k < this.GameObjets.length; k++){
            if (Math.abs(Player.Position[0] - this.GameObjets[k].Position[0]) < CM.Size()[0] && Math.abs(Player.Position[1] - this.GameObjets[k].Position[1]) < CM.Size()[1]){
                switch(this.GameObjets[k].Type){
                    default:
                        layers[3].push(this.GameObjets[k])
                        break;

                        case "UI":
                        case "UIText":
                            layers[0].push(this.GameObjets[k]);
                            break;

                        case "Player":
                            layers[1].push(this.GameObjets[k]);
                            break;

                        case "Item":
                            layers[2].push(this.GameObjets[k]);
                            break;

                        case "Planet":
                            layers[4].push(this.GameObjets[k]);
                            break;

                }
            }
        }

        for (let i = layers.length-1; i > -1; i--){
            for (let j = 0; j < layers[i].length; j++){
                layers[i][j].Draw();
            }
        }
    };

    newGameObjectManager.Q = function(){
        this.GameObjets = [];
    }

    return newGameObjectManager;
}
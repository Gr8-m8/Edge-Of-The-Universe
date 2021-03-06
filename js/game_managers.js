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
        let scale = 3;
        let spawnPosition = 
            [
                Math.floor(Player.Transform.Position[0]/(CM.Size()[0] * scale)), 
                Math.floor(Player.Transform.Position[1]/(CM.Size()[1] * scale))
            ];

        //console.log(spawnPosition);
        
        if (spawnPosition[0] == 0 && spawnPosition[1] == 0){
            scale = 0;
        }

        if (!this.Planets.includes(spawnPosition.toString())){
            this.Planets.push(spawnPosition.toString());
            let newPlanet = NewPlanet([spawnPosition[0] * CM.Size()[0] * scale + CM.Size()[0] * scale * Math.random(), spawnPosition[1] * CM.Size()[1] * scale + CM.Size()[1] * scale * Math.random()]);
            this.GameObjetsAdd(newPlanet);

            //console.log(spawnPosition[0] * CM.Size()[0] * scale, newPlanet.Position[0], spawnPosition[0] * CM.Size()[0] * scale + CM.Size()[0] * scale);
            //console.log(spawnPosition[1] * CM.Size()[1] * scale, newPlanet.Position[1], spawnPosition[1] * CM.Size()[1] * scale + CM.Size()[1] * scale);
        }
    }

    newGameObjectManager.Update = function(){
        let markedForUpdate = [];
        let markedForDelete = [];
        let markedForStatis = [];

        let markedForCollision = [];

        for (let i = 0; i < this.GameObjets.length; i++){
            if (Math.abs(Player.Transform.Position.X() - this.GameObjets[i].Transform.Position.X()) < CM.Size()[0] && Math.abs(Player.Transform.Position.Y() - this.GameObjets[i].Transform.Position.Y()) < CM.Size()[1]){
                markedForUpdate.push(this.GameObjets[i]);
            } else {
                if (!this.GameObjets[i].includes(typeof(ComponentCollision))){
                    markedForStatis.push(this.GameObjets[i]);
                }
                if (this.GameObjets[i].Type.includes("Player") ||
                    this.GameObjets[i].Type.includes("Planet") ||
                    this.GameObjets[i].Type.includes("Item")){
                    markedForStatis.push(this.GameObjets[i]);
                } else {
                    markedForDelete.push(this.GameObjets[i]);
                }
            }
        }

        for (let i = 0; i < markedForUpdate.length; i++){
            markedForUpdate[i].Update();

            if (markedForUpdate[i].Components.includes(typeof(ComponentCollision)))
            {
                markedForCollision.push(markedForUpdate[i]);
            }
        }

        for (let i = 0; i < markedForCollision.length; i++){
            markedForUpdate[i].Update();
            for (let j = 0; j < markedForCollision.length; j++){
                if (i != j){
                    markedForCollision[j].Collision.CollisionCheck(markedForCollision[i]);
                }
            }
        }


        if (InGame){
            this.SpawnPlanetCheck();
        }
    };

    newGameObjectManager.Draw = function(){
        let layers = [[], [], [], [], []];

        for (let k = 0; k < this.GameObjets.length; k++){
            if (Math.abs(Player.Transform.Position.X() - this.GameObjets[k].Transform.Position.X()) < CM.Size()[0] && Math.abs(Player.Transform.Position.Y() - this.GameObjets[k].Transform.Position.Y()) < CM.Size()[1]){
                /*
                if (this.GameObjets[k].Type.includes("UI")){
                    layers[0].push(this.GameObjets[k]);
                } else

                if (this.GameObjets[k].Type.includes("Player")){
                    layers[1].push(this.GameObjets[k]);
                } else

                if (this.GameObjets[k].Type.includes("Item")){
                    layers[2].push(this.GameObjets[k]);
                } else 

                if (this.GameObjets[k].Type.includes("Planet")){
                    layers[4].push(this.GameObjets[k]);
                } 
                
                else {
                    layers[3].push(this.GameObjets[k])
                }
                */
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

function BackgroundManager(){
    let newBackgroundManager = {};

    newBackgroundManager.Objects = [];

    newBackgroundManager.Update = function(){
        for (let i = 0; i < this.Objects.length; i++){

            if (this.Objects[i].Transform.Position.X() - Player.Transform.Position.X() * (1/3) < (-CM.Size()[0])){
                this.Objects[i].Transform.Position.X() += CM.Size()[0] * 2;
            }

            if (this.Objects[i].Transform.Position.X() - Player.Transform.Position.X() * (1/3) > (CM.Size()[0])){
                this.Objects[i].Transform.Position.X() -= CM.Size()[0] * 2;
            }

            if (this.Objects[i].Transform.Position.Y() - Player.Transform.Position.Y() * (1/3) < (-CM.Size()[1])){
                this.Objects[i].Transform.Position.Y() += CM.Size()[1] * 2;
            }

            if (this.Objects[i].Transform.Position.Y() - Player.Transform.Position.Y() * (1/3) > (CM.Size()[1])){
                this.Objects[i].Transform.Position.Y() -= CM.Size()[1] * 2;
            }
        }
    }

    newBackgroundManager.Draw = function(){
        if (Keys.includes("H")){
            console.log(this.Objects);
        }

        for (let i = 0; i < this.Objects.length; i++){
            //this.Objects[i].Draw((1/3));
            this.Objects[i].Draw();
        }
    }

    newBackgroundManager.Q = function(){
        for(let i = 0; i < 64; i++){
            let position = [Math.random() * CM.Size()[0] * 2 - CM.Size()[0], Math.random() * CM.Size()[1] * 2 - CM.Size()[1]];
            let rotation = [Math.random() * 90 * 180/Math.PI];//180;
            let scale = [1, 1];
            newBackgroundManager.Objects.push(NewBackground(position, rotation, scale, "Blank1"));
        }
    }

    return newBackgroundManager;
}

function EventManager(){
    let newEventManager = {};

    newEventManager.triggerTimer;
    newEventManager.triggerTimerReset = function(){
        this.triggerTimer = 64 + Math.floor(Math.random() * 64);
    }

    newEventManager.Events = [[],[],[],[],[]];

    newEventManager.EventTriggerCheck = function(){
        this.triggerTimer--;
        if (this.triggerTimer <= 0){
            this.triggerTimerReset();

            let eventSector = 0;

            /*
            if (Math.random() * 100 > 25){
                if (Player.Position[0] < 0){
                    if (Player.Position[1] < 0){
                        eventSector = 1;
                    } else {
                        eventSector = 4;
                    }
                } else {
                    if (Player.Position[1] < 0){
                        eventSector = 2;
                    } else {
                        eventSector = 3;
                    }
                }
            }
            //*/

            //this.Events[eventSector][Math.floor(Math.random() * this.Events[eventSector].length)]();
        }
    }

    newEventManager.EventSpawnComet = function(){
        GOM.GameObjetsAdd(NewComet());
        
        //console.log("Event:Spawn_Comet"); // [" + spawnpos + "; " + rotation + "; "+ force + "]");
    }

    newEventManager.Update = function(){
        this.EventTriggerCheck();
    }

    newEventManager.Q = function(){
        this.triggerTimerReset();

        this.Events[0].push(this.EventSpawnComet);
    }

    return newEventManager;
}

function MusicManager(){
    let newMusicManager = {};
    newMusicManager.Music = [];
    newMusicManager.Current = undefined;
    newMusicManager.Volume = 0.1;

    newMusicManager.Play = function(index){
        if (this.Current != undefined){
            this.Current.pause();
        }
        this.Current = this.Music[index];
        this.Current.loop = true;
        this.Current.volume = this.Volume;
        this.Current.play();
    };

    newMusicManager.Q = function(){
        this.Music.push(new Audio("audio/EdgeOfTheUniverse_v0-1.mp3"));
    };

    return newMusicManager;
}
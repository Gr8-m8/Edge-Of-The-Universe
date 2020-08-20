function NewProjectile(setimgsrc = "img/Blank1.png", setPosition = [0, 0], setRotation = 0, setScale = [1, 1], setForceP = [0, 0], setForceR = 0){
    let newProjectile = NewProp("img/PlanetShade1.png", setPosition, setRotation, setScale, setForceP, setForceR);
    newProjectile.Type = "Projectile";

    newProjectile.FrameDisable = 3;

    newProjectile.Update = function(){
        this.FrameDisable = Math.max(0, this.FrameDisable -= 1);
        this.Rotation = this.Rotation + this.ForceR;
        this.Position = [this.Position[0] + this.ForceP[0], this.Position[1] + this.ForceP[1]];
    };

    return newProjectile;
}

function NewPlanet(setPosition){
    let ps = 50 + Math.random() * 10;
    let lp = [CM.Size()[0]/2, CM.Size()[1]/2];
    let cl = [];
    for (let i = 0; i < 1 + Math.floor(Math.random() * 5); i++){
        cl.push(new Image());
        cl[i].src = "img/Overlay" + (1 + Math.floor(Math.random() * 4)) + ".png";
    }

    let newPlanet = NewMesh("img/PlanetShade2.png", setPosition, Math.random() * 90, [1, 1]);
    newPlanet.Type = "Planet";
    //newPlanet.Rotation = 45 + (Math.atan2(lp[1] - (newPlanet.Position[1]), lp[0] - (newPlanet.Position[0])) * (180/Math.PI));
    newPlanet.Scale = [ps, ps];
    newPlanet.Colors = cl;

    newPlanet.Update = function(){
        
        /*
        newPlanet.Rotation = 45 + (Math.atan2(Player.Position[1] - this.Position[1], Player.Position[0] - this.Position[0]) * (180/Math.PI));

        if (Math.pow(Math.abs(Player.Position[0] - this.Position[0]), 2) + Math.pow(Math.abs(Player.Position[1] - this.Position[1]), 2) < Math.pow(6*16, 2)){
            if (this.Img.src != "img/PlanetShade1.png"){
                this.Img.src = "img/PlanetShade1.png";
                this.Rotation = 45;
            }
        } else{
            if (this.Img.src != "img/PlanetShade0.png"){
                this.Img.src = "img/PlanetShade0.png";
            }
        }
        */

        newPlanet.Rotation += 1/32;
    };

    newPlanet.Draw = function(){
        CM.Pen.translate(this.Position[0] - (Player.Position[0] - CM.Size()[0]/2), this.Position[1] - (Player.Position[1] - CM.Size()[1]/2));
        CM.Pen.rotate(Math.PI/180 * this.Rotation);
        CM.Pen.scale(this.Scale[0], this.Scale[1]);
        CM.Pen.drawImage(this.Img, - this.Img.width/2, - this.Img.height/2);
        for (let i = 0; i < this.Colors.length; i++){
            CM.Pen.drawImage(this.Colors[i], - this.Img.width/2, - this.Img.height/2);
        }

        CM.Pen.resetTransform();
    };

    newPlanet.Q = function(){
        for (let i = 0; i < Math.floor(3 + Math.random() * 10); i++){
            let pp = [
                (this.Position[0] - this.Size()[0]/4 + Math.random() * this.Size()[0]/2), 
                (this.Position[1] - this.Size()[1]/4 + Math.random() * this.Size()[1]/2)
            ];

            let materials = ["AL", "FE", "AU", "AG"];

            GOM.GameObjetsAdd(NewItem(pp, materials[Math.floor(Math.random() * materials.length)]));
        }
    }

    return newPlanet;
}

function NewPlayer(){
    let newPlayer = NewActor("img/Ship0.png", [0, 0], 180, [2, 2], [0, 0], 0, 100, []);
    newPlayer.Type = "Player";

    newPlayer.CoolDown = 16;
    
    newPlayer.UIPosition = NewUIText("0_0", [8, 8], 0, [1, 1], [0, 0], "img/Blank1.png");
    newPlayer.UIInventory = [];
    newPlayer.UIHealth = [
        NewUIElem("img/Blank1.png", [8, CM.Size()[1] - 16 - 8], 0, [100 * 2/16, 1], [0, 0]),
        NewUIElem("img/Blank2.png", [8, CM.Size()[1] - 16 - 8], 0, [100 * 2/16, 1], [0, 0]),
        NewUIText("100", [8 + (100 * 2)/2, CM.Size()[1] - 16 - 8], 0, [1, 1], [50, 0], "img/Blank0.png")
    ];

    newPlayer.CollisionEXE = function(other){
        switch (other.Type){
            default:
                return 0;
                break;

            case "Item":
                let itemID = other.ItemID;
                this.InventoryAdd(itemID);
                GOM.GameObjetsRemove(other);
                break;

            case "Planet":
                
                break;

            case "Projectile":
                if(other.FrameDisable <= 0){
                    this.Health -=10;
                    this.ForceP = [this.ForceP[0] * 0.5, this.ForceP[1] * 0.5];
                    GOM.GameObjetsRemove(other);
                }
                break;

        }
    }

    newPlayer.Move = function(){
        let max = 50;
        let acc = 1.001;

        this.ForceP = [
            Math.min(max, this.ForceP[0] + this.Forward()[0] * acc), 
            Math.min(max, this.ForceP[1] + this.Forward()[1] * acc)
        ];
    };

    newPlayer.Turn = function(lr){
        let max = 50;
        let acc = 1.001;
        this.ForceR = Math.min(max, 1 + Math.abs(this.ForceR)* acc) * lr;
    };

    newPlayer.Shoot = function(){
        if (this.CoolDown > 0){
            return false;
        }
        this.CoolDown = 12;

        let distance = 16;
        let force = 16;

        GOM.GameObjetsAdd(
            NewProjectile("img/PlanetShade1.png", 
                [this.Position[0] + this.Forward()[0] * distance, this.Position[1] + this.Forward()[1] * distance], 
                this.Rotation, [1, 1], [this.Forward()[0] * force + this.ForceP[0], this.Forward()[1] * force + this.ForceP[1]], 0)
            );
    };

    newPlayer.Update = function(){
        
        this.Rotation = this.Rotation + this.ForceR;
        this.Position = [this.Position[0] + this.ForceP[0], this.Position[1] + this.ForceP[1]];

        this.ForceP = [this.ForceP[0] * this.FrictionP, this.ForceP[1] * this.FrictionP];
        this.ForceR = this.ForceR * this.FrictionR;

        this.CoolDown = Math.max(0, this.CoolDown -= 1);

        this.UIPosition.TextSet("X" + Math.floor(this.Position[0]/(Math.pow(16, 2))) + "_Y" + Math.floor(this.Position[1]/(Math.pow(16, 2))));

        this.UIInventory = [];
        for (let i = 0; i < this.Inventory.length; i++){
            this.UIInventory.push(NewUIText(this.Inventory[i][0] + "_" + this.Inventory[i][1], [8, 16*3 + 16*i], 0, [1, 1], [0, 0], "img/Blank1.png"));
        }

        if (Keys.includes("P")){
            console.log(this.UIHealth[2]);
        }
        this.UIHealth[2].TextSet(this.Health.toString());
        this.UIHealth[1].Scale[0] = Math.min(100 * 2/16, this.Health * 2/16);
    };

    newPlayer.Draw = function(){
        CM.Pen.translate(this.Position[0] - (Player.Position[0] - CM.Size()[0]/2), this.Position[1] - (Player.Position[1] - CM.Size()[1]/2));
        CM.Pen.rotate(Math.PI/180 * this.Rotation);
        CM.Pen.scale(this.Scale[0], this.Scale[1]);
        CM.Pen.drawImage(this.Img, - this.Img.width/2, - this.Img.height/2);
        CM.Pen.resetTransform();

        this.UIPosition.Draw();
        for (let i = 0; i < this.UIInventory.length; i++){
            this.UIInventory[i].Draw();
        }

        for(let i = 0; i < this.UIHealth.length; i++){
            this.UIHealth[i].Draw();
        }

        
    };

    return newPlayer;
}
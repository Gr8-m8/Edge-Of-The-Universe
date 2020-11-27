function NewBaseObject(){
    let newBaseObject = {};

    newBaseObject.Components = [ComponentTransform(), ComponentGraphics(), ComponentPhysics(), ComponentCollision(), ComponentVitality(), ComponentInventory()];

    newBaseObject.Update = function()
    {
        for(let i = 0; i < this.Components.length; i++){this.Components[i].Update(); }
    };

    newBaseObject.Draw = function()
    {
        for(let i = 0; i < this.Components.length; i++){this.Components[i].Draw(); }
    };

    newBaseObject.Q = function()
    {

    };

    return newBaseObject;

}

function NewBackground(setPosition = [0,0], setRotation = [0], setScale = [1,1], setimgsrc = "Blank1"){
    let newBackground = {};

    newBackground.Transform = ComponentTransform(setPosition, setRotation, setScale);
    newBackground.Transform.Q();

    newBackground.Graphics = ComponentGraphics(setimgsrc);
    newBackground.Graphics.Q(newBackground.Transform);

    newBackground.Components = [newBackground.Transform, newBackground.Graphics];

    newBackground.Update = function(){ for(let i = 0; i < this.Components.length; i++){this.Components[i].Update(); }};
    newBackground.Draw = function(){ for(let i = 0; i < this.Components.length; i++){this.Components[i].Draw(); }};
    newBackground.Q = function(){};

    return newBackground;

}

function NewPlanet(setPosition){
    let pscale = 40 + Math.random() * 40;
    let lp = [CM.Size()[0]/2, CM.Size()[1]/2];
    let clr = [];
    for (let i = 0; i < 1 + Math.floor(Math.random() * 5); i++){
        clr.push(new Image());
        clr[i].src = "img/Overlay" + (1 + Math.floor(Math.random() * 4)) + ".png";
    }

    let newPlanet = {};
    
    newPlanet.Colors = clr;

    newPlanet.Transform = ComponentTransform(setPosition, [Math.random() * 90], [pscale, pscale]);
    newPlanet.Transform.Q();

    newPlanet.Graphics = ComponentGraphics();
    newPlanet.Graphics.Q(this.Transform);

    newPlanet.Components = [newPlanet.Transform, newPlanet.Graphics];

    newPlanet.Update = function()
    {
        for(let i = 0; i < this.Components.length; i++){this.Components[i].Update(); }
        /* LOOK AT PLAYER
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
        }*/

       newPlanet.Transform.Rotation += 1/(this.Transform.Scale.Q() * 32/40);
    };
    newPlanet.Draw = function()
    {
        for(let i = 0; i < this.Components.length; i++){this.Components[i].Draw(); }
        for (let i = 0; i < this.Colors.length; i++){
            CM.Pen.drawImage(this.Colors[i], - this.Graphics.Img.width/2, - this.Graphics.Img.height/2);
        }
    };
    newPlanet.Q = function()
    {
        for (let i = 0; i < Math.floor(3 + Math.random() * 10); i++){
            let planetpos = [
                (this.Transform.Position.X() - this.Transform.Scale.Q()/4 + Math.random() * this.Transform.Scale.X()/2), 
                (this.Transform.Position.Y() - this.Transform.Scale.Q()/4 + Math.random() * this.Transform.Scale.Y()/2)
            ];

            GOM.GameObjetsAdd(NewMineral(planetpos));
        }
    }

    return newPlanet;
}

//ITEMS
function NewItem(setPosition, setItemID){
    let newItem = {};
    newItem.ItemID = setItemID;

    newItem.Transform = ComponentTransform(setPosition);
    newItem.Transform.Q();

    newItem.Graphics = ComponentGraphics(false, "PlanetShade0");
    newItem.Graphics.Q(this.Transform);

    newItem.Collision = ComponentCollision(["GO", "ITEM"]);
    newItem.Collision.Q(this.Transform, this.Graphics);

    newItem.Collision.CollisionEXE = function(other){
        
        if (other.Collision.Tags.includes("ACTOR")){
            other.Inventory.AddItem(this.ItemID);
            GOM.GameObjetsRemove(this);

        }
    }


    newItem.Components = [newItem.Transform, newItem.Graphics, newItem.Collision];
    newItem.Update = function(){ for(let i = 0; i < this.Components.length; i++){this.Components[i].Update(); }};
    newItem.Draw = function(){ for(let i = 0; i < this.Components.length; i++){this.Components[i].Draw(); }};
    newItem.Q = function(){};

    return newItem;
}

function NewMineral(setPosition){
    let materials = ["AL", "FE", "AU", "AG"];
    let newMineral = NewItem(setPosition, materials[Math.floor(Math.random() * materials.length)]);

    newMineral.Collision.Tags.push("MINERAL");

    return newMineral;
}

//PROJECTILES
function NewProjectile(setimgsrc = "PlanetShade1", setPosition = [0, 0], setRotation = [0], setScale = [1, 1], setForceP = [0, 0], setForceR = [0]){
    let newProjectile = {};
    
    newProjectile.Transform = ComponentTransform(setPosition, setRotation, setScale);
    newProjectile.Transform.Q();

    newProjectile.Graphics = ComponentGraphics(setimgsrc);
    newProjectile.Graphics.Q(this.Transform);

    newProjectile.Physics = ComponentPhysics(setForceP, setForceR);
    newProjectile.Physics.Q(this.Transform);

    newProjectile.Collision = ComponentCollision(["GO", "PROJECTILE"], 3);
    newProjectile.Collision.Q(this.Transform, this.Graphics);

    newProjectile.Collision.CollisionEXE = function()
    {
        if (other.Collision.Tags.includes("ACTOR")){
            other.Vitality.Health -= 10;
            other.Physics.ForceP = [other.Physics.ForceP.X() * 1/2, other.Physics.ForceP.Y() * 1/2];
            GOM.GameObjetsRemove(this);
        }

        if (other.Collision.Tags.includes("COMET")){
            GOM.GameObjetsAdd(NewMineral(this.Transform.Position));
            GOM.GameObjetsRemove(other);
            GOM.GameObjetsRemove(this);
        }

        if (other.Collision.Tags.includes("PROJECTILE")){
            GOM.GameObjetsRemove(other);
            GOM.GameObjetsRemove(this);
        }
    }
    
    newProjectile.Components = [newProjectile.Transform, newProjectile.Graphics, newProjectile.Physics, newProjectile.Collision];
    newProjectile.Update = function(){ for(let i = 0; i < this.Components.length; i++){this.Components[i].Update(); }};
    newProjectile.Draw = function() { for(let i = 0; i < this.Components.length; i++){this.Components[i].Draw(); }};
    newProjectile.Q = function(){};

    return newProjectile;
}

function NewComet(){
    let spawnpos = [Player.Position[0] - (CM.Size()[0]/2), Player.Position[1] - (CM.Size()[1]/2)];
        if(Math.random() * 100 > 50){
            if(Math.random() * 100 > 50){
                spawnpos[0] += (CM.Size()[0]);
            }

            spawnpos[1] += Math.random() * (CM.Size()[1]);
        } else
        {
            if(Math.random() * 100 > 50){
                spawnpos[1] += (CM.Size()[1]);
            }

            spawnpos[0] += Math.random() * (CM.Size()[0]);
        }

    let rotation = (Math.atan2(Player.Position[1] - spawnpos[1], Player.Position[0] - spawnpos[0]) * (180/Math.PI) - 90 + (-10 + Math.random()*10));
    let force = [Math.sin(-rotation * Math.PI/180) * 3, Math.cos(-rotation * Math.PI/180) * 3];
    let scale = 3 + Math.random() * 10;

    let newComet = NewProjectile("PlanetShade1", spawnpos, [0], [scale, scale], force, [1 + Math.random() * 4]);
    newComet.Type.push("Comet");

    newComet.Q();

    return newComet;
}

//ACTORS
function NewActor(setimgsrc = "Blank1", setPosition = [0, 0], setRotation = [0], setScale = [1, 1]){
    let newActor = {};

    newActor.Transform = ComponentTransform(setPosition, setRotation, setScale);
    newActor.Transform.Q();

    newActor.Graphics = ComponentGraphics(setimgsrc);
    newActor.Graphics.Q(this.Transform);

    newActor.Physics = ComponentPhysics();
    newActor.Physics.Q(this.Transform);

    newActor.Collision = ComponentCollision(["GO", "Actor"]);
    newActor.Collision.Q(this.Transform, this.Graphics);

    newActor.Vitality = ComponentVitality();
    newActor.Vitality.Q();

    newActor.Inventory = ComponentInventory();
    newActor.Inventory.Q();
    
    newActor.Components = [newActor.Transform, newActor.Graphics, newActor.Collision, newActor.Vitality, newActor.Inventory];
    newActor.Update = function(){ for(let i = 0; i < this.Components.length; i++){this.Components[i].Update(); }};
    newActor.Draw = function(){ for(let i = 0; i < this.Components.length; i++){this.Components[i].Draw(); }};
    newActor.Q = function(){};

    return newActor;
}

function NewPlayer(){
    let newPlayer = NewActor("Ship0", [0, 0], [2, 2], 180);

    newPlayer.Collision.Tags.push("Player");

    newPlayer.CoolDown = 0;
    
    
    newPlayer.UIPosition = NewText("0_0", [8, 8], [0], [1, 1], [0, 0], "Blank1");
    newPlayer.UIInventory = [];
    newPlayer.UIHealth = [
        NewImg("Blank1", [8, CM.Size()[1] - 16 - 8], [0], [100 * 2/16, 1], [0, 0]),
        NewImg("Blank2", [8, CM.Size()[1] - 16 - 8], [0], [100 * 2/16, 1], [0, 0]),
        NewText("100", [8 + (100 * 2)/2, CM.Size()[1] - 16 - 8], [0], [1, 1], [50, 0], "Blank0")
    ];
    

    newPlayer.Move = function(){
        let max = 50;
        let acc = 1.001;

        this.Physics.ForceP = [
            Math.min(max, this.Physics.ForceP.X() + this.Transform.Forward()[0] * acc), 
            Math.min(max, this.Physics.ForceP.Y() + this.Transform.Forward()[1] * acc)
        ];
    };

    newPlayer.Turn = function(lr){
        let max = 50;
        let acc = 1.001;
        this.Physics.ForceR.Q() = Math.min(max, 1 + Math.abs(this.Physics.ForceR.Q()) * acc) * lr;
    };

    newPlayer.Shoot = function(){
        if (this.CoolDown > 0){
            return false;
        }
        this.CoolDown = 12;

        let distance = 16;
        let force = 16;

        GOM.GameObjetsAdd(
            NewProjectile("PlanetShade1", 
                [this.Transform.Position.X() + this.Transform.Forward()[0] * distance, this.Transform.Position.Y() + this.Transform.Forward()[1] * distance], 
                [this.Transform.Rotation.Q()], [1, 1], 
                [this.Transform.Forward()[0] * force + this.Physics.ForceP.X(), this.Transform.Forward()[1] * force + this.Physics.ForceP[1]], 0)
            );
    };


    newPlayer.Update = function(){
        for(let i = 0; i < this.Components.length; i++){this.Components[i].Update(); }

        this.CoolDown = Math.max(0, this.CoolDown -= 1);
        

        this.UIPosition.TextSet("X" + Math.floor(this.Transform.Position[0]/(Math.pow(16, 2))) + "_Y" + Math.floor(this.Transform.Position[1]/(Math.pow(16, 2))));

        this.UIInventory = [];
        for (let i = 0; i < this.Inventory.Items.length; i++){
            this.UIInventory.push(NewText(this.Inventory.Items[i][0] + "_" + this.Inventory.Items[i][1], [8, 16*3 + 16*i], 0, [1, 1], [0, 0], "Blank1"));
        }

        this.UIHealth[2].TextSet(this.Vitality.Health.toString());
        this.UIHealth[1].Transform.Scale[0] = Math.min(100 * 2/16, this.Vitality.Health * 2/16);
        
    };

    newPlayer.Draw = function(){
        for(let i = 0; i < this.Components.length; i++){this.Components[i].Draw(); }

        
        this.UIPosition.Draw();
        for (let i = 0; i < this.UIInventory.length; i++){
            this.UIInventory[i].Draw();
        }

        for(let i = 0; i < this.UIHealth.length; i++){
            this.UIHealth[i].Draw();
        }
        
    };

    newPlayer.Q();

    return newPlayer;
}

//UIELEMENTS
function NewImg(setimgsrc = "Blank0", setPosition = [0, 0], setRotation = [0], setScale = [1, 1], setAlign = [50, 0]){
    let newImg = {};

    newImg.Align = [setAlign[0]/100, setAlign[1]/100];

    newImg.Transform = ComponentTransform(setPosition, setRotation, setScale);
    newImg.Transform.Q();

    newImg.Graphics = ComponentGraphics(setimgsrc, true);
    newImg.Graphics.Q(this.Transform);

    newImg.Graphics.Draw = function()
    {
        CM.Pen.resetTransform();
        CM.Pen.translate(this.Transform.Position.X(), this.Transform.Position.Y());
        CM.Pen.rotate(Math.PI/180 * this.Transform.Rotation.Q());
        CM.Pen.scale(this.Transform.Scale.X(), this.Transform.Scale.Y());
        CM.Pen.drawImage(this.Graphics.Img, - this.Graphics.Img.width * this.Align[0], - this.Graphics.Img.height * this.Align[1]);
    }

    newImg.Components = [newImg.Transform, newImg.Graphics];
    
    newImg.Update = function(){ for(let i = 0; i < this.Components.length; i++){this.Components[i].Update(); }};
    //newImg.Draw = function(){ for(let i = 0; i < this.Components.length; i++){this.Components[i].Draw(); } };
    newImg.Q = function(){};


    return newImg;
}

function NewText(setText = "TEXT", setPosition = [0, 0], setRotation = [0], setScale = [1, 1], setAlign = [50, 0], setimgsrc = "Blank0"){
    let newText = NewImg(setimgsrc, setPosition, setRotation, setScale, setAlign);

    newText.Text = [];
    for (let i = 0; i < setText.length; i++){
        let img = new Image();
        img.src = "img/text/" + setText[i].toUpperCase() + ".png";
        newText.Text.push(img);
    };

    newText.TextSet = function(setText = ""){
        this.Text = [];
        for (let i = 0; i < setText.length; i++){
            let img = new Image();
            img.src = "img/text/" + setText[i].toUpperCase() + ".png";
            this.Text.push(img);
        };
    };

    newText.Graphics.Draw = function(){
        CM.Pen.translate(this.Transform.Position.X(), this.Transform.Position.Y());
        CM.Pen.rotate(Math.PI/180 * this.Transform.Rotation.Q());
        CM.Pen.scale(this.Transform.Scale.X(), this.Scale.Y());
        for (let i = 0; i < this.Text.length; i++){
            CM.Pen.drawImage(this.Graphics.Img, -this.Text.length * this.Text[i].width * this.Align[0] + this.Text[i].width * i, - this.Img.height * this.Align[1]);
            CM.Pen.drawImage(this.Text[i], -this.Text.length * this.Text[i].width * this.Align[0] + this.Text[i].width * i, - this.Img.height * this.Align[1]);
        }
        CM.Pen.resetTransform();
    };

    return newText;
}
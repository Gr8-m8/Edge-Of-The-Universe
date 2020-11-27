function ComponentTransform(setPosition = [0, 0], setRotation = [0], setScale = [1, 1]){
    let newTransform = {};

    //POSITION
    newTransform.Position = setPosition;
    newTransform.Position.X = function()
    {
        return newTransform.Position[0];
    };
    newTransform.Position.Y =  function()
    {
        return newTransform.Position[1];
    };

    //ROTATION
    newTransform.Rotation = setRotation;
    newTransform.Rotation.Q = function()
    {
        return newTransform.Rotation[0];
    };

    //SCALE
    newTransform.Scale = setScale;
    newTransform.Scale.Q = function()
    {
        return newTransform.Scale[0];
    };
    newTransform.Scale.X = function()
    {
        return newTransform.Scale[0];
    };
    newTransform.Scale.Y = function(){
        return newTransform.Scale[1];
    };

    //FUNC
    newTransform.Forward = function(){
        return [Math.sin(-this.Rotation.Q() * Math.PI/180), Math.cos(-this.Rotation.Q() * Math.PI/180)];
    };

    newTransform.LookAt = function(position, compensation = 0){
        newTransform.Rotation = [(Math.atan2(position[1] - this.Position.Y(), position[0] - this.Position.X()) * (180/Math.PI) + compensation)];
    };

    //INIT
    newTransform.Update = function(){};
    newTransform.Draw = function(){};
    newTransform.Q = function(){};
    return newTransform;
}

function ComponentPhysics(setForceP = [0, 0], setForceR = [0]){
    let newPhysics = {};

    newPhysics.Transform = undefined;

    //CONST
    newPhysics.FrictionP = 0.97;
    newPhysics.FrictionR = 0.90;

    //POSITION FORCE
    newPhysics.ForceP = setForceP;
    newPhysics.ForceP.X = function()
    {
        return newPhysics.ForceP[0];
    };
    newPhysics.ForceP.Y = function(){
        return newPhysics.ForceP[1];
    };

    //ROTATION FORCE
    newPhysics.ForceR = setForceR;
    newPhysics.ForceR.Q = function()
    {
        return newPhysics.ForceR[0];
    };

    //INIT
    newPhysics.Update = function(){
        console.log(this);
        this.Transform.Rotation.Q() = this.Transform.Rotation.Q() + this.ForceR.Q();
        this.Transform.Position = [this.Transform.Position.X() + this.ForceP.X(), this.Transform.Position.Y() + this.ForceP.Y()];

        console.log(this.ForceP);

        this.ForceP = [this.ForceP.X() * this.FrictionP, this.ForceP.Y() * this.FrictionP];
        this.ForceR = [this.ForceR.Q() * this.FrictionR];

        console.log(this.ForceP);
    };
    newPhysics.Draw = function(){};
    newPhysics.Q = function(setTransform){ newPhysics.Transform = setTransform; };
    return newPhysics;
}

function ComponentGraphics(setImg = "Blank1", setIsUI = false){
    let img = new Image(); 
    img.src = "img/" + setImg + ".png";
    
    let newGraphics = {};

    newGraphics.Transform = undefined;

    newGraphics.Img = img;

    newGraphics.IsUI = setIsUI;

    //INIT
    newGraphics.Update = function(){};
    newGraphics.Draw = function(ppp = 1){
        let CameraPos = [0,0];
        if(!this.IsUI){
            CameraPos = Player.Transform.Position;
        }

        CM.Pen.resetTransform();
        CM.Pen.translate(this.Transform.Position.X() - (CameraPos[0] * ppp - CM.Size()[0]/2), this.Transform.Position.Y() - (CameraPos[1] * ppp - CM.Size()[1]/2));
        CM.Pen.rotate(this.Transform.Rotation.Q());// * Math.PI/180);
        CM.Pen.scale(this.Transform.Scale.Q(), this.Transform.Scale.Q());
        CM.Pen.drawImage(this.Img, - this.Img.width/2, - this.Img.height/2);
    };
    newGraphics.Q = function(setTransform)
    {
        this.Transform = setTransform;
    };
    
    return newGraphics;
}

function ComponentCollision(setCollisionTags = ["GO"], setFrameDisable = 3){
    let newCollision = {};
    
    newCollision.Transform = undefined;
    newCollision.newGraphics = undefined;

    newCollision.Tags = setCollisionTags;

    newCollision.FrameDisable = setFrameDisable;

    //FUNC
    newCollision.CollisionCheck = function(other){
        /*
        if (other.Position[0] + other.Img.width * other.Scale[0] > this.Position[0] && 
            other.Position[0] < this.Position[0] + this.Img.width * this.Scale[0] &&
            other.Position[1] + other.Img.height * other.Scale[1] > this.Position[1] && 
            other.Position[1] < this.Position[1] + this.Img.height * this.Scale[1]){
                this.CollisionEXE(other);
                return true;
            }
        */

        if (
            Math.pow(this.Transform.Position.X() - other.Transform.Position.X(), 2) + 
            Math.pow(this.Transform.Position.Y() - other.Transform.Position.Y(), 2) < 
            (Math.max(this.newGraphics.Img.width * this.Transform.Scale.X(), this.newGraphics.Img.height * this.Transform.Scale.Y()) + 
            Math.max(other.Graphics.Img.width * other.Transform.Scale.X(), other.Graphics.Img.height * other.Transform.Scale.Y())) * 16)
        {
            if(this.FrameDisable > 0){
                return [false, this.FrameDisable];
            } else {
                this.CollisionEXE(other);
                return true;
            }
        }

        return false;
    };

    newCollision.CollisionEXE = function(other){};

    //INIT
    newCollision.Update = function()
    {
        if(this.FrameDisable > 0)
        {
            this.FrameDisable--;
        } 
    };
    newCollision.Draw = function(){};
    newCollision.Q = function(setTransform, setGraphics)
    {
        this.Transform = setTransform;
        this.Graphics = setGraphics;
    };

    return newCollision;
}

function ComponentInventory(setItems = [["Inventory", -1]]){
    let newInventory = {};

    newInventory.Items = setItems;

    newInventory.AddItem = function(itemID){
        for (let i = 0; i < this.Items.length; i++){
            if (this.Items[i][0] == itemID){
                this.Items[i][1]++;
                return this.Items[i][1];
            }
        }

        this.Inventory.push(Array(itemID, 1));
        return 1;
    };
    
    newInventory.RemoveItem = function(itemID){
        for (let i = 0; i < this.Items.length; i++){
            if (this.Items[i][0] == itemID){
                if (this.Items[i][1] > 0){
                    this.Items[i][1]--;
                    return 1;
                } else {
                    return 0;
                }
            }
        }

        return 0;
    };

    newInventory.CraftItem = function(){};

    //INIT
    newInventory.Update = function(){};
    newInventory.Draw = function(){};
    newInventory.Q = function(){};
    return newInventory;
}

function ComponentVitality(setHealth = 100, setFuel = 100){
    let newVitality = {};

    newVitality.Health = setHealth;

    newVitality.Fuel = setFuel;

    //INIT
    newVitality.Update = function(){};
    newVitality.Draw = function(){};
    newVitality.Q = function(){};
    return newVitality;
}
function NewUIElem(setimgsrc = "img/Blank0.png", setPosition = [0, 0], setRotation = 0, setScale = [1, 1], setAlign = [50, 0]){
    let newUIElem = NewMesh(setimgsrc, setPosition, setRotation, setScale);
    newUIElem.Type = "UI";
    newUIElem.Align = [setAlign[0]/100, setAlign[1]/100];

    newUIElem.Draw = function(){
        CM.Pen.translate(this.Position[0], this.Position[1]);
        CM.Pen.rotate(Math.PI/180 * this.Rotation);
        CM.Pen.scale(this.Scale[0], this.Scale[1]);
        CM.Pen.drawImage(this.Img, - this.Img.width * this.Align[0], - this.Img.height * this.Align[1]);
        CM.Pen.resetTransform();
    };

    return newUIElem;
}

function NewUIText(setText = "TEXT", setPosition = [0, 0], setRotation = 0, setScale = [1, 1], setAlign = [50, 0], setimgsrc = "img/Blank0.png"){
    let newUIText = NewUIElem(setimgsrc, setPosition, setRotation, setScale, setAlign);
    newUIText.Type = "UIText";

    newUIText.Text = [];
    for (let i = 0; i < setText.length; i++){
        let img = new Image();
        img.src = "img/text/" + setText[i].toUpperCase() + ".png";
        newUIText.Text.push(img);
    };

    newUIText.TextSet = function(setText = ""){
        this.Text = [];
        for (let i = 0; i < setText.length; i++){
            let img = new Image();
            img.src = "img/text/" + setText[i].toUpperCase() + ".png";
            this.Text.push(img);
        };
    };

    newUIText.Draw = function(){
        CM.Pen.translate(this.Position[0], this.Position[1]);
        CM.Pen.rotate(Math.PI/180 * this.Rotation);
        CM.Pen.scale(this.Scale[0], this.Scale[1]);
        for (let i = 0; i < this.Text.length; i++){
            CM.Pen.drawImage(this.Img, -this.Text.length * this.Text[i].width * this.Align[0] + this.Text[i].width * i, - this.Img.height * this.Align[1]);
            CM.Pen.drawImage(this.Text[i], -this.Text.length * this.Text[i].width * this.Align[0] + this.Text[i].width * i, - this.Img.height * this.Align[1]);
        }
        CM.Pen.resetTransform();
    };

    return newUIText;
}
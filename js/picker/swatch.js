Picker.Swatch = function( conf ){
    this.colour   = new Colour( conf.format, conf.colour );
    this.position = { x: conf.x, y: conf.y };    
    this.size     = conf.size;
    this.sides    = 6;
    this.ctx      = conf.ctx;
}

Picker.Swatch.prototype = {

    draw: function(){
        var Xcenter = this.position.x + this.size,
            Ycenter = this.position.y + this.size;
 
        this.ctx.save(); 
        this.ctx.beginPath();
        this.ctx.moveTo( Xcenter + this.size * Math.cos(0), Ycenter + this.size * Math.sin(0) );
 
        for (var i = 1; i <= this.sides; i++) {
            this.ctx.lineTo( 
                Xcenter + this.size * Math.cos( i * 2 * Math.PI / this.sides ), 
                Ycenter + this.size * Math.sin( i * 2 * Math.PI / this.sides ) 
            );
        }   

        this.ctx.shadowBlur  = 4;
        this.ctx.shadowColor = '#999';
        this.ctx.fillStyle   = this.colour.HEX();
        this.ctx.strokeStyle = "#000000";
        this.ctx.lineWidth   = 1;

        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();

        this.ctx.font         = Math.ceil(this.size / 2.5) + "px Courier";
        this.ctx.textAlign    = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle    = ( this.colour.lightOrDark() === 'dark' ) ? '#FFF' : '#000' ;

        this.ctx.fillText( this.colour.HEX(), this.position.x + this.size, this.position.y + this.size );
    }
}

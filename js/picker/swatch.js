Picker.Swatch = function( conf ){
    this.colour   = conf.colour;
    this.position = { x: conf.x, y: conf.y };    
    this.size     = conf.size;
    this.sides    = 6;
    this.scale    = 1;
    this.shadow   = 4;
    this.ctx      = conf.ctx;
    this.points   = this.buildShape();
}

Picker.Swatch.prototype = {

    buildShape: function(){
        var size    = this.size,
            Xcenter = this.position.x + size,
            Ycenter = this.position.y + size,
            shape = [];

        size *= this.scale;

        shape.push({ 
            x: Xcenter + size * Math.cos(0), 
            y: Ycenter + size * Math.sin(0) 
        });
 
        for (var i = 1; i <= this.sides; i++) {
            shape.push({
                x: Xcenter + size * Math.cos( i * 2 * Math.PI / this.sides ), 
                y: Ycenter + size * Math.sin( i * 2 * Math.PI / this.sides ) 
            });
        }

        return shape;
    },

    draw: function(){
        this.ctx.save(); 
        this.ctx.beginPath();
        this.ctx.moveTo( this.points[0].x, this.points[0].y );
 
        for (var i = 1; i < this.points.length; i++) {
            this.ctx.lineTo( this.points[i].x, this.points[i].y );
        }   

        $.extend( this.ctx, { 
            shadowBlur: this.shadow * this.scale,
            shadowColor: '#999',
            fillStyle: this.colour.HEX(),
            strokeStyle: "#000000",
            lineWidth: 1 * this.scale,
            font: Math.ceil(this.size / 2.5) * this.scale + "px Courier",
            textAlign: 'center',
            textBaseline: 'middle'
        });

        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        this.ctx.stroke();
        this.ctx.fillStyle = ( this.colour.lightOrDark() === 'dark' ) ? '#FFF' : '#000' ;
        this.ctx.fillText( this.colour.HEX(), this.position.x + this.size, this.position.y + this.size );
        this.ctx.restore();
    },

    isTarget: function(x, y){
        var a, b, p1, p2, red, blue,
            eps   = 0.0001,
            inf   = 1e600,
            count = 0;

        for(var i = 0; i < this.points.length - 1; i++){
            p1 = i;
            p2 = (i === this.points.length) ? 0 : i + 1;
            a  = this.points[p1];
            b  = this.points[p2];

            if( a.y > b.y ){
                a = this.points[p2];
                b = this.points[p1];
            }

            if ( (y == a.y) || (y == b.y) )
                y += eps;

            if( (y < a.y) || (y > b.y) || (x > Math.max( a.x, b.y )) )
                continue;

            if( y < Math.min(a.x, b.x) ){
                count++;
                continue;
            }
 
            red = ( a.x != b.x ) ? ( b.y - a.y ) / ( b.x - a.x ) : inf;
            blue = ( a.x != x ) ? ( y - a.y ) / ( x - a.x ) : inf;
 
            if( blue >= red )
                count++;
        }

        return ( count % 2 == 0 ) ? false : true; 
    }
}

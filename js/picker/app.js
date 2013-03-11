var Picker = {};

Picker.app = (function($){

    return {
        init: function(){
            var width   = $(window).width()  - 20,
                height  = $(window).height() - 100,
                wrapper = $('#picker');

            wrapper.append('<canvas id="pickerCanvas" width="'+width+'px" height="'+height+'px"></canvas>');

            this.doLayout();

            var resizeTimer;

            $(window).resize($.proxy( function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout( $.proxy( function(){
                    this.clearLayout();
                    this.doLayout();   
                }, this), 100);
            }, this));
        },

        clearLayout: function(){
            var canvas = $("#pickerCanvas")[0];
            var ctx    = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        },

        doLayout: function(){
            var width   = $(window).width()  - 20,
                height  = $(window).height() - 100;

            var canvas   = $("#pickerCanvas")[0],
                context  = canvas.getContext("2d");
                tileSize = Math.floor( Math.sqrt( ( ( width * height ) / 216 ) ) * 0.485 ),
                offset   = 0,
                x = y = 1;

            context.canvas.width  = width;
            context.canvas.height = height;

            var colours = this.webSafeColours();

            $.each( colours, $.proxy( function( i, colour ){
                this.drawPolygon(context, 6, colour, x, y, tileSize );

                x += tileSize * 3.6;

                if( x >= $("#picker").width() - tileSize * 2 ){
                    y += tileSize + 2;
                    offset = ( offset === 0 ) ? 1.8 : 0;
                    x = (tileSize * offset) + 1;
                }
            }, this));
        },

        drawPolygon: function(ctx, sides, colour, x, y, size){
            var Xcenter = x + size,
                Ycenter = y + size;
            
            ctx.save(); 
            ctx.beginPath();
            ctx.moveTo (Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0));          
            
            for (var i = 1; i <= sides; i++) {
                ctx.lineTo (Xcenter + size * Math.cos(i * 2 * Math.PI / sides), Ycenter + size * Math.sin(i * 2 * Math.PI / sides));
            }

            ctx.shadowBlur  = 4;
            ctx.shadowColor = '#999';
            ctx.fillStyle   = colour.HEX();
            ctx.strokeStyle = "#000000";
            ctx.lineWidth   = 1;

            ctx.fill();
            ctx.stroke();
            ctx.restore();

            ctx.font         = Math.ceil(size / 2.5) + "px Courier";
            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle    = ( colour.lightOrDark() === 'dark' ) ? '#FFF' : '#000' ;

            ctx.fillText( colour.HEX(), x + size , y + size );
        },

        drawSquare: function(ctx, colour, x, y , size){
            ctx.fillStyle = colour;
            ctx.fillRect( x, y, size, size );
            ctx.font="10px Courier";
            ctx.fillText( colour, x + 2 , y + 2);
        },

        webSafeColours: function(){
            var c, colours = [];

            for( var red = 255; red >= 0; red -= 51 ){
                for( var green = 255; green >= 0; green -= 51 ){
                    for( var blue = 255; blue >= 0; blue -= 51 ){
                        c = new Colour('RGB', { r: red, g: green, b: blue });
                        colours.push( c );
                    }
                }
            }
            colours.sort( function(a,b){
                return b.HSV().v - a.HSV().v;
            });
            return colours;
        }
    }
})(jQuery);

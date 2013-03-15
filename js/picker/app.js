var Picker = {};

Picker.app = (function($){
    return {

        init: function(){
            var width   = $(window).width()  - 20,
                height  = $(window).height() - 70,
                wrapper = $('#picker');

            wrapper.append('<canvas id="pickerCanvas" width="'+width+'px" height="'+height+'px"></canvas>');

            this.getSwatches();
            this.doLayout();

            var resizeTimer;

            $(window).resize($.proxy( function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout( $.proxy( function(){
                    this.getSwatches();
                    this.clearLayout();
                    this.doLayout();   
                }, this), 100);
            }, this));

            var canvas = $("#pickerCanvas")[0];
            var rect   = canvas.getBoundingClientRect();

            canvas.addEventListener('click', $.proxy( function(e){
                    var x = e.x - rect.left,
                        y = e.y - rect.top;

                    $.each( this.swatches, $.proxy( function(i, s){
                        if( s.isTarget( x, y ) ){
                            console.log('click ' + s.colour.HEX() );
                            return false;
                        }
                    }, this));
            }, this), false);
        },

        clearLayout: function(){
            var canvas = $("#pickerCanvas")[0];
            var ctx    = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        },

        doLayout: function(){
            var width   = $(window).width()  - 20,
                height  = $(window).height() - 100,
                canvas  = $("#pickerCanvas")[0],
                context = canvas.getContext("2d");

            context.canvas.width  = width;
            context.canvas.height = height;

            $.each( this.swatches, $.proxy( function( i, swatch ){
                swatch.draw();
            }, this));
        },

        getSwatches: function(){
            var width   = $(window).width()  - 20,
                height  = $(window).height() - 100;

            var canvas   = $("#pickerCanvas")[0],
                context  = canvas.getContext("2d");
                offset   = 0,
                x = y = 1;

            var tileSize = Math.floor( Math.sqrt( ( ( width * height ) / 216 ) ) * 0.485 ),
                colours = this.webSafeColours();

            this.swatches = [];

            $.each( colours, $.proxy( function( i, colour ){
                var swatch = new Picker.Swatch({
                    colour: colour,
                    format: 'RGB',
                    x: x,
                    y: y,
                    size: tileSize,
                    ctx: context
                });

                this.swatches.push( swatch );

                x += tileSize * 3.6;

                if( x >= $("#picker").width() - tileSize * 2 ){
                    y += tileSize + 2;
                    offset = ( offset === 0 ) ? 1.8 : 0;
                    x = (tileSize * offset) + 1;
                }
            }, this));
        },

        webSafeColours: function(){
            var c, colours = [];

            for( var red = 255; red >= 0; red -= 51 ){
                for( var green = 255; green >= 0; green -= 51 ){
                    for( var blue = 255; blue >= 0; blue -= 51 ){
                        c = { r: red, g: green, b: blue };
                        colours.push( new Colour( 'RGB', c ) );
                    }
                }
            }
            return colours.sort( function(a,b){
                return b.HSV().h - a.HSV().h;
            });
        }
    }
})(jQuery);

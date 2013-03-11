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

                var swatch = new Picker.Swatch({
                    colour: colour,
                    format: 'RGB',
                    x: x,
                    y: y,
                    size: tileSize,
                    ctx: context
                });

                swatch.draw();

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
                        colours.push( c );
                    }
                }
            }
            return colours;
        }

    }
})(jQuery);

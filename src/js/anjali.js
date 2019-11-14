var typestring = [];
        var year = [];


        function reset() {
           
            for (var i = 0; i < particleSystem.geometry.vertices.length; i++) {

                particleSystem.geometry.colors[i].set("yellow");
            }
            particleSystem.geometry.colorsNeedUpdate = true;
        }
       
        function typeview(a) {
            reset();
            for (var i = 0; i < particleSystem.geometry.vertices.length; i++) {

                if (data[i].t == a) {

                    particleSystem.geometry.colors[i].set("red");
                }
                else {
                    particleSystem.geometry.colors[i].set("#000000");
                }
            }
            particleSystem.geometry.colorsNeedUpdate = true;
        }

        function yearview(b) {
            reset();
            var y = 0;
            for (var i = 0; i < particleSystem.geometry.vertices.length; i++) {
                var x = data[i].time.split(".");
             
                if (x[0] == b ) {
                    y++;
                    particleSystem.geometry.colors[i].set("white");
                }
                else {
                    particleSystem.geometry.colors[i].set("#000000");
                }
            }
            $("#count").text("Number of discoveries in "+b+" : "+y);
            particleSystem.geometry.colorsNeedUpdate = true;
        }
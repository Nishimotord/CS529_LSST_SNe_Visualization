/* author: Andrew Burks */
"use strict";
/* Get or create the application global variable */
var App = App || {};


const ParticleSystem = function () {

    // setup the point,er to the scope 'this' variable
    const self = this;

    // data container
    const data = [];
   
    // scene graph group for the particle system
    const sceneObject = new THREE.Group();

    // bounds of the data
    const bounds = {};

    var particleSystem;
   
 
    // creates the particle system
    self.createParticleSystem = function () {

        // use self.data to create the particle system
        // draw your particle system here!
        const radius = (bounds.maxX - bounds.minX) / 2.0 + 1;
        const height = (bounds.maxY - bounds.minY) + 1;

        var pmaterial = new THREE.PointsMaterial({
            color: 'rgb(255, 255, 255)',
            size: 2,
            side: THREE.DoubleSide,
            sizeAttenuation: false,
            vertexColors: THREE.VertexColors,

        });
        var typestring = [];
        var year = [];
      
        var particleGeo = new THREE.Geometry();
        data.forEach(p => {
            const vector = new THREE.Vector3(p.X, p.Y, p.Z);
            particleGeo.vertices.push(vector);
            typestring.push(p.t);
            year.push(p.time);
            particleGeo.colors.push(new THREE.Color(0xF6F613)); //yellow
            
       
        });

        
       
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
        

        d3.select('#b3')
            .on('click', reset)

        var c = 0;
        d3.select('#b5')
            .on('click', function () {
                c++;
                var x = document.getElementById("b5").value;
                if (c % 2 == 0) {
                    typeview(x);
                    if (x == "none") {
                        reset();
                    }
                }
                
            }
        )

        var k = 0;
        d3.select('#b4')
            .on('click', function () {
                k++;
                var x = document.getElementById("b4").value;
                if (k % 2 == 0) {
                    yearview(x);
                    if (x == "none") {
                        reset();
                    }
                }

            }
            )
        
        particleSystem = new THREE.Points(
            particleGeo,
            pmaterial
        );
       

        

        particleSystem.translateY(-5);
        particleSystem.name = 'part1';

        var geometry = new THREE.PlaneGeometry(2 * radius + 1, height + 2);
        var material = new THREE.MeshBasicMaterial({ color: 'pink', side: THREE.DoubleSide, opacity: 0, wireframe: true, transparent:true});
        var plane = new THREE.Mesh(geometry, material);
        plane.geometry.translate(0, (bounds.maxY - bounds.minY + 2) / 2, 0);

        plane.name = 'gplane1';

        sceneObject.add(plane);
        plane.translateY(-7);
        sceneObject.add(particleSystem);
        var mov = 0.05;
    };
    //function onDocumentMouseMove(event) {
    //    event.preventDefault();
    //    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    //}


    // data loading function
    self.loadData = function (file) {

        // read the csv file
        d3.csv(file)
            // iterate over the rows of the csv file
            .row(function (d) {

                // get the min bounds
                bounds.minX = Math.min(bounds.minX || Infinity, d.x);
                bounds.minY = Math.min(bounds.minY || Infinity, d.y);
                bounds.minZ = Math.min(bounds.minZ || Infinity, d.z);

                // get the max bounds
                bounds.maxX = Math.max(bounds.maxX || -Infinity, d.x);
                bounds.maxY = Math.max(bounds.maxY || -Infinity, d.y);
                bounds.maxZ = Math.max(bounds.maxY || -Infinity, d.z);

                // add the element to the data collection
                data.push({
                    // Position
                    X: Number(d.x),
                    Z: Number(d.y),
                    Y: Number(d.z),
                    //
                    t: String(d.type),
                    time: String(d.t),
                });
            })
            // when done loading
            .get(function () {
                // draw the containment cylinder
                // TODO: Remove after the data has been rendered
                //self.drawContainment();

                // create the particle system
                self.createParticleSystem();
            });
    };

    // publicly available functions
    self.public = {

        // load the data and setup the system
        initialize: function (file) {
            self.loadData(file);
        },

        // accessor for the particle system
        getParticleSystems: function () {
            return sceneObject;
        }
    };

    return self.public;

};
// JavaScript source code
/* 
Authors: 
  Pavana Doddi
  Ryan Nishimoto
  Anjali Yadla

LSST SNe Visualization Project
CS529: Visual Data Science 
University of Illinois at Chicago

Built on Andrew Burk's Project 3 Base code
*/
"use strict";
/* Create a Threejs scene for the application */

/* Get or create the application global variable */
var App = App || {};

/* Create the scene class */
const Scene = function (options) {
    // setup the pointer to the scope 'this' variable
    const self = this;

    // scale the width and height to the screen size
    const width = d3.select(".particleDiv").node().clientWidth;
    const height = width / 2;
 
    self.scene = new THREE.Scene();
    var cameraRig = new THREE.Group();

   
    self.scene.add(cameraRig);


    // create the scene
    var cameraOrtho = new THREE.PerspectiveCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
    var Milkyway = 0.016203884;
    var Andromeda = 0.0337261533;
    var MwToA = 0.78 / 2;
    var LocalGroup = 1.533006969;
    var observableRadius = 14257;

    var geometry1 = new THREE.RingGeometry(0.9 * Milkyway, 1.0 * Milkyway, 64);
    var geometry2 = new THREE.RingGeometry(0.9 * Andromeda, 1.0 * Andromeda, 64);
    var geometry3 = new THREE.RingGeometry(0.9 * MwToA, 1.0 * MwToA, 64);
    var geometry4 = new THREE.RingGeometry(0.9 * LocalGroup, 1.0 * LocalGroup, 64);
    var geometry5 = new THREE.RingGeometry(0.9 * observableRadius, 1.0 * observableRadius, 64);
    var RingMaterial = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
    });
    var ringMesh1 = new THREE.Mesh(geometry1, RingMaterial);
    var ringMesh2 = new THREE.Mesh(geometry2, RingMaterial);
    var ringMesh3 = new THREE.Mesh(geometry3, RingMaterial);
    var ringMesh4 = new THREE.Mesh(geometry4, RingMaterial);
    var ringMesh5 = new THREE.Mesh(geometry5, RingMaterial);
    cameraRig.add(ringMesh1);
    cameraRig.add(ringMesh2);
    cameraRig.add(ringMesh3);
    cameraRig.add(ringMesh4);
    cameraRig.add(ringMesh5);



    self.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, -1);
    self.camera.position.set(20000, 20000, 20000);
    self.camera.up = new THREE.Vector3(0, 1, 0);
    self.camera.lookAt(0, 0, 0);

    // Add a directional light to show off the objects
    // Position the light out from the scene, pointing at the origin

    // add the light to the camera and the camera to the scene
    self.scene.add(self.camera);
    self.scene.add(cameraOrtho);

    self.scene.background = new THREE.Color(0x000000);
    // create the renderer
    self.renderer = new THREE.WebGLRenderer();

    // set the size and append it to the document
    self.renderer.setSize(width, height);
    document
        .getElementById(options.container)
        .appendChild(self.renderer.domElement);

    // enable camera controls with OrbitControls library
    self.controls = new THREE.OrbitControls(
        self.camera,
       
        self.renderer.domElement

    );
    //var x = new THREE.OrbitControls(cameraOrtho)
    //x.controls.enabled = false;
    document.getElementById("reset").addEventListener("click", reset);
    function reset() {
        self.camera.position.set(20000, 20000, 20000);
        self.camera.lookAt(0, 0, 0);
    }
    // enables panning up/down instead of dolly_pan...
    self.controls.screenSpacePanning = true;
    //self.controls.update();
    // expose the public functions
    // Try on the console App.scene and you should see these
    // three functions. Every other element acts as a private
    // attribute or function. For more information, check
    // javascript module patterns.
    self.public = {
        resize: function () { },

        addObject: function (obj) {
            self.scene.add(obj);
        },

        render: function () {
            requestAnimationFrame(self.public.render);
            self.controls.update();
            ringMesh5.lookAt(self.camera.position);
            ringMesh4.lookAt(self.camera.position);
            ringMesh3.lookAt(self.camera.position);
            ringMesh2.lookAt(self.camera.position);
            ringMesh1.lookAt(self.camera.position);
            self.renderer.render(self.scene, self.camera);
        }
    };
    return self.public;
};

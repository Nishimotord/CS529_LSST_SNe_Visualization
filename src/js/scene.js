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
    //var frustumSize = 600;
    //var aspect = width / height;
    self.scene = new THREE.Scene();
  //  var cameraRig = new THREE.Group();

    //cameraRig.add(cameraOrtho);
   
    //self.scene.add(cameraRig);
    // create the scene


    //var cameraOrtho = new THREE.PerspectiveCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
    //var cameraOrthoHelper = new THREE.CameraHelper(cameraOrtho);

    //var rad = 1500;
    //var geometry = new THREE.RingGeometry(1.9 * rad, 2.0 * rad, 64);
    //var geometry1 = new THREE.RingGeometry(0.9 * rad, 1.0 * rad, 64);
    ////, 5, 0, Math.PI * 2.
    //var RingMaterial = new THREE.MeshBasicMaterial({
    //    //map: ringTex,
    //    side: THREE.DoubleSide,
    //    transparent: true,
    //    opacity: 0.5,
    //});
    //var ringMesh = new THREE.Mesh(geometry, RingMaterial);
    //var ringMesh1 = new THREE.Mesh(geometry1, RingMaterial);
    //cameraRig.add(ringMesh);
    //cameraRig.add(ringMesh1);
   // cameraRig.position.set(0, 0, 0);
   // cameraOrthoHelper.controls.enableRotate=false;
    //cameraRig.lookAt(0, 0, 0);
    //self.controls.update();
    //cameraRig.rotation=;
    self.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, -1);
    self.camera.position.set(20000, 20000, 20000);
    self.camera.up = new THREE.Vector3(0, 1, 0);
    self.camera.lookAt(0, 0, 0);

    // Add a directional light to show off the objects
    // Position the light out from the scene, pointing at the origin

    // add the light to the camera and the camera to the scene
    self.scene.add(self.camera);
  //  self.scene.add(cameraOrthoHelper);

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
       // self.CameraHelper,
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

            self.renderer.render(self.scene, self.camera);
        }
    };
    return self.public;
};

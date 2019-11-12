/* 
Author: Andrew Burks 
Modified by: 
  Pavana Doddi
  Ryan Nishimoto
  Anjali Yadla

For CS 529: Visual Data Science 
LSST SNe Visualization Project
University of Illinois at Chicago


*/
"use strict";
/* Create a Threejs scene for the application */

/* Get or create the application global variable */
var App = App || {};

/* Create the scene class */
const Scene = function(options) {
  // setup the pointer to the scope 'this' variable
  const self = this;

  // scale the width and height to the screen size
  const width = d3.select(".particleDiv").node().clientWidth;
  const height = width * 0.85;

  // create the scene
  self.scene = new THREE.Scene();

  // setup the camera
  self.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, -1);
  self.camera.position.set(10, 15, 20);
  self.camera.up = new THREE.Vector3(0, 1, 0);
  self.camera.lookAt(100, 100, 100);

  // Add a directional light to show off the objects
  const light = new THREE.DirectionalLight(0xffffff, 1.5);
  // Position the light out from the scene, pointing at the origin
  light.position.set(0, 2, 20);
  light.lookAt(0, 0, 0);

  // add the light to the camera and the camera to the scene
  self.camera.add(light);
  self.scene.add(self.camera);

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
  // enables panning up/down instead of dolly_pan...
  self.controls.screenSpacePanning = true;
  //self.controls.update();
  // expose the public functions
  // Try on the console App.scene and you should see these
  // three functions. Every other element acts as a private
  // attribute or function. For more information, check
  // javascript module patterns.
  self.public = {
    resize: function() {},

    addObject: function(obj) {
      self.scene.add(obj);
    },

    render: function() {
      requestAnimationFrame(self.public.render);
      self.controls.update();
      self.renderer.render(self.scene, self.camera);
    }
  };

  return self.public;
};
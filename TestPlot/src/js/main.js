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

/* Get or create the application global variable */
var App = App || {};

/* IIFE to initialize the main entry of the application*/
(function() {
  // setup the pointer to the scope 'this' variable
  var self = this;

  /* Entry point of the application */
  App.start = function() {
    // create a new scene, pass options as dictionary
    App.scene = new Scene({ container: "scene" });

    // initialize the particle system
    const particleSystem = new ParticleSystem();

    // Switch between data sets
    particleSystem.initialize("data/OpenSNCatConverted.csv");

    //add the particle system to the scene
    App.scene.addObject(particleSystem.getParticleSystems());

    // render the scene
    App.scene.render();
  };
})();

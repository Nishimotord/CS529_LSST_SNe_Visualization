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
    particleSystem.initialize();

    //add the particle system to the scene
    App.scene.addObject(particleSystem.getParticleSystems());

    // render the scene
    App.scene.render();
  };
})();

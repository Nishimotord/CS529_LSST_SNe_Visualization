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

/*
  variables for visualization
*/

// size of particle (suggested: 0.01 - .1)
var particleSize = 0.05;

var showAxis = true;

// Start of ParticleSystem function

const ParticleSystem = function() {
  // setup the pointer to the scope 'this' variable
  const self = this;

  // data containers
  const data = [];

  var plotData = [];

  // scene graph group for the particle system
  const sceneObject = new THREE.Group();

  // bounds of the data
  var bounds = {};

  // Create an x,y,z axis (r,g,b)
  self.drawAxis = function() {
    // create axis lines (x,y,z, - r,g,b)
    const xAxisMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const yAxisMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const zAxisMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });

    // BufferGeometry is more performance-friendly than just Geometry..use Geometry for simplicity
    const xAxisGeometry = new THREE.Geometry();
    const yAxisGeometry = new THREE.Geometry();
    const zAxisGeometry = new THREE.Geometry();
    xAxisGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    xAxisGeometry.vertices.push(new THREE.Vector3(15, 0, 0));
    yAxisGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    yAxisGeometry.vertices.push(new THREE.Vector3(0, 15, 0));
    zAxisGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    zAxisGeometry.vertices.push(new THREE.Vector3(0, 0, 15));

    const xAxisLine = new THREE.Line(xAxisGeometry, xAxisMaterial);
    const yAxisLine = new THREE.Line(yAxisGeometry, yAxisMaterial);
    const zAxisLine = new THREE.Line(zAxisGeometry, zAxisMaterial);
    sceneObject.add(xAxisLine);
    sceneObject.add(yAxisLine);
    sceneObject.add(zAxisLine);
  };

  // creates the particle system
  self.createParticleSystem = function() {
    // use self.data to create the particle system
    // draw your particle system here!
    console.log(data.length + " particles");
    var pGeometry = new THREE.Geometry();
    plotData = [];
    for (var i = 0; i < data.length; i++) {
      // particle data in cartesian coordinates of units Mpc
      var particle = new THREE.Vector3(data[i].X, data[i].Y, data[i].Z);
      pGeometry.vertices.push(particle);

      // default to white
      var color = new THREE.Color(0xffffff);
      pGeometry.colors.push(color);
    }
    var pMaterial = new THREE.PointsMaterial({
      size: particleSize
    });
    var pSystem = new THREE.Points(pGeometry, pMaterial);
    sceneObject.add(pSystem);
  };

  // data loading function
  self.loadData = function(file) {
    // read the csv file
    d3.csv(file)
      // iterate over the rows of the csv file
      .row(function(d) {
        // get the min bounds
        bounds.minX = Math.min(bounds.minX || Infinity, d.Points0);
        bounds.minY = Math.min(bounds.minY || Infinity, d.Points1);
        bounds.minZ = Math.min(bounds.minZ || Infinity, d.Points2);

        // get the max bounds
        bounds.maxX = Math.max(bounds.maxX || -Infinity, d.Points0);
        bounds.maxY = Math.max(bounds.maxY || -Infinity, d.Points1);
        bounds.maxZ = Math.max(bounds.maxY || -Infinity, d.Points2);

        // add the element to the data collection
        data.push({
          // SNe Name, host, type
          Name: String(d.name),
          Host: String(d.host),
          Type: String(d.type),
          // Position
          X: Number(d.x),
          Y: Number(d.y),
          Z: Number(d.z),
          // Time
          T: Number(d.t),
          // Luminosity
          L: Number(d.log10lum)
        });
      })
      // when done loading
      .get(function() {
        // draw Axis
        if (showAxis) self.drawAxis();

        // create the particle system
        self.createParticleSystem();
      });
  };

  // publicly available functions
  self.public = {
    // load the data and setup the system
    initialize: function(file) {
      self.loadData(file);
    },

    // accessor for the particle system
    getParticleSystems: function() {
      return sceneObject;
    }
  };

  return self.public;
};

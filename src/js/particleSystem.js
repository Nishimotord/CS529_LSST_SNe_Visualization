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
// var showSNeV;

// Start of ParticleSystem function

const ParticleSystem = function() {
  // setup the pointer to the scope 'this' variable
  const self = this;

  // data containers
  const oldData = [];
  const lsstData = [];

  var plotData = [];

  // scene graph group for the particle system
  const sceneObject = new THREE.Group();

  // bounds of the data
  var bounds = {};

  // Variables for geometry, materials, objects.
  var pGeometry;
  var particle;
  var pOldMaterial;
  var pOldSystem;
  var pLsstMaterial;
  var pLsstSystem;

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
  self.createParticleSystem = function(data, dsource) {
    console.log(dsource + ": " + data.length);
    // use self.data to create the particle system
    // draw your particle system here!
    pGeometry = new THREE.Geometry();
    for (var i = 0; i < data.length; i++) {
      // particle data in cartesian coordinates of units Mpc
      if (data[i].X == 0 && data[i].Y == 0 && data[i].Z == 0) {
      } else {
        particle = new THREE.Vector3(data[i].X, data[i].Y, data[i].Z);
        pGeometry.vertices.push(particle);

        // default to white
        if (dsource == "old") {
          var color = new THREE.Color(0xffffff);
          pGeometry.colors.push(color);
        } else if (dsource == "lsst") {
          var color = new THREE.Color(0x0000ff);
          pGeometry.colors.push(color);
        }
      }
    }
    // Creates and adds two objects to the scene. One for each of the datasets.
    if(dsource == "old"){
      pOldMaterial = new THREE.PointsMaterial({
        size: particleSize,
        vertexColors: THREE.VertexColors
      });
      pOldSystem = new THREE.Points(pGeometry, pOldMaterial);
      sceneObject.add(pOldSystem);
    }
    else if(dsource == "lsst"){
      pLsstMaterial = new THREE.PointsMaterial({
        size: particleSize,
        vertexColors: THREE.VertexColors
      });
      pLsstSystem = new THREE.Points(pGeometry, pLsstMaterial);
      sceneObject.add(pLsstSystem);
    }
  };

  // Various options for GUI.
  var defaultGui = function() {
    this.ShowSNe = true;
    this.ShowLsst = true;
    this.Type = [];
    this.colorSNe = '#ffffff';
    this.colorLsst = '#0000ff';
    this.Time = 0;
  };
  
  // GUI related stuff.
  var text = new defaultGui();
  var gui = new dat.GUI();
  var dataFolder = gui.addFolder('Data');
  dataFolder.add(text, 'ShowSNe').name('Show old SNe').listen().onChange(
    function(){
      if(text.ShowSNe){
        pOldSystem.visible = true;
        pOldSystem.needsUpdate = true;
      }
      else{
        pOldSystem.visible = false;
        pOldSystem.needsUpdate = true;
      }
    }
  );
  dataFolder.add(text, 'ShowLsst').name('Show Lsst data').listen().onChange(
    function(){
      if(text.ShowLsst){
        pLsstSystem.visible = true;
        pLsstSystem.needsUpdate = true;
      }
      else{
        pLsstSystem.visible = false;
        pLsstSystem.needsUpdate = true;
      }
    }
  )
  dataFolder.open();
  var dropdown = gui.add(text, 'Type', ['I', 'Ia', 'II', 'None']).onChange(
    function(){
      console.log(text.Type);
      if(text.Type == 'None'){
        // TODO: FILTER BY TYPE.
      }
    }
  );
  dropdown.setValue('None');
  gui.add(text, 'Time', 1985, 2023).onChange(
    function(){
      //TODO: FILTER BY TIME.
    }
  )
  var colorFolder = gui.addFolder('Color');
  colorFolder.addColor(text, 'colorSNe').name('Old data color').onChange(
    function(){
      console.log(text.colorSNe);
      pOldSystem.material.color.set(text.colorSNe);
    }
  );
  colorFolder.addColor(text, 'colorLsst').name('Lsst data color').onChange(
    function(){
      pLsstSystem.material.color.set(text.colorLsst);
    }
  )

  // data loading function
  self.loadData = function() {
    // read the old SNe csv file
    console.log("Loading Data: data/OpenSNCatConverted.csv");
    d3.csv("data/OpenSNCatConverted.csv")
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
        oldData.push({
          // Luminosity
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
        // create the particle system for old data
        self.createParticleSystem(oldData, "old");
      });

    console.log("Loading Data: data/LSSTConverted.csv");
    d3.csv("data/LSSTConverted.csv")
      // iterate over the rows of the csv file
      .row(function(d) {
        lsstData.push({
          // Position
          Type: String(d.type),
          X: Number(d.x),
          Y: Number(d.y),
          Z: Number(d.z),
          // Time
          T: Number(d.t)
        });
      })
      // when done loading
      .get(function() {
        // create the particle system for lsst data
        self.createParticleSystem(lsstData, "lsst");
      });
  };

  // publicly available functions
  self.public = {
    // load the data and setup the system
    initialize: function() {
      self.loadData();
    },

    // accessor for the particle system
    getParticleSystems: function() {
      return sceneObject;
    }
  };

  return self.public;
};
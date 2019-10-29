/* 
Author: Andrew Burks 
Modified by: Ryan Nishimoto

For CS 529: Visual Data Science
University of Illinois at Chicago

References:

https://threejs.org/docs/#examples/en/controls/
https://www.d3-graph-gallery.com/graph/scatter_basic.html
https://www.d3-graph-gallery.com/graph/density_slider.html
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

// Color/Chromatic values for concentration gradient
const gradChrom = [
  0xffffff,
  0xf0f0f0,
  0xd9d9d9,
  0xbdbdbd,
  0x969696,
  0x737373,
  0x525252,
  0x252525,
  0x000000
];
const gradColor = [
  0xf7fcf0,
  0xe0f3db,
  0xccebc5,
  0xa8ddb5,
  0x7bccc4,
  0x4eb3d3,
  0x2b8cbe,
  0x0868ac,
  0x084081
];
const gradColor2 = [
  "#f7fcf0",
  "#e0f3db",
  "#ccebc5",
  "#a8ddb5",
  "#7bccc4",
  "#4eb3d3",
  "#2b8cbe",
  "#0868ac",
  "#084081"
];

// Thresholds for concentration gradient
const gradVal = [0.0, 0.5, 1.0, 10.0, 50.0, 100.0, 200.0, 300.0];

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

  // create the containment box.
  // This cylinder is only to guide development.
  // TODO: Remove after the data has been rendered
  self.drawContainment = function() {
    // get the radius and height based on the data bounds
    const radius = (bounds.maxX - bounds.minX) / 2.0 + 1;
    const height = bounds.maxY - bounds.minY + 1;

    // create a cylinder to contain the particle system
    const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      wireframe: true
    });

    const cylinder = new THREE.Mesh(geometry, material);

    // add the containment to the scene
    sceneObject.add(cylinder);
  };

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

  // Return: particle color for concentration (values between 0 and ~360)
  // Input: concentration value (float), colorGradient (array of hex codes)
  self.getGradientValue = function(val, color) {
    var pColor =
      val == gradVal[0]
        ? color[0]
        : val < gradVal[1]
        ? color[1]
        : val < gradVal[2]
        ? color[2]
        : val < gradVal[3]
        ? color[3]
        : val < gradVal[4]
        ? color[4]
        : val < gradVal[5]
        ? color[5]
        : val < gradVal[6]
        ? color[6]
        : val < gradVal[7]
        ? color[7]
        : color[8];

    return pColor;
  };
  // creates the particle system
  self.createParticleSystem = function() {
    // use self.data to create the particle system
    // draw your particle system here!
    console.log(data.length + " particles");
    var pGeometry = new THREE.Geometry();
    plotData = [];
    for (var i = 0; i < data.length; i++) {
      //  point0/1/2 == X/Y/Z == x, z, height of cylinder
      var particle = new THREE.Vector3(data[i].X, data[i].Y, data[i].Z);
      pGeometry.vertices.push(particle);

      // default to white
      var color = new THREE.Color(0xffffff);
      /*
      if (data[i].Y >= zBounds[0] && data[i].Y <= zBounds[1]) {
        color = new THREE.Color(
          self.getGradientValue(data[i].concentration, gradColor)
        );

        plotData.push({
          X: Number(data[i].X),
          Z: Number(data[i].Z),
          Color: String(
            self.getGradientValue(data[i].concentration, gradColor2)
          )
        });
      } else {
        color = new THREE.Color(
          self.getGradientValue(data[i].concentration, gradChrom)
        );
      }
      */
      pGeometry.colors.push(color);
    }
    var pMaterial = new THREE.PointsMaterial({
      size: particleSize
      //vertexColors: THREE.VertexColors
    });
    var pSystem = new THREE.Points(pGeometry, pMaterial);
    sceneObject.add(pSystem);

    /*
    d3.select("svg").remove();
    // Draw Plot
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
      width =
        d3.select(".plotDiv").node().clientWidth - margin.left - margin.right,
      height = width * 0.85 - margin.top - margin.bottom;

    var svg = d3
      .select("#plot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3
      .scaleLinear()
      .domain([-7.5, 7.5])
      .range([0, width]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3
      .scaleLinear()
      .domain([-2.5, 12.5])
      .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // Add dots
    svg
      .append("g")
      .selectAll("dot")
      .data(plotData)
      .enter()
      .append("circle")
      .attr("cx", function(d) {
        return x(d.X);
      })
      .attr("cy", function(d) {
        return y(d.Z);
      })
      .attr("r", 3)
      .style("fill", function(d) {
        return d.Color;
      });
      */
  };

  // Function for z-plane (....actually a rectangle)
  self.drawPlane = function() {
    var planeGeometry = new THREE.BoxGeometry(15, 15, zBounds[1] * 2);
    var planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xfff7ec,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, 5, 0);
    sceneObject.add(plane);

    d3.select("#zSlider").on("input", function(d) {
      zPos = this.value / 100.0;
      console.log(zPos);
      plane.position.set(0, 5, zPos);
      zBounds[0] = zPos - 0.01;
      zBounds[1] = zPos + 0.01;
      console.log(zBounds[0] + "-" + zBounds[1]);
      self.createParticleSystem();
    });
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
        // draw the containment cylinder
        // DONE: Remove after the data has been rendered
        //self.drawContainment();

        // Debug? Draw axis
        if (showAxis) self.drawAxis();
        // create the particle system
        //self.drawPlane();
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

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

// Start of ParticleSystem function

const ParticleSystem = function () {
  // setup the pointer to the scope 'this' variable
  const self = this;

  // size of particle (suggested: 0.01 - .1)
  var oldPSize = 3;
  var lsstPSize = 1;
  var useSizeAttenuation = false;

  var showAxis = true;

  var isOld = false;

  // data containers
  const oldData = [];
  const lsstData = [];
  // const sneCountData = [];

  // scene graph group for the particle system
  const sceneObject = new THREE.Group();

  // bounds of the data
  var bounds = {};
  var yearBounds = [1885, 2025];

  // Variables for geometry, materials, objects.
  var pGeometry;
  var particle;
  var pOldMaterial;
  var pOldSystem;
  var pLsstMaterial;
  var pLsstSystem;

  var pColors = [
    "#a6cee3",
    "#1f78b4",
    "#b2df8a",
    "#33a02c",
    "#fb9a99",
    "#e31a1c"
  ];
  var margin = { top: 20, right: 30, bottom: 30, left: 60 },
    width = 900 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var context = d3.select("#my_datavizLSST")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  var svg = d3.select("svg");
  svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

  d3.csv("data/sneCount.csv", function (data) {

    // List of groups = header of the csv files
    var keys = data.columns.slice(1)

    // Add X axis
    var x = d3.scaleLinear()
      .domain([1885, 2019])
      .range([0, width - 300]);
    context.append("g")
      .attr("transform", "translate(0,100)")
      .call(d3.axisBottom(x));

    var x2 = d3.scaleLinear()
      .domain([2021, 2025])
      .range([width - 290, width]);
    context.append("g")
      .attr("transform", "translate(0,100)")
      .call(d3.axisBottom(x2));
    
      // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, 1500])
      .range([100, 0]);
    context.append("g")
      .call(d3.axisLeft(y));

      var y2 = d3.scaleLinear()
      .domain([0, 1200000])
      .range([120, 250]);
    context.append("g")
      .call(d3.axisLeft(y2));

    // color palette
    var color = d3.scaleOrdinal()
      .domain(keys)
      .range(['#8da0cb', '#66c2a5', '#a6d854'])

    //stack the data?
    var stackedData = d3.stack()
      .offset(d3.wiggle)
      .keys(keys)
      (data)

    // Show the areas
    context
      .selectAll("mylayers")
      .data(stackedData)
      .enter()
      .append("path")
      .style("fill", function (d) { return color(d.key); })
      .attr("d", d3.area()
        .x(function (d, i) { 
          if(d.data.Date < 2020){
            return x(d.data.Date); 
          }
          else{
            return x2(d.data.Date);
          }
        })
        .y0(function (d) { 
          if(d.data.Date < 2020){
            return y(d[0]); 
          }
          else {
            return y2(d[0]);
          }
        })
        .y1(function (d) { 
          if(d.data.Date < 2020){ 
            return y(d[1]); 
          }
          else {
            return y2(d[1]);
          }
        })
      )

      //Add brush variable
      var brush = d3.brushX()
      .extent([[0, 0], [width, height]])
      .on("brush end", brushed);
    
    context.append("g")
      .attr("class", "brush")
      .call(brush)
      .call(brush.move, [0,810]);

      //Add brushing function
      function brushed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
        if(d3.event.selection == null) return;
        var s2 = d3.event.selection || x2.range();
        console.log(s2);
        var [x0, x1] = [0, 0];
        if(s2[0] >= 0 && s2[1] <= 510){
          [x0, x1] = s2.map(d => Math.floor(x.invert(d)));}
        else if (s2[0] <= 510 && s2[1] >= 510) {
          x0 = s2.map(d => Math.floor(x.invert(d)))[0];
          x1 = s2.map(d => Math.floor(x2.invert(d)))[1];
        }
        else{
          [x0, x1] = s2.map(d => Math.floor(x2.invert(d)));}
        console.log([x0,x1]);

      }
  });
  
  // Create an x,y,z axis (r,g,b)
  self.drawAxis = function () {
    // create axis lines (x,y,z, - r,g,b)
    const xAxisMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const yAxisMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const zAxisMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });

    // BufferGeometry is more performance-friendly than just Geometry..use Geometry for simplicity
    const xAxisGeometry = new THREE.Geometry();
    const yAxisGeometry = new THREE.Geometry();
    const zAxisGeometry = new THREE.Geometry();
    xAxisGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    xAxisGeometry.vertices.push(new THREE.Vector3(15000, 0, 0));
    yAxisGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    yAxisGeometry.vertices.push(new THREE.Vector3(0, 15000, 0));
    zAxisGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    zAxisGeometry.vertices.push(new THREE.Vector3(0, 0, 15000));

    const xAxisLine = new THREE.Line(xAxisGeometry, xAxisMaterial);
    const yAxisLine = new THREE.Line(yAxisGeometry, yAxisMaterial);
    const zAxisLine = new THREE.Line(zAxisGeometry, zAxisMaterial);
    sceneObject.add(xAxisLine);
    sceneObject.add(yAxisLine);
    sceneObject.add(zAxisLine);
  };

  // creates the particle system
  self.createParticleSystem = function (data, dsource) {
    // console.log(data)
    console.log(dsource + ": " + data.length);
    // use self.data to create the particle system
    // draw your particle system here!
    pGeometry = new THREE.Geometry();
    for (var i = 0; i < data.length; i++) {
      // particle data in cartesian coordinates of units Mpc
      if (data[i].X == 0 && data[i].Y == 0 && data[i].Z == 0) {
        console.log("ZEROED");
      } else {
        particle = new THREE.Vector3(data[i].X, data[i].Y, data[i].Z);
        pGeometry.vertices.push(particle);

        // default to white
        if (dsource == "old") {
          var color = new THREE.Color(0xffffff);
          pGeometry.colors.push(color);
        } else if (dsource == "lsst") {
          var color = new THREE.Color(0xffffff);
          pGeometry.colors.push(color);
        }
      }
    }
    // Creates and adds two objects to the scene. One for each of the datasets.
    if (dsource == "old") {
      pOldMaterial = new THREE.PointsMaterial({
        size: oldPSize,
        sizeAttenuation: useSizeAttenuation,
        vertexColors: THREE.VertexColors
      });
      pOldSystem = new THREE.Points(pGeometry, pOldMaterial);
      sceneObject.add(pOldSystem);
    } else if (dsource == "lsst") {
      pLsstMaterial = new THREE.PointsMaterial({
        size: lsstPSize,
        sizeAttenuation: useSizeAttenuation,
        vertexColors: THREE.VertexColors
      });
      pLsstSystem = new THREE.Points(pGeometry, pLsstMaterial);
      sceneObject.add(pLsstSystem);
    }
  };

  // Various options for GUI.
  var defaultGui = function () {
    this.ShowOld = true;
    this.ShowLsst = true;
    this.ShowTypeIa = true;
    this.ShowTypeI = true;
    this.ShowTypeII = true;
    this.Type = [];
    //this.colorSNe = "#ffffff";
    //this.colorLsst = "#0000ff";
    this.Time = 2025;
    this.oldSize = oldPSize;
    this.lsstSize = lsstPSize;
    this.Reset = function () {
      location.reload();
    };
  };

  // GUI related stuff.
  var text = new defaultGui();
  var gui = new dat.GUI();
  var dataFolder = gui.addFolder("Data set");
  dataFolder
    .add(text, "ShowOld")
    .name("Show old SNe")
    .listen()
    .onChange(function () {
      self.updateColors(yearBounds);
    });
  dataFolder
    .add(text, "ShowLsst")
    .name("Show LSST SNe")
    .listen()
    .onChange(function () {
      self.updateColors(yearBounds);
    });
  dataFolder.open();
  var typeFolder = gui.addFolder("SNe Type");
  typeFolder
    .add(text, "ShowTypeIa")
    .name("Show Type Ia SNe")
    .listen()
    .onChange(function () {
      self.updateColors(yearBounds);
    });
  typeFolder
    .add(text, "ShowTypeI")
    .name("Show Type I SNe")
    .listen()
    .onChange(function () {
      self.updateColors(yearBounds);
    });
  typeFolder
    .add(text, "ShowTypeII")
    .name("Show Type II SNe")
    .listen()
    .onChange(function () {
      self.updateColors(yearBounds);
    });
  typeFolder.open();

  gui.add(text, "Time", 1885, 2025).onChange(function (val) {
    yearBounds[1] = Math.floor(val);
    console.log("upper bound set: " + yearBounds[1]);
    self.updateColors(yearBounds);
  });
  gui.add(text, "oldSize", 1, 5).onChange(function (val) {
    oldPSize = val;
    pOldSystem.material.size = oldPSize;
  });
  gui.add(text, "lsstSize", 1, 5).onChange(function (val) {
    lsstPSize = val;
    pLsstSystem.material.size = lsstPSize;
  });

  /* to implement after alpha - change color
    var colorFolder = gui.addFolder("Color");
    colorFolder
      .addColor(text, "colorSNe")
      .name("Old data color")
      .onChange(function() {
        console.log(text.colorSNe);
        pOldSystem.material.color.set(text.colorSNe);
      });
    colorFolder
      .addColor(text, "colorLsst")
      .name("Lsst data color")
      .onChange(function() {
        pLsstSystem.material.color.set(text.colorLsst);
      });
  */
  self.updateColors = function (bounds) {
    var i; // iterator
    var OldSNeCount = 0; // Count of Old SNe Data
    var OldTypeIaCount = 0; // Count of Old SNe Data Type Ia
    var OldTypeICount = 0; // Count of Old SNe Data Type I
    var OldTypeIICount = 0; // Count of Old SNe Data Type II
    var LSSTCount = 0; // Count of LSST Data
    var LSSTTypeIaCount = 0; // Count of LSST Data Type Ia
    var LSSTTypeICount = 0; // Count of LSST Data Type I
    var LSSTTypeIICount = 0; // Count of LSST Data Type II
    console.log("Updating: ");
    if (text.ShowOld) {
      console.log("ShowOld: " + text.ShowOld);
      for (i = 0; i < oldData.length; i++) {
        if (
          oldData[i].Type === "Ia" &&
          text.ShowTypeIa &&
          bounds[0] <= Math.floor(oldData[i].T) &&
          Math.floor(oldData[i].T) <= bounds[1]
        ) {
          OldTypeIaCount++;
          OldSNeCount++;
          pOldSystem.geometry.colors[i].set(pColors[0]);
          pOldSystem.geometry.vertices[i].set(
            oldData[i].X,
            oldData[i].Y,
            oldData[i].Z
          );
        } else if (
          oldData[i].Type === "I" &&
          text.ShowTypeI &&
          bounds[0] <= Math.floor(oldData[i].T) &&
          Math.floor(oldData[i].T) <= bounds[1]
        ) {
          OldTypeICount++;
          OldSNeCount++;
          pOldSystem.geometry.colors[i].set(pColors[2]);
          pOldSystem.geometry.vertices[i].set(
            oldData[i].X,
            oldData[i].Y,
            oldData[i].Z
          );
        } else if (
          oldData[i].Type === "II" &&
          text.ShowTypeII &&
          bounds[0] <= Math.floor(oldData[i].T) &&
          Math.floor(oldData[i].T) <= bounds[1]
        ) {
          OldTypeIICount++;
          OldSNeCount++;
          pOldSystem.geometry.colors[i].set(pColors[4]);
          pOldSystem.geometry.vertices[i].set(
            oldData[i].X,
            oldData[i].Y,
            oldData[i].Z
          );
        } else {
          pOldSystem.geometry.colors[i].set("#000000");
          pOldSystem.geometry.vertices[i].set(0, 0, 0);
        }
      }
      // pOldSystem.geometry.colorsNeedUpdate = true;
      pOldSystem.geometry.verticesNeedUpdate = true;
    } else {
      for (i = 0; i < oldData.length; i++) {
        pOldSystem.geometry.colors[i].set("#000000");
        pOldSystem.geometry.vertices[i].set(0, 0, 0);
      }
      pOldSystem.geometry.colorsNeedUpdate = true;
      pOldSystem.geometry.verticesNeedUpdate = true;
    }
    if (text.ShowLsst) {
      console.log("ShowLsst: " + text.ShowLsst);
      for (i = 0; i < lsstData.length; i++) {
        if (
          lsstData[i].Type === "Ia" &&
          text.ShowTypeIa &&
          yearBounds[0] <= Math.floor(lsstData[i].T) &&
          Math.floor(lsstData[i].T) <= yearBounds[1]
        ) {
          LSSTTypeIaCount++;
          LSSTCount++;
          pLsstSystem.geometry.colors[i].set(pColors[1]);
          pLsstSystem.geometry.vertices[i].set(
            lsstData[i].X,
            lsstData[i].Y,
            lsstData[i].Z
          );
        } else if (
          lsstData[i].Type === "I" &&
          text.ShowTypeI &&
          yearBounds[0] <= Math.floor(lsstData[i].T) &&
          Math.floor(lsstData[i].T) <= yearBounds[1]
        ) {
          LSSTTypeICount++;
          LSSTCount++;
          pLsstSystem.geometry.colors[i].set(pColors[3]);
          pLsstSystem.geometry.vertices[i].set(
            lsstData[i].X,
            lsstData[i].Y,
            lsstData[i].Z
          );
        } else if (
          lsstData[i].Type === "II" &&
          text.ShowTypeII &&
          yearBounds[0] <= Math.floor(lsstData[i].T) &&
          Math.floor(lsstData[i].T) <= yearBounds[1]
        ) {
          LSSTTypeIICount++;
          LSSTCount++;
          pLsstSystem.geometry.colors[i].set(pColors[5]);
          pLsstSystem.geometry.vertices[i].set(
            lsstData[i].X,
            lsstData[i].Y,
            lsstData[i].Z
          );
        } else {
          pLsstSystem.geometry.colors[i].set("#000000");
          pLsstSystem.geometry.vertices[i].set(0, 0, 0);
        }
      }
      pLsstSystem.geometry.colorsNeedUpdate = true;
      pLsstSystem.geometry.verticesNeedUpdate = true;
    } else {
      for (i = 0; i < lsstData.length; i++) {
        pLsstSystem.geometry.colors[i].set("#000000");
        pLsstSystem.geometry.vertices[i].set(0, 0, 0);
      }
      pLsstSystem.geometry.colorsNeedUpdate = true;
      pLsstSystem.geometry.verticesNeedUpdate = true;
    }
    console.log(
      OldSNeCount +
      " " +
      OldTypeIaCount +
      " " +
      OldTypeICount +
      " " +
      OldTypeIICount +
      " "
    );
    console.log(
      LSSTCount +
      " " +
      LSSTTypeIaCount +
      " " +
      LSSTTypeICount +
      " " +
      LSSTTypeIICount +
      " "
    );
    $("#DisplayCount").text(
      "Old SNe : " +
      OldSNeCount +
      " Type Ia : " +
      OldTypeIaCount +
      " Type I : " +
      OldTypeICount +
      " Type II : " +
      OldTypeIICount +
      " LSST : " +
      LSSTCount +
      " Type Ia : " +
      LSSTTypeIaCount +
      " Type I : " +
      LSSTTypeICount +
      " Type II : " +
      LSSTTypeIICount
    );
  };

  // Draw Legend
  self.drawLegend = function () {
    var svg = d3.select("#legend");
    svg.attr("background-color", "black");
    svg
      .append("circle")
      .attr("cx", 20)
      .attr("cy", 15)
      .attr("r", 10)
      .style("fill", pColors[0]);
    svg
      .append("text")
      .attr("x", 40)
      .attr("y", 15)
      .text("Old Type Ia")
      .style("font-size", "15px")
      .style("fill", pColors[0])
      .attr("alignment-baseline", "middle");
    svg
      .append("circle")
      .attr("cx", 220)
      .attr("cy", 15)
      .attr("r", 10)
      .style("fill", pColors[2]);
    svg
      .append("text")
      .attr("x", 240)
      .attr("y", 15)
      .text("Old Type I")
      .style("font-size", "15px")
      .style("fill", pColors[2])
      .attr("alignment-baseline", "middle");
    svg
      .append("circle")
      .attr("cx", 420)
      .attr("cy", 15)
      .attr("r", 10)
      .style("fill", pColors[4]);
    svg
      .append("text")
      .attr("x", 440)
      .attr("y", 15)
      .text("Old Type II")
      .style("font-size", "15px")
      .style("fill", pColors[4])
      .attr("alignment-baseline", "middle");
    svg
      .append("circle")
      .attr("cx", 20)
      .attr("cy", 36)
      .attr("r", 10)
      .style("fill", pColors[1]);
    svg
      .append("text")
      .attr("x", 40)
      .attr("y", 36)
      .text("Lsst Type Ia")
      .style("font-size", "15px")
      .style("fill", pColors[1])
      .attr("alignment-baseline", "middle");
    svg
      .append("circle")
      .attr("cx", 220)
      .attr("cy", 36)
      .attr("r", 10)
      .style("fill", pColors[3]);
    svg
      .append("text")
      .attr("x", 240)
      .attr("y", 36)
      .text("LSST Type I")
      .style("font-size", "15px")
      .style("fill", pColors[3])
      .attr("alignment-baseline", "middle");
    svg
      .append("circle")
      .attr("cx", 420)
      .attr("cy", 36)
      .attr("r", 10)
      .style("fill", pColors[5]);
    svg
      .append("text")
      .attr("x", 440)
      .attr("y", 36)
      .text("LSST Type II")
      .style("font-size", "15px")
      .style("fill", pColors[5])
      .attr("alignment-baseline", "middle");
  };

  // data loading function
  self.loadData = function () {
    // read the old SNe csv file
    console.log("Loading Data: data/OpenSNCatConverted.csv");
    d3.csv("data/OpenSNCatConverted.csv")
      // iterate over the rows of the csv file
      .row(function (d) {
        // get the min bounds
        bounds.minX = Math.min(bounds.minX || Infinity, d.x);
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
      .get(function () {
        // create the particle system for old data
        self.createParticleSystem(oldData, "old");
      });

    console.log("Loading Data: data/LSSTConverted.csv");
    d3.csv("data/LSSTConverted.csv")
      // iterate over the rows of the csv file
      .row(function (d) {
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
      .get(function () {
        // create the particle system for lsst data
        self.createParticleSystem(lsstData, "lsst");
        self.updateColors(yearBounds);
        pOldSystem.geometry.colorsNeedUpdate = true;
        pLsstSystem.geometry.colorsNeedUpdate = true;
        self.drawLegend();
      });
    // d3.csv("data/sneCount.csv")
    //   .row(function(d) {
    //     sneCountData.push({
    //       Date: Date(d.date),
    //       CountI: Number(d.I),
    //       CountIa: Number(d.Ia),
    //       CountII: Number(d.II)
    //     });
    //   })
    //   //when done loading
    //   .get(function() {
    //     self.createTimeline(sneCountData);
    //   })

  };

  // publicly available functions
  self.public = {
    // load the data and setup the system
    initialize: function () {
      self.loadData();
    },

    // accessor for the particle system
    getParticleSystems: function () {
      return sceneObject;
    }
  };

  return self.public;
};

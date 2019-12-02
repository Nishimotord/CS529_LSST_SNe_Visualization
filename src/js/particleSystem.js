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

const ParticleSystem = function() {
  // setup the pointer to the scope 'this' variable
  const self = this;

  var numOld = 0,
    numOldI = 0,
    numOldII = 0,
    numOldIa = 0;
  var numLsst = 0,
    numLsstI = 0,
    numLsstII = 0,
    numLsstIa = 0;

  // Stores index start of BufferGeometry where type changes, ordered as:
  // (old) I, II, Ia, (lsst) I, II, Ia
  var typeIndex = [];
  var typeData = {
    OldI: 0,
    OldII: 1,
    OldIa: 2,
    LsstI: 3,
    LsstII: 4,
    LsstIa: 5
  };
  var typeMaterial = { Show: 0, Sprite: 1, Hidden: 2 };

  var useSprite = true;

  // size of particle (suggested: 0.01 - .1)
  var pSizes = [20, 10];
  var useSizeAttenuation = false;

  var showAxis = true;

  var isOld = false;

  // data containers
  var snData = [];
  const oldData = [];
  const lsstData = [];

  // scene graph group for the particle system
  const sceneObject = new THREE.Group();

  // bounds of the data
  var bounds = {};
  var yearBounds = [1885, 2025];
  var yearIndex = [0, 0];
  var yearIndexes = [];

  // Variables for geometry, materials, objects.
  var pBufferGeometry;
  var pGeometry;
  var pMaterials;
  var particle;

  var pSystem;
  var blending = THREE.NormalBlending;

  var sprite = new THREE.TextureLoader().load(
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/sprites/spark1.png"
    //"imgs/particle.png"
    );

  var pColors = [
    "#66c2a5",
    "#fc8d62",
    "#8da0cb",
    "#e78ac3",
    "#a6d854",
    "#ffd92f"
  ];
  var pColorsRGB = [
    new THREE.Color("rgb(102,194,165)"),
    new THREE.Color("rgb(252,141,98)"),
    new THREE.Color("rgb(141,160,203)"),
    new THREE.Color("rgb(231,138,195)"),
    new THREE.Color("rgb(166,216,84)"),
    new THREE.Color("rgb(255,217,47)")
    ];

    document.getElementById("help").addEventListener("click", readyFn);
    function readyFn() {
        // Code to run when the document is ready.

        var id = '#dialog';
        var maskHeight = $(document).height();
        var maskWidth = $(window).width();
        $('#mask').css({ 'width': maskWidth, 'height': maskHeight });
        $('#mask').fadeIn(500);
        $('#mask').fadeTo("slow", 0.9);
        var winH = $(window).height();
        var winW = $(window).width();
        $(id).css('top', winH / 2 - $(id).height() / 2);
        $(id).css('left', winW / 2 - $(id).width() / 2);
        $(id).fadeIn(500);
        $('.window .close').click(function (e) {
            e.preventDefault();
            $('#mask').hide();
            $('.window').hide();
        });
        $('#mask').click(function () {
            $(this).hide();
            $('.window').hide();
        });

    }

    $(document).ready(readyFn);
  // creates the particle system
  self.createParticleSystem = function(data) {
    pGeometry = new THREE.Geometry();
    pBufferGeometry = new THREE.BufferGeometry();
    var positions = new Float32Array(data.length * 3);
    var colors = new Float32Array(data.length * 3);
    // hold current type
    var t;
    // hold current year
    var currY = data[0].T;
    var currYIndex = 0;
    for (var i = 0, i3 = 0; i < data.length; i++, i3 += 3) {
      // build yearIndexes after counting them

      if (i + 1 == data.length) {
        yearIndexes[data[data.length - 1].T.toString()] = [currYIndex, i];
      }

      if (currY != data[i].T) {
        yearIndexes[currY.toString()] = [currYIndex, i - 1];
        currY = data[i].T;
        currYIndex = i;
        console.log(currY + " starts at " + i);
        // be sure to make last entry
      }
      if (t !== data[i].Type) {
        t = data[i].Type;
        //console.log(t + " at " + i + " for " + data[i].Source);
        typeIndex.push(i);
      }
      // Assign Positions
      positions[i3 + 0] = data[i].X;
      positions[i3 + 1] = data[i].Y;
      positions[i3 + 2] = data[i].Z;
      // Assign Colors
      if (data[i].Source === "Old") {
        if (data[i].Type === "Ia") {
          numOldIa++;
          colors[i3 + 0] = pColorsRGB[0].r;
          colors[i3 + 1] = pColorsRGB[0].g;
          colors[i3 + 2] = pColorsRGB[0].b;
        } else if (data[i].Type === "I") {
          numOldI++;
          colors[i3 + 0] = pColorsRGB[2].r;
          colors[i3 + 1] = pColorsRGB[2].g;
          colors[i3 + 2] = pColorsRGB[2].b;
        } else if (data[i].Type === "II") {
          numOldII++;
          colors[i3 + 0] = pColorsRGB[4].r;
          colors[i3 + 1] = pColorsRGB[4].g;
          colors[i3 + 2] = pColorsRGB[4].b;
        }
      } else {
        // Source === "LSST"
        if (data[i].Type === "Ia") {
          numLsstIa++;
          colors[i3 + 0] = pColorsRGB[1].r;
          colors[i3 + 1] = pColorsRGB[1].g;
          colors[i3 + 2] = pColorsRGB[1].b;
        } else if (data[i].Type === "I") {
          numLsstI++;
          colors[i3 + 0] = pColorsRGB[3].r;
          colors[i3 + 1] = pColorsRGB[3].g;
          colors[i3 + 2] = pColorsRGB[3].b;
        } else if (data[i].Type === "II") {
          numLsstII++;
          colors[i3 + 0] = pColorsRGB[5].r;
          colors[i3 + 1] = pColorsRGB[5].g;
          colors[i3 + 2] = pColorsRGB[5].b;
        }
      }
    }

    //console.log(typeIndex);
    console.log(snData.length);
    console.log(yearIndexes);
    pBufferGeometry.addAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    pBufferGeometry.addAttribute("color", new THREE.BufferAttribute(colors, 3));
    pMaterials = [
      /*
      // base material for basic pixel representation
      new THREE.PointsMaterial({
        size: pSizes[0],
        sizeAttenuation: useSizeAttenuation,
        vertexColors: THREE.VertexColors
      }),

      // base material for basic sprite representation
      new THREE.PointsMaterial({
        size: pSizes[0],
        sizeAttenuation: useSizeAttenuation,
        vertexColors: THREE.VertexColors,
        blending: blending,
        alphaTest: 0.5,
        //depthWrite: false,  // looks weird?...
        map: sprite,
        transparent: true //or false?
      }),
      */
      new THREE.PointsMaterial({
        size: pSizes[0],
        sizeAttenuation: useSizeAttenuation,
        vertexColors: THREE.VertexColors,
        blending: blending,
        transparent: true //or false?
      }),
      new THREE.PointsMaterial({
        size: pSizes[0],
        sizeAttenuation: useSizeAttenuation,
        vertexColors: THREE.VertexColors,
        blending: blending,
        alphaTest: 0.5,
        //depthWrite: false,  // looks weird?...
        map: sprite,
        transparent: true //or false?
      }),
      new THREE.PointsMaterial({
        size: pSizes[0],
        sizeAttenuation: useSizeAttenuation,
        vertexColors: THREE.VertexColors,
        blending: blending,
        alphaTest: 0.5,
        //depthWrite: false,  // looks weird?...
        map: sprite,
        transparent: true, //or false?
        opacity: 0.0
      })
    ];
    // Define groups for time Ranges
    self.buildGroups();

    pSystem = new THREE.Points(pBufferGeometry, pMaterials);
    pSystem.sortParticles = true;
    /*
    console.log("hmm");
    pBufferGeometry = new THREE.BufferGeometry().fromGeometry(pGeometry);
    console.log("hmm");
    pSystem = new THREE.Points(pBufferGeometry, pMaterial);
    console.log("ok");
    */
    pBufferGeometry.getAttribute("position").needsUpdate = true;
    pBufferGeometry.getAttribute("color").needsUpdate = true;
    sceneObject.add(pSystem);

    self.drawLegend();
  };

  // Various options for GUI.
  var defaultGui = function() {
    this.ShowOld = true;
    this.ShowLsst = true;
    this.ShowTypeIa = true;
    this.ShowTypeI = true;
    this.ShowTypeII = true;
    this.Type = [];
    this.Time = 2025;
    this.Sprite = useSprite;
    this.Size = pSizes[0];
    this.Reset = function() {
      location.reload();
    };
    this.Attenuation = useSizeAttenuation;
    this.Blending = blending === THREE.AdditiveBlending;
  };

  // GUI related stuff.
  var text = new defaultGui();
  var gui = new dat.GUI();
  var dataFolder = gui.addFolder("Data set");

  gui.add(text, "Time", 1885, 2025).onChange(function(val) {
    yearBounds[1] = Math.floor(val);
    self.buildGroups();
  });
  gui.add(text, "Size", 1, 25).onChange(function(val) {
    pSizes[0] = val;
    for (var i = 0; i < pMaterials.length; i++) {
      pMaterials[i].size = val;
      pMaterials[i].needsUpdate = true;
    }
  });
  gui.add(text, "Attenuation").onChange(function(val) {
    useSizeAttenuation = val;
    pSystem.material[
      useSprite ? typeMaterial.Sprite : typeMaterial.Show
    ].sizeAttenuation = useSizeAttenuation;
    pSystem.material[
      useSprite ? typeMaterial.Sprite : typeMaterial.Show
    ].needsUpdate = true;
  });
  gui.add(text, "Sprite").onChange(function(val) {
    useSprite = val;
    for (var i = 0; i < pBufferGeometry.groups.length; i++) {
      pBufferGeometry.groups[i].materialIndex =
        pBufferGeometry.groups[i].materialIndex === typeMaterial.Hidden
          ? typeMaterial.Hidden
          : useSprite
          ? typeMaterial.Sprite
          : typeMaterial.Show;
      pBufferGeometry.groups[i].needsUpdate = true;
    }
  });
  gui.add(text, "Blending").onChange(function(val) {
    pSystem.material[0].blending = val
      ? THREE.AdditiveBlending
      : THREE.NormalBlending;
    pSystem.material[1].blending = val
      ? THREE.AdditiveBlending
      : THREE.NormalBlending;
    pSystem.material.needsUpdate = true;
  });

  self.updateTypeView = function(typeIndex, typeMaterialID, show) {
    console.log("toggling group: " + typeIndex + " " + show);
    pBufferGeometry.groups[typeIndex].materialIndex = show
      ? typeMaterialID
      : typeMaterial.Hidden;
    pBufferGeometry.groups[typeIndex].needsUpdate = true;
  };

  // Draw Legend
  self.drawLegend = function() {
    $("#DisplayCount").text("Old SNe : " + numOld + " LSST : " + numLsst);

    d3.select("#legend")
      .selectAll("text")
      .remove();
    d3.select("#legend")
      .selectAll("circle")
      .remove();
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
      .text("Old Type Ia - " + numOldIa)
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
      .text("Old Type I - " + numOldI)
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
      .text("Old Type II - " + numOldII)
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
      .text("Lsst Type Ia - " + numLsstIa)
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
      .text("LSST Type I - " + numLsstI)
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
      .text("LSST Type II - " + numLsstII)
      .style("font-size", "15px")
      .style("fill", pColors[5])
      .attr("alignment-baseline", "middle");
  };
  self.buildGroups = function() {
    // Don't make any changes if there is no data to change
    // store starting index and number of values to change
    var indexLength = yearIndexes[yearBounds[1].toString()];
    if (indexLength !== undefined) {
      pBufferGeometry.clearGroups();
      pBufferGeometry.addGroup(0, yearIndex[0], typeMaterial.Hidden);
      pBufferGeometry.addGroup(
        yearIndex[0],
        indexLength[1] === 0 ? 1 : indexLength[1],
        useSprite ? typeMaterial.Sprite : typeMaterial.Show
      );
      pBufferGeometry.addGroup(
        indexLength[1] + 1,
        snData.length - indexLength[1],
        typeMaterial.Hidden
      );
      console.log("Updating groups:");
      console.log(
        yearBounds[1] + " index: " + yearIndexes[yearBounds[1].toString()]
      );
      console.log("YearBounds:" + yearBounds);
      console.log("YearIndex: " + yearIndex);
      for (var i = 0; i < pBufferGeometry.groups.length; i++) {
        pBufferGeometry.groups[i].needsUpdate = true;
      }
      // recount SNe variables
      numOld = numOldI = numOldII = numOldIa = numLsst = numLsstI = numLsstII = numLsstIa = 0;
      for (var i = 0; i < snData.length; i++) {
        if (snData[i].T >= yearBounds[0] && snData[i].T <= yearBounds[1]) {
          if (snData[i].Source === "Old") {
            numOld++;
            if (snData[i].Type === "I") {
              numOldI++;
            }
            if (snData[i].Type === "II") {
              numOldII++;
            }
            if (snData[i].Type === "Ia") {
              numOldIa++;
            }
          } else if (snData[i].Source === "LSST") {
            numLsst++;

            if (snData[i].Type === "I") {
              numLsstI++;
            }

            if (snData[i].Type === "II") {
              numLsstII++;
            }

            if (snData[i].Type === "Ia") {
              numLsstIa++;
            }
          }
        }
      }
      console.log(numOld);
      console.log(numLsst);
      self.drawLegend();
    }
  };
  // data loading function
  self.loadData = function() {
    // read the old SNe csv file
    console.log("Loading Data: data/OpenSNCatConverted.csv");
    d3.csv("data/OpenSNCatConverted.csv")
      // iterate over the rows of the csv file
      .row(function(d) {
        oldData.push({
          // SNe Name, host, type
          Name: String(d.name),
          Host: String(d.host),
          Type: String(d.type),
          // Position
          X: Number(d.x),
          Y: Number(d.y),
          Z: Number(d.z),
          // Time
          T: Number(Math.floor(d.t)),
          // Luminosity
          L: Number(d.log10lum),
          Source: String("Old")
        });
      })
      // when done loading
      .get(function() {
        numOld = oldData.length;
        console.log("Loaded Old Data: " + numOld + " SNe");
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
          T: Number(Math.floor(d.t)),
          Source: String("LSST")
        });
      })
      // when done loading
      .get(function() {
        numLsst = lsstData.length;
        console.log("Loaded LSST Data: " + numLsst + " SNe");

        // concat old and new data
        snData = oldData.concat(lsstData);

        snData.sort(function(a, b) {
          return a.T > b.T ? 1 : -1;
        });
        console.log("Combined data: " + snData.length + " SNe");
        yearBounds[0] = snData[0].T;
        yearBounds[1] = snData[snData.length - 1].T;
        yearIndex[0] = 0;
        yearIndex[1] = snData.length - 1;
        console.log("Year Bounds: " + yearBounds);
        console.log("Year Indexes: " + yearIndex);
        // create the particle system for lsst data
        self.createParticleSystem(snData);

        //self.updateColors(yearBounds);
        //pSystem.geometry.colorsNeedUpdate = true;
        //pSystem.geometry.colorsNeedUpdate = true;
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

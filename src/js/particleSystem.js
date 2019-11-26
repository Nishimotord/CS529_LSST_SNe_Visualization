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

  var numOld, numOldI, numOldII, numOldIa;
  var numLsst, numLsstI, numLsstII, numLsstIa;

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
  var typeMaterial = { Old: 0, Lsst: 1, Hidden: 2 };

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

  // creates the particle system
  self.createParticleSystem = function(data) {
    pGeometry = new THREE.Geometry();
    pBufferGeometry = new THREE.BufferGeometry();
    var positions = new Float32Array(data.length * 3);
    var colors = new Float32Array(data.length * 3);
    var sizes = new Float32Array(data.length);
    var times = new Float32Array(data.length);

    var t;

    for (var i = 0, i3 = 0; i < data.length; i++, i3 += 3) {
      if (t !== data[i].Type) {
        t = data[i].Type;
        console.log(t + " at " + i + " for " + data[i].Source);
        typeIndex.push(i);
      }
      // Assign Positions
      positions[i3 + 0] = data[i].X;
      positions[i3 + 1] = data[i].Y;
      positions[i3 + 2] = data[i].Z;
      // Assign Colors
      if (data[i].Source === "Old") {
        if (data[i].Type === "Ia") {
          colors[i3 + 0] = pColorsRGB[0].r;
          colors[i3 + 1] = pColorsRGB[0].g;
          colors[i3 + 2] = pColorsRGB[0].b;
        } else if (data[i].Type === "I") {
          colors[i3 + 0] = pColorsRGB[2].r;
          colors[i3 + 1] = pColorsRGB[2].g;
          colors[i3 + 2] = pColorsRGB[2].b;
        } else if (data[i].Type === "II") {
          colors[i3 + 0] = pColorsRGB[4].r;
          colors[i3 + 1] = pColorsRGB[4].g;
          colors[i3 + 2] = pColorsRGB[4].b;
        }
      } else {
        // Source === "LSST"
        if (data[i].Type === "Ia") {
          colors[i3 + 0] = pColorsRGB[1].r;
          colors[i3 + 1] = pColorsRGB[1].g;
          colors[i3 + 2] = pColorsRGB[1].b;
        } else if (data[i].Type === "I") {
          colors[i3 + 0] = pColorsRGB[3].r;
          colors[i3 + 1] = pColorsRGB[3].g;
          colors[i3 + 2] = pColorsRGB[3].b;
        } else if (data[i].Type === "II") {
          colors[i3 + 0] = pColorsRGB[5].r;
          colors[i3 + 1] = pColorsRGB[5].g;
          colors[i3 + 2] = pColorsRGB[5].b;
        }
      }
      // Assign Sizes - does this do anything?
      sizes[i] = data[i].Source === "Old" ? pSizes[0] : pSizes[1];
      // Assign Times
      times[i] = data[i].T;
    }

    console.log(typeIndex);
    console.log(snData.length);
    pBufferGeometry.addAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    pBufferGeometry.addAttribute("color", new THREE.BufferAttribute(colors, 3));
    pBufferGeometry.addAttribute("size", new THREE.BufferAttribute(sizes, 1));
    pBufferGeometry.addAttribute("time", new THREE.BufferAttribute(times, 1));
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
        alphaTest: 0.5,
        //depthWrite: false,  // looks weird?...
        map: sprite,
        transparent: true //or false?
      }),
      new THREE.PointsMaterial({
        size: pSizes[1],
        sizeAttenuation: useSizeAttenuation,
        vertexColors: THREE.VertexColors,
        blending: blending,
        alphaTest: 0.5,
        //depthWrite: false,  // looks weird?...
        map: sprite,
        transparent: true //or false?
      }),
      new THREE.PointsMaterial({
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
    pBufferGeometry.addGroup(
      typeIndex[0],
      typeIndex[1] - typeIndex[0],
      typeMaterial.Old
    );
    pBufferGeometry.addGroup(
      typeIndex[1],
      typeIndex[2] - typeIndex[1],
      typeMaterial.Old
    );
    pBufferGeometry.addGroup(
      typeIndex[2],
      typeIndex[3] - typeIndex[2],
      typeMaterial.Old
    );
    pBufferGeometry.addGroup(
      typeIndex[3],
      typeIndex[4] - typeIndex[3],
      typeMaterial.Lsst
    );
    pBufferGeometry.addGroup(
      typeIndex[4],
      typeIndex[5] - typeIndex[4],
      typeMaterial.Lsst
    );
    pBufferGeometry.addGroup(
      typeIndex[5],
      snData.length - typeIndex[5],
      typeMaterial.Lsst
    );

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
    pBufferGeometry.getAttribute("size").needsUpdate = true;
    pBufferGeometry.getAttribute("time").needsUpdate = true;
    sceneObject.add(pSystem);

    numOldIa = typeIndex[3] - typeIndex[2];
    numOldI = typeIndex[1] - 1;
    numOldII = typeIndex[2] - typeIndex[1];
    numLsstIa = numLsst - typeIndex[5];
    numLsstI = typeIndex[4] - typeIndex[3];
    numLsstII = typeIndex[5] - typeIndex[3];

    $("#DisplayCount").text("Old SNe : " + numOld + " LSST : " + numLsst);
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
    this.oldSize = pSizes[typeMaterial.Old];
    this.lsstSize = pSizes[typeMaterial.Lsst];
    this.Reset = function() {
      location.reload();
    };
    this.attenuation = useSizeAttenuation;
    //this.sprite = useSprite;
    this.blending = blending === THREE.AdditiveBlending;
  };

  // GUI related stuff.
  var text = new defaultGui();
  var gui = new dat.GUI();
  var dataFolder = gui.addFolder("Data set");
  dataFolder
    .add(text, "ShowOld")
    .name("Show old SNe")
    .listen()
    .onChange(function(val) {
      if (text.ShowTypeI) {
        self.updateTypeView(typeData.OldI, typeMaterial.Old, val);
      }
      if (text.ShowTypeII) {
        self.updateTypeView(typeData.OldII, typeMaterial.Old, val);
      }
      if (text.ShowTypeIa) {
        self.updateTypeView(typeData.OldIa, typeMaterial.Old, val);
      }
    });
  dataFolder
    .add(text, "ShowLsst")
    .name("Show LSST SNe")
    .listen()
    .onChange(function(val) {
      if (text.ShowTypeI) {
        self.updateTypeView(typeData.LsstI, typeMaterial.Lsst, val);
      }
      if (text.ShowTypeII) {
        self.updateTypeView(typeData.LsstII, typeMaterial.Lsst, val);
      }
      if (text.ShowTypeIa) {
        self.updateTypeView(typeData.LsstIa, typeMaterial.Lsst, val);
      }
    });
  dataFolder.open();
  var typeFolder = gui.addFolder("SNe Type");
  typeFolder
    .add(text, "ShowTypeIa")
    .name("Show Type Ia SNe")
    .listen()
    .onChange(function(val) {
      if (text.ShowOld) {
        self.updateTypeView(typeData.OldIa, typeMaterial.Old, val);
      }
      if (text.ShowLsst) {
        self.updateTypeView(typeData.LsstIa, typeMaterial.Lsst, val);
      }
    });
  typeFolder
    .add(text, "ShowTypeI")
    .name("Show Type I SNe")
    .listen()
    .onChange(function(val) {
      if (text.ShowOld) {
        self.updateTypeView(typeData.OldI, typeMaterial.Old, val);
      }
      if (text.ShowLsst) {
        self.updateTypeView(typeData.LsstI, typeMaterial.Lsst, val);
      }
    });
  typeFolder
    .add(text, "ShowTypeII")
    .name("Show Type II SNe")
    .listen()
    .onChange(function(val) {
      if (text.ShowOld) {
        self.updateTypeView(typeData.OldII, typeMaterial.Old, val);
      }
      if (text.ShowLsst) {
        self.updateTypeView(typeData.LsstII, typeMaterial.Lsst, val);
      }
    });
  typeFolder.open();

  gui.add(text, "Time", 1885, 2025).onChange(function(val) {
    yearBounds[1] = Math.floor(val);
    console.log("upper bound set: " + yearBounds[1]);
    self.updateColors(yearBounds);
  });
  gui.add(text, "oldSize", 1, 30).onChange(function(val) {
    pSizes[typeMaterial.Old] = val;
    pSystem.material[typeMaterial.Old].size = val;
    pSystem.material[typeMaterial.Old].needsUpdate = true;
  });
  gui.add(text, "lsstSize", 1, 30).onChange(function(val) {
    pSizes[typeMaterial.Lsst] = val;
    pSystem.material[typeMaterial.Lsst].size = val;
    pSystem.material[typeMaterial.Lsst].needsUpdate = true;
    //lsstPSize = val;
    //pSystem.material.size = lsstPSize;
  });
  gui.add(text, "attenuation").onChange(function(val) {
    useSizeAttenuation = val;
    pSystem.material[typeMaterial.Old].sizeAttenuation = useSizeAttenuation;
    pSystem.material[typeMaterial.Lsst].sizeAttenuation = useSizeAttenuation;
    pSystem.material[typeMaterial.Old].needsUpdate = true;
    pSystem.material[typeMaterial.Lsst].needsUpdate = true;
  });
  /*
  gui.add(text, "sprite").onChange(function(val) {
    useSprite = val;
    for (var i = 0; i < typeData.length; i++) {
      pBufferGeometry.groups[i].materialIndex =
        pBufferGeometry.groups[i].materialIndex === typeMaterial.Hidden
          ? typeMaterial.Hidden
          : useSprite
          ? typeMaterial.Sprite
          : typeMaterial.Pixel;
      pBufferGeometry.groups[i].needsUpdate = true;
    }
  });
  */
  gui.add(text, "blending").onChange(function(val) {
    pSystem.material.blending = val
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

  self.updateColors = function(bounds) {
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
      for (i = 0; i < snData.length; i++) {
        if (
          oldData[i].Type === "Ia" &&
          text.ShowTypeIa &&
          bounds[0] <= Math.floor(oldData[i].T) &&
          Math.floor(oldData[i].T) <= bounds[1]
        ) {
          OldTypeIaCount++;
          OldSNeCount++;
          pSystem.geometry.colors[i].set(pColors[0]);
          pSystem.geometry.vertices[i].set(
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
          pSystem.geometry.colors[i].set(pColors[2]);
          pSystem.geometry.vertices[i].set(
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
          pSystem.geometry.colors[i].set(pColors[4]);
          pSystem.geometry.vertices[i].set(
            oldData[i].X,
            oldData[i].Y,
            oldData[i].Z
          );
        } else {
          pSystem.geometry.colors[i].set("#000000");
          pSystem.geometry.vertices[i].set(0, 0, 0);
        }
      }
      pSystem.geometry.colorsNeedUpdate = true;
      pSystem.geometry.verticesNeedUpdate = true;
    } else {
      for (i = 0; i < oldData.length; i++) {
        pSystem.geometry.colors[i].set("#000000");
        pSystem.geometry.vertices[i].set(0, 0, 0);
      }
      pSystem.geometry.colorsNeedUpdate = true;
      pSystem.geometry.verticesNeedUpdate = true;
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
          pSystem.geometry.colors[i].set(pColors[1]);
          pSystem.geometry.vertices[i].set(
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
          pSystem.geometry.colors[i].set(pColors[3]);
          pSystem.geometry.vertices[i].set(
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
          pSystem.geometry.colors[i].set(pColors[5]);
          pSystem.geometry.vertices[i].set(
            lsstData[i].X,
            lsstData[i].Y,
            lsstData[i].Z
          );
        } else {
          pSystem.geometry.colors[i].set("#000000");
          pSystem.geometry.vertices[i].set(0, 0, 0);
        }
      }
      pSystem.geometry.colorsNeedUpdate = true;
      pSystem.geometry.verticesNeedUpdate = true;
    } else {
      for (i = 0; i < lsstData.length; i++) {
        pSystem.geometry.colors[i].set("#000000");
        pSystem.geometry.vertices[i].set(0, 0, 0);
      }
      pSystem.geometry.colorsNeedUpdate = true;
      pSystem.geometry.verticesNeedUpdate = true;
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
        numOld +
        " Type Ia : " +
        typeIndex[3] -
        typeIndex[2] +
        " Type I : " +
        typeIndex[1] -
        1 +
        " Type II : " +
        typeIndex[2] -
        typeIndex[1] +
        " LSST : " +
        numLsst +
        " Type Ia : " +
        typeIndex[3] -
        typeIndex[2] +
        " Type I : " +
        typeIndex[1] -
        1 +
        " Type II : " +
        typeIndex[2] -
        typeIndex[1]
    );
  };

  // Draw Legend
  self.drawLegend = function() {
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
          T: Number(d.t),
          // Luminosity
          L: Number(d.log10lum),
          Source: String("Old")
        });
      })
      // when done loading
      .get(function() {
        oldData.sort(function(a, b) {
          return a.Type < b.Type ? -1 : 1;
        });
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
          T: Number(d.t),
          Source: String("LSST")
        });
      })
      // when done loading
      .get(function() {
        lsstData.sort(function(a, b) {
          return a.Type < b.Type ? -1 : 1;
        });
        numLsst = lsstData.length;
        console.log("Loaded LSST Data: " + numLsst + " SNe");

        // concat old and new data
        snData = oldData.concat(lsstData);
        console.log("Combined data: " + snData.length + " SNe");

        // create the particle system for lsst data
        self.createParticleSystem(snData);

        //self.updateColors(yearBounds);
        //pSystem.geometry.colorsNeedUpdate = true;
        //pSystem.geometry.colorsNeedUpdate = true;
        self.drawLegend();
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

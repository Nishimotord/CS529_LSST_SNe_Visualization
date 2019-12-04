# VDS LSST SNe Visualization Project

View a live version [here](https://nishimo1.people.uic.edu/LSST_SNe_Visualization/)

## How to run this code?

1. clone repo (https://github.com/Nishimotord/CS529_LSST_SNe_Visualization)
2. download [LSST Converted Data](https://drive.google.com/open?id=1s3TuXdst0C_iZ7r3ujDsMnZx_nOtP8KK)
   and place in data/
3. Start an http server (with python3): python -m http.server 8888
4. Go to http://localhost:8888

## Data

Old SNe data is from the [The Open Supernovae Catalog](https://sne.space/), where we pulled SNe that have non-null R.A., Dec., dL (Mpc), Type, and Disc. Date fields, along with any name, host, and Mmax fields they may have. It is then [processed](https://github.com/Nishimotord/CS529_LSST_SNe_Visualization/blob/master/data/VDS529convertOpenSN.ipynb) by us, converting the positional data to cartesian coordinates at a Mpc scale, discovery date to a decimal year, and consolidating relevent types into Ia, I, and II types.

LSST SNe data is pulled from the ["Photometric LSST Astronomical Time-series Classification Challenge" (PLAsTiCC)](https://www.kaggle.com/michaelapers/the-plasticc-astronomy-starter-kit), where we pulled ra, decl, true_z, true_peakmjd, and true_target fields. It is then [processed](https://github.com/Nishimotord/CS529_LSST_SNe_Visualization/blob/master/data/VDS529convertPLAsTiCC.ipynb) by us, converting positional data to cartesian coordinates at a Mpc scale, treating peak date as a discovery date represented as a decimal year, and converting true_target values to relevent Ia, I, and II types.

## Acknowledgements

[Andrew Burks](https://andrewtburks.dev/) for providing the starter code.

[Dr. Aaron Geller](http://faculty.wcas.northwestern.edu/aaron-geller/index.php) and [Dr. Mark SubbaRao](https://www.adlerplanetarium.org/whats-here/the-experts/astronomers/) of the Adler Planetarium for the project idea and guidance, providing us a starting point for the [Old SNe data](https://github.com/ageller/IDEAS_FSS-Vis/tree/master/WebGL/threejs/SNdata) and [LSST Data](https://github.com/ageller/UniviewSNvTime/blob/master/rawdata/convertPLAsTiCC.ipynb)

# 2D Orrery
This project provides a 2D representation of the position of the planets of our solar system.  This project makes use of the [Kepler-Utils](https://www.npmjs.com/package/kepler-utils) node module to calculate the heliocentric positions of the planets at any given date.  These positions are then scaled and plotted on an [HTML Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)

## Getting Started
Follow the instructions below to get a local copy of this project running on your

### Prerequisites
You will need to have the [NodeJS](https://nodejs.org/en/) environment installed on your machine in order to use the [NodeJS Package Manager](https://www.npmjs.com/) to install this project.

### Installing

Clone a local copy of this project's repository by running:

```
$ git clone https://github.com/popnfresh234/2d_orrery.git
```

Next, install the required Node packages by running

```
$ npm install
```

### Usage
You can run this project on your local machine by running the following `start` script:

```
$ npm run start
```

The project can then be viewed running by visiting `localhost:8080` in your browser.

You can also build the project for distribution by running the `build` script:

```
$ npm run build
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

The following resources were indispensable for creating this project

* JPL's [Keplerian Elements for Aproximate Positions of the Major Planets](https://ssd.jpl.nasa.gov/?planet_pos)
* Wikipedia entry on [Orbital Elements](https://en.wikipedia.org/wiki/Orbital_elements) for a high level overview
* Wikipedia entry on [Julian Dates](https://en.wikipedia.org/wiki/Julian_day#Converting_Gregorian_calendar_date_to_Julian_Day_Number)
* Wikipedia entry on [Mean Longitude](https://en.wikipedia.org/wiki/Mean_longitude)
* [J. Giesen's website](http://www.jgiesen.de/kepler/kepler.html) regarding Kepler and solving for the eccentric anomaly
* [Rocket and Space Technology](http://www.braeunig.us/space/plntpos.htm) regarding solving for the True Anomaly
* [Stargazing Network](http://www.stargazing.net/kepler/ellipse.html#twig04) regarding converting from polar to rectangular coordinates.
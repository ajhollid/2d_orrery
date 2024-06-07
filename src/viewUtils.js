const ViewUtils = (() => {
  const R_SOL = 10;
  const STAR_COLORS = ["#ffffff", "#ffe9c4", "#d4fbff"];
  const STAR_NUMBER = window.innerWidth;
  const SCALE_DESKTOP = 70;
  let started = false;
  let ms = 1;

  const canvases = document.getElementsByTagName("canvas");
  const planetCanvas = document.getElementById("canvas");
  const bgCanvas = document.getElementById("bg_canvas");
  const ctx = planetCanvas.getContext("2d");
  const bgCtx = bgCanvas.getContext("2d");

  /**
   * Generates a random integer between the given minimum and maximum values, inclusive.
   *
   * @param {number} min - The minimum value.
   * @param {number} max - The maximum value.
   * @returns {number} A random integer between min and max, inclusive.
   *
   * @example
   * // Returns a random integer between 1 and 10
   * const random = getRandom(1, 10);
   */
  const getRandom = (min, max) => Math.round(Math.random() * max - min + min);

  /**
   * Converts a degree value to radians.
   *
   * @param {number} deg - The degree value to be converted.
   * @returns {number} - The converted value in radians.
   *
   * @example
   * // Returns 3.141592653589793
   * const pi = toRadians(180);
   */
  const toRadians = (deg) => (deg * Math.PI) / 180;

  /**
   * Gets the width of the canvas.
   *
   * @returns {number} - The width of the canvas.
   */
  const getWidth = () => planetCanvas.width;

  /**
   * Gets the height of the canvas.
   *
   * @returns {number} - The width of the canvas.
   */
  const getHeight = () => planetCanvas.height;

  /**
   * Gets the context of the canvas.
   *
   * @returns {CanvasRenderingContext2D} - The context of the canvas.
   */
  const getCtx = () => ctx;

  /**
   * Gets the background context of the canvas.
   *
   * @returns {CanvasRenderingContext2D} - The context of the canvas.
   */
  const getBgCtx = () => bgCtx;

  /**
   * Gets the background canvas.
   *
   * @returns {HTMLCanvasElement} - The background canvas.
   */
  const getBgCanvas = () => bgCanvas;

  /**
   * This function is used to draw a number of stars on the background canvas.
   * Each star's position (x, y) is randomly generated within the dimensions of the canvas.
   * The radius of each star is also randomly generated, with a maximum of 1.1.
   * The opacity of each star is randomly generated between 0.5 and 1.
   * The color of each star is randomly selected from the STAR_COLORS array.
   * After all stars are drawn, the globalAlpha of the background context is reset to 1.
   */
  const drawStars = () => {
    for (let i = 0; i < STAR_NUMBER; i += 1) {
      const x = Math.random() * getBgCanvas().width;
      const y = Math.random() * getBgCanvas().height;
      const r = Math.random() * 1.1;
      const a = getRandom(50, 100) / 100;
      getBgCtx().beginPath();
      getBgCtx().globalAlpha = a;
      getBgCtx().fillStyle = STAR_COLORS[getRandom(0, STAR_COLORS.length)];
      getBgCtx().arc(x, y, r, 0, 2 * Math.PI);
      getBgCtx().fill();
      getBgCtx().closePath();
    }
    getBgCtx().globalAlpha = 1;
  };

  /**
   * Initializes the application, sets up event listeners, and draws the initial state of the canvas.
   *
   * @param {Function} incrementSystemCallback - The callback function to be called when the system is incremented.
   */
  const initialize = (incrementSystemCallback) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const buttons = document.getElementsByTagName("button");

    const handleClick = (event) => {
      const start = (e) => {
        started = !started;
        e.target.innerHTML = started ? "Stop" : "Start";
        incrementSystemCallback();
      };

      const setSpeed = (e) => {
        if (e.target.id === "faster-button") {
          ms - 10 < 1 ? (ms = 1) : (ms -= 10);
        } else {
          ms += 10;
        }
        if (ms > 10) {
          ms = Math.floor(ms / 10) * 10;
        }
        const time = ms / 1000 < 1 ? `${ms} ms` : `${ms / 1000} s`;
        document.getElementById("speed-text").innerHTML = `${time} = 1 day`;
      };

      const lookup = {
        "start-button": () => start(event),
        "faster-button": () => setSpeed(event),
        "slower-button": () => setSpeed(event),
      };
      const fn = lookup[event.target.id];
      if (fn) fn();
    };

    for (let i = 0; i < buttons.length; i += 1) {
      const button = buttons[i];
      button.addEventListener("click", handleClick);
    }

    for (let i = 0; i < canvases.length; i += 1) {
      const canvas = canvases[i];
      canvas.width = width;
      canvas.height = height;
    }
    // Draw background
    getBgCtx().fillRect(0, 0, width, height);
    // Draw sun
    getBgCtx().arc(width / 2, height / 2, R_SOL, 0, 2 * Math.PI);
    getBgCtx().fillStyle = "yellow";
    getBgCtx().fill();
    // Draw stars
    drawStars();
  };

  /**
   * Calculates the scaled coordinates for a planet.
   *
   * @param {Object} planet - The planet object. It should have a scaleFactor property.
   * @param {number} x - The original x-coordinate.
   * @param {number} y - The original y-coordinate.
   * @returns {Object} An object with the scaled x and y coordinates.
   *
   * @example
   * // Returns { x: 500, y: 400 }
   * const coords = calcScaledCoords({ scaleFactor: 2 }, 100, 100);
   */
  const calcScaledCoords = (planet, x, y) => {
    const planetaryScaleFactor = planet.scaleFactor ? planet.scaleFactor : 1;
    const scaledX = getWidth() / 2 + (x * SCALE_DESKTOP) / planetaryScaleFactor;
    const scaledY =
      getHeight() / 2 - (y * SCALE_DESKTOP) / planetaryScaleFactor;
    return { x: scaledX, y: scaledY };
  };

  /**
   * Normalize the radius for a planet.
   *
   * @param {number} rFactor - The radius factor for the planet.
   * @returns {number} The normalized radius.
   *
   * @example
   * // Returns 10
   * const normR = calcNormR(10);
   */
  const calcNormR = (rFactor) => {
    const MAX = 40;
    const MIN = 5;
    const FLOOR = 5;
    const r = (rFactor * SCALE_DESKTOP - MIN) / (MAX - MIN) + FLOOR;
    return r;
  };

  /**
   * Draws a planet on the canvas.
   *
   * @param {Object} planet - The planet object. It should have color and rFactor properties.
   * @param {number} x - The original x-coordinate.
   * @param {number} y - The original y-coordinate.
   *
   * @example
   * // Draws a planet with color 'blue', radius factor 10 at coordinates (100, 100)
   * drawPlanet({ color: 'blue', rFactor: 10 }, 100, 100);
   */
  const drawPlanet = (planet, x, y) => {
    const scaledCoords = calcScaledCoords(planet, x, y);
    getCtx().beginPath();
    getCtx().fillStyle = planet.color;
    const r = calcNormR(planet.rFactor);
    getCtx().arc(scaledCoords.x, scaledCoords.y, r, 0, 2 * Math.PI);
    getCtx().fill();
  };

  /**
   * Draws a point on the canvas representing a planet's apogee or perigee.
   *
   * @param {string} type - The type of point to draw. 'A' for apogee, 'P' for perigee.
   * @param {Object} planet - The planet object. It should have color property and an orbit object with genOrbElems object containing helioCentricCoords object with x and y properties.
   * @param {Function} addApiPeriData - The function to call to add the apogee or perigee data.
   *
   * @example
   * // Draws a point for planet's apogee
   * drawPoint('A', { color: 'blue', orbit: { genOrbElems: { helioCentricCoords: { x: 100, y: 100 } } } }, addData);
   */
  const drawPoint = (type, planet, addApiPeriData) => {
    const { x, y } = planet.orbit.genOrbElems.helioCentricCoords;
    const lookup = {
      A: () => "api",
      P: () => "peri",
    };
    const fn = lookup[type];
    if (fn) {
      addApiPeriData(planet.name, fn(), { x, y });
    }

    const scaledApiCoords = calcScaledCoords(
      planet,
      x,
      y,
      getWidth(),
      getHeight()
    );
    bgCtx.beginPath();
    bgCtx.fillStyle = planet.color;
    bgCtx.arc(scaledApiCoords.x, scaledApiCoords.y, 2, 0, 2 * Math.PI);
    bgCtx.fill();
    bgCtx.fillText(type, scaledApiCoords.x + 5, scaledApiCoords.y + 3);
  };

  /**
   * Draws the orbit of a planet on the canvas.
   *
   * @param {Object} planet - The planet object. It should have api, peri, color, orbit, and scaleFactor properties. The api and peri should be objects with x and y properties. The orbit should be an object with genOrbElems object containing a, b, and lPeri properties.
   *
   * @example
   * // Draws the orbit for a planet
   * drawOrbit({ api: { x: 100, y: 100 }, peri: { x: 200, y: 200 }, color: 'blue', orbit: { genOrbElems: { a: 10, b: 20, lPeri: 30 } }, scaleFactor: 2 });
   */
  const drawOrbit = (planet) => {
    const centerX = (planet.api.x + planet.peri.x) / 2;
    const centerY = (planet.api.y + planet.peri.y) / 2;
    const scaledCenterCoords = calcScaledCoords(
      planet,
      centerX,
      centerY,
      getWidth(),
      getHeight()
    );
    if (planet.name !== "pluto") {
      getBgCtx().beginPath();
      getBgCtx().strokeStyle = planet.color;
      getBgCtx().ellipse(
        scaledCenterCoords.x,
        scaledCenterCoords.y,
        (planet.orbit.genOrbElems.a * SCALE_DESKTOP) / planet.scaleFactor,
        (planet.orbit.genOrbElems.b * SCALE_DESKTOP) / planet.scaleFactor,
        toRadians(planet.orbit.genOrbElems.lPeri),
        0,
        2 * Math.PI
      );
      getBgCtx().stroke();
    }
  };

  /**
   * Draws the orbit of Pluto on the canvas.
   * This is a hardcoded orbit as pluto is strange
   *
   * @param {Object} pluto - The Pluto planet object. It should have a color property.
   * @param {Array} plutoPositions - An array of objects representing the positions of Pluto. Each object should have x and y properties.
   *
   * @example
   * // Draws the orbit for Pluto
   * drawPlutoOrbit({ color: 'blue' }, [{ x: 100, y: 100 }, { x: 200, y: 200 }]);
   */
  const drawPlutoOrbit = (pluto, plutoPositions) => {
    for (let i = 0; i < plutoPositions.length; i += 1) {
      const position = plutoPositions[i];
      const scaledCoords = calcScaledCoords(
        pluto,
        position.x,
        position.y,
        getWidth(),
        getHeight()
      );
      getBgCtx().fillStyle = pluto.color;
      getBgCtx().fillRect(scaledCoords.x, scaledCoords.y, 1, 1);
    }
  };

  /**
   * Sets the Julian and Gregorian dates on the webpage.
   *
   * @param {number} julianDate - The Julian date to set.
   * @param {Date} gregorianDate - The Gregorian date to set.
   *
   * @example
   * // Sets the Julian date to 2459200.5 and the Gregorian date to 2021/10/1
   * setDates(2459200.5, new Date(2021, 9, 1));
   */
  const setDates = (julianDate, gregorianDate) => {
    const julianDateText = document.getElementById("julian-date-text");
    const gregorianDateText = document.getElementById("gregorian-date-text");
    julianDateText.innerHTML = `Julian date: ${julianDate}`;
    gregorianDateText.innerHTML = `Gregorian date: ${gregorianDate.getFullYear()}/${gregorianDate.getMonth()}/${gregorianDate.getDate()}`;
  };

  /**
   * Checks if the application has started.
   *
   * @returns {boolean} Returns true if the application has started, false otherwise.
   */
  const isStarted = () => started;

  /**
   * Gets the value of ms.
   *
   * @returns {number} The value of ms.
   *
   * @example
   * // Returns the value of ms, how many ms to wait before incrementing the system
   * const milliseconds = getMS();
   */
  const getMS = () => ms;

  return {
    initialize,
    getWidth,
    getHeight,
    getCtx,
    getBgCtx,
    drawPlanet,
    drawPoint,
    drawOrbit,
    drawPlutoOrbit,
    setDates,
    isStarted,
    getMS,
  };
})();

module.exports = {
  initialize: ViewUtils.initialize,
  getWidth: ViewUtils.getWidth,
  getHeight: ViewUtils.getHeight,
  getCtx: ViewUtils.getCtx,
  getBgCtx: ViewUtils.getBgCtx,
  drawPlanet: ViewUtils.drawPlanet,
  drawPoint: ViewUtils.drawPoint,
  drawOrbit: ViewUtils.drawOrbit,
  drawPlutoOrbit: ViewUtils.drawPlutoOrbit,
  setDates: ViewUtils.setDates,
  isStarted: ViewUtils.isStarted,
  getMS: ViewUtils.getMS,
};

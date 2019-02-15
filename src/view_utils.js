const ViewUtils = ( function () {
  const R_SOL = 10;
  const STAR_COLORS = ['#ffffff', '#ffe9c4', '#d4fbff'];
  const STAR_NUMBER = window.innerWidth;
  const SCALE_DESKTOP = 70;
  let started = false;
  let ms = 1;

  const canvases = document.getElementsByTagName( 'canvas' );
  const planetCanvas = document.getElementById( 'canvas' );
  const bgCanvas = document.getElementById( 'bg_canvas' );
  const ctx = planetCanvas.getContext( '2d' );
  const bgCtx = bgCanvas.getContext( '2d' );


  const getRandom = ( min, max ) => Math.round( ( ( Math.random() * max ) - min ) + min );
  const toRadians = deg => deg * Math.PI / 180;
  const getWidth = () => planetCanvas.width;
  const getHeight = () => planetCanvas.height;
  const getCtx = () => ctx;
  const getBgCtx = () => bgCtx;
  const getBgCanvas = () => bgCanvas;

  const drawStars = () => {
    for ( let i = 0; i < STAR_NUMBER; i += 1 ) {
      const x = Math.random() * getBgCanvas().width;
      const y = Math.random() * getBgCanvas().height;
      const r = Math.random() * 1.1;
      const a = getRandom( 50, 100 ) / 100;
      getBgCtx().beginPath();
      getBgCtx().globalAlpha = a;
      getBgCtx().fillStyle = STAR_COLORS[getRandom( 0, STAR_COLORS.length )];
      getBgCtx().arc( x, y, r, 0, 2 * Math.PI );
      getBgCtx().fill();
      getBgCtx().closePath();
    }
    getBgCtx().globalAlpha = 1;
  };

  const initialize = ( incrementSystemCallback ) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const buttons = document.getElementsByTagName( 'button' );

    const handleClick = ( event ) => {
      const start = ( e ) => {
        started = !started;
        e.target.innerHTML = started ? 'Stop' : 'Start';
        incrementSystemCallback();
      };

      const setSpeed = ( e ) => {
        if ( e.target.id === 'faster-button' ) { ms - 10 < 1 ? ms = 1 : ms -= 10; } else { ms += 10; }
        if ( ms > 10 ) { ms = Math.floor( ms / 10 ) * 10; }
        const time = ms / 1000 < 1 ? `${ms} ms` : `${ms / 1000} s`;
        document.getElementById( 'speed-text' ).innerHTML = `${time} = 1 day`;
      };

      const lookup = {
        'start-button': () => start( event ),
        'faster-button': () => setSpeed( event ),
        'slower-button': () => setSpeed( event ),
      };
      const fn = lookup[event.target.id];
      if ( fn ) fn();
    };

    for ( let i = 0; i < buttons.length; i += 1 ) {
      const button = buttons[i];
      button.addEventListener( 'click', handleClick );
    }

    for ( let i = 0; i < canvases.length; i += 1 ) {
      const canvas = canvases[i];
      canvas.width = width;
      canvas.height = height;
    }
    // Draw background
    getBgCtx().fillRect( 0, 0, width, height );
    // Draw sun
    getBgCtx().arc( width / 2, height / 2, R_SOL, 0, 2 * Math.PI );
    getBgCtx().fillStyle = 'yellow';
    getBgCtx().fill();
    // Draw stars
    drawStars();
  };


  const calcScaledCoords = ( planet, x, y ) => {
    const planetaryScaleFactor = planet.scaleFactor ? planet.scaleFactor : 1;
    const scaledX = ( getWidth() / 2 ) + ( x * SCALE_DESKTOP / planetaryScaleFactor );
    const scaledY = ( getHeight() / 2 ) - ( y * SCALE_DESKTOP / planetaryScaleFactor );
    return { x: scaledX, y: scaledY };
  };

  const calcNormR = ( rFactor ) => {
    const MAX = 40;
    const MIN = 5;
    const FLOOR = 5;
    const r = ( ( rFactor * SCALE_DESKTOP - MIN ) / ( MAX - MIN ) ) + FLOOR;
    return r;
  };

  const drawPlanet = ( planet, x, y ) => {
    const scaledCoords = calcScaledCoords( planet, x, y );
    getCtx().beginPath();
    getCtx().fillStyle = planet.color;
    const r = calcNormR( planet.rFactor );
    getCtx().arc( scaledCoords.x, scaledCoords.y, r, 0, 2 * Math.PI );
    getCtx().fill();
  };

  const drawPoint = ( type, planet, addApiPeriData ) => {
    const { x, y } = planet.orbit.genOrbElems.helioCentricCoords;
    const lookup = {
      A: () => 'api',
      P: () => 'peri',
    };
    const fn = lookup[type];
    if ( fn ) {
      addApiPeriData( planet.name, fn(), { x, y } );
    }

    const scaledApiCoords = calcScaledCoords( planet, x, y, getWidth(), getHeight() );
    bgCtx.beginPath();
    bgCtx.fillStyle = planet.color;
    bgCtx.arc( scaledApiCoords.x, scaledApiCoords.y, 2, 0, 2 * Math.PI );
    bgCtx.fill();
    bgCtx.fillText( type, scaledApiCoords.x + 5, scaledApiCoords.y + 3 );
  };

  const drawOrbit = ( planet ) => {
    const centerX = ( planet.api.x + planet.peri.x ) / 2;
    const centerY = ( planet.api.y + planet.peri.y ) / 2;
    const scaledCenterCoords = calcScaledCoords( planet, centerX, centerY, getWidth(), getHeight() );
    if ( planet.name !== 'pluto' ) {
      getBgCtx().beginPath();
      getBgCtx().strokeStyle = planet.color;
      getBgCtx().ellipse(
        scaledCenterCoords.x,
        scaledCenterCoords.y,
        planet.orbit.genOrbElems.a * SCALE_DESKTOP / planet.scaleFactor,
        planet.orbit.genOrbElems.b * SCALE_DESKTOP / planet.scaleFactor,
        toRadians( planet.orbit.genOrbElems.lPeri ),
        0,
        2 * Math.PI,
      );
      getBgCtx().stroke();
    }
  };

  const drawPlutoOrbit = ( pluto, plutoPositions ) => {
    for ( let i = 0; i < plutoPositions.length; i += 1 ) {
      const position = plutoPositions[i];
      const scaledCoords = calcScaledCoords( pluto, position.x, position.y, getWidth(), getHeight() );
      getBgCtx().fillStyle = pluto.color;
      getBgCtx().fillRect( scaledCoords.x, scaledCoords.y, 1, 1 );
    }
  };

  const setDates = ( julianDate, gregorianDate ) => {
    const julianDateText = document.getElementById( 'julian-date-text' );
    const gregorianDateText = document.getElementById( 'gregorian-date-text' );
    julianDateText.innerHTML = `Julian date: ${julianDate}`;
    gregorianDateText.innerHTML = `Gregorian date: ${gregorianDate.getFullYear()}/${gregorianDate.getMonth()}/${gregorianDate.getDate()}`;
  };

  const isStarted = () => started;
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
}() );

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


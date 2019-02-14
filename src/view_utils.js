const ViewUtils = ( function () {
  const R_SOL = 10;
  const SCALE_DESKTOP = 70;
  const canvases = document.getElementsByTagName( 'canvas' );
  const planetCanvas = document.getElementById( 'canvas' );
  const dataCanvas = document.getElementById( 'data_canvas' );
  const bgCanvas = document.getElementById( 'bg_canvas' );
  const ctx = planetCanvas.getContext( '2d' );
  const bgCtx = bgCanvas.getContext( '2d' );
  const dataCtx = dataCanvas.getContext( '2d' );

  const toRadians = deg => deg * Math.PI / 180;
  const getWidth = () => planetCanvas.width;
  const getHeight = () => planetCanvas.height;
  const getCtx = () => ctx;
  const getBgCtx = () => bgCtx;
  const getDataCtx = () => dataCtx;

  const setupCanvases = ( width, height ) => {
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

  const drawDates = ( julianDate, gregorianDate ) => {
    getDataCtx().clearRect( 0, 0, getWidth(), getHeight() );
    getDataCtx().font = '20px ubuntu';
    getDataCtx().fillStyle = 'white';
    getDataCtx().fillText( `Julian Date: ${julianDate}`, 50, 50 );
    getDataCtx().fillText( `Gregorian Date: ${gregorianDate.getFullYear()}/${gregorianDate.getMonth()}/${gregorianDate.getDate()}`, 50, 70 );
  };

  return {
    setupCanvases,
    getWidth,
    getHeight,
    getCtx,
    getBgCtx,
    drawPlanet,
    drawPoint,
    drawOrbit,
    drawPlutoOrbit,
    drawDates,
  };
}() );

module.exports = {
  setupCanvases: ViewUtils.setupCanvases,
  getWidth: ViewUtils.getWidth,
  getHeight: ViewUtils.getHeight,
  getCtx: ViewUtils.getCtx,
  getBgCtx: ViewUtils.getBgCtx,
  drawPlanet: ViewUtils.drawPlanet,
  drawPoint: ViewUtils.drawPoint,
  drawOrbit: ViewUtils.drawOrbit,
  drawPlutoOrbit: ViewUtils.drawPlutoOrbit,
  drawDates: ViewUtils.drawDates,
};


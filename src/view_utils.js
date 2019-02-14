const ViewUtils = ( function () {
  const R_SOL = 10;
  const SCALE_DESKTOP = 80;
  const canvas = document.getElementById( 'canvas' );
  const bgCanvas = document.getElementById( 'bg_canvas' );
  const ctx = canvas.getContext( '2d' );
  const bgCtx = bgCanvas.getContext( '2d' );

  const toRadians = deg => deg * Math.PI / 180;

  const setupCanvases = ( width, height ) => {
    canvas.width = width;
    canvas.height = height;
    bgCanvas.width = width;
    bgCanvas.height = height;
    // Draw background
    bgCtx.fillRect( 0, 0, width, height );
    // Draw sun
    bgCtx.arc( width / 2, height / 2, R_SOL, 0, 2 * Math.PI );
    bgCtx.fillStyle = 'yellow';
    bgCtx.fill();
  };

  const getWidth = () => canvas.width;
  const getHeight = () => canvas.height;
  const getCtx = () => ctx;
  const getBgCtx = () => bgCtx;

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

    console.log( planet );
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
};


const ViewUtils = ( function () {
  const R_SOL = 10;
  const SCALE_DESKTOP = 80;
  const canvas = document.getElementById( 'canvas' );
  const bgCanvas = document.getElementById( 'bg_canvas' );
  const ctx = canvas.getContext( '2d' );
  const bgCtx = bgCanvas.getContext( '2d' );

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

  return {
    setupCanvases,
    getWidth,
    getHeight,
    getCtx,
    getBgCtx,
    drawPlanet,
  };
}() );

module.exports = {
  setupCanvases: ViewUtils.setupCanvases,
  getWidth: ViewUtils.getWidth,
  getHeight: ViewUtils.getHeight,
  getCtx: ViewUtils.getCtx,
  getBgCtx: ViewUtils.getBgCtx,
  drawPlanet: ViewUtils.drawPlanet,
};

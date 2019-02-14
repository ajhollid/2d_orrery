const ViewUtils = ( function () {
  const canvas = document.getElementById( 'canvas' );
  const bgCanvas = document.getElementById( 'bg_canvas' );
  const ctx = canvas.getContext( '2d' );
  const bgCtx = bgCanvas.getContext( '2d' );

  const setupCanvases = ( width, height ) => {
    canvas.width = width;
    canvas.height = height;
    bgCanvas.width = width;
    bgCanvas.height = height;
    bgCtx.fillRect( 0, 0, width, height );
  };

  const getWidth = () => canvas.width;
  const getHeight = () => canvas.height;
  const getCtx = () => ctx;
  const getBgCtx = () => bgCtx;

  return {
    setupCanvases,
    getWidth,
    getHeight,
    getCtx,
    getBgCtx,
  };
}() );

module.exports = {
  setupCanvases: ViewUtils.setupCanvases,
  getWidth: ViewUtils.getWidth,
  getHeight: ViewUtils.getHeight,
  getCtx: ViewUtils.getCtx,
  getBgCtx: ViewUtils.getBgCtx,
};


require( '../styles/application.scss' );
const ViewUtils = require( './view_utils' );

const app = ( function () {
  ViewUtils.setupCanvases( window.innerWidth, window.innerHeight );
}() );


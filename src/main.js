require( '../styles/application.scss' );
const Kepler = require( 'kepler-utils' );
const ViewUtils = require( './view_utils' );

const { SolarSystem } = Kepler;

const app = ( function () {
  let currentDate = 0;

  ViewUtils.setupCanvases( window.innerWidth, window.innerHeight );

  const updateSolarSystem = ( ) => {
    ViewUtils.getCtx().clearRect( 0, 0, ViewUtils.getWidth(), ViewUtils.getHeight() );
    const cSinceJ2000 = Kepler.JulianUtils.getCenturiesSinceJ2000( currentDate );
    const planetKeys = Object.keys( SolarSystem );
    for ( let i = 0; i < planetKeys.length; i += 1 ) {
      const planetKey = planetKeys[i];
      const planet = SolarSystem[planetKey];
      const orbitals = Kepler.OrbitalUtils.calcOrbitals( planet, cSinceJ2000 );
      planet.orbit.genOrbElems = orbitals;
      orbitals.T = currentDate;
      SolarSystem[planetKey] = planet;
      const { x, y } = planet.orbit.genOrbElems.helioCentricCoords;
      ViewUtils.drawPlanet( planet, x, y );
    }
    currentDate += 1;
    setTimeout( updateSolarSystem, 0 );
  };

  const startSimulation = () => {
    ViewUtils.getCtx().clearRect( 0, 0, ViewUtils.getWidth(), ViewUtils.getHeight() );
    updateSolarSystem( currentDate );
  };

  const setCurrentDate = ( gregorianDate ) => {
    currentDate = Kepler.JulianUtils.getJulianDate( gregorianDate );
  };

  return {
    startSimulation,
    setCurrentDate,
  };
}() );

app.setCurrentDate( '1985/04/30' );
app.startSimulation();


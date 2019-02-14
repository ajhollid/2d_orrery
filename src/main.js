require( '../styles/application.scss' );
const Kepler = require( 'kepler-utils' );
const ViewUtils = require( './view_utils' );

const { SolarSystem } = Kepler;

const app = ( function () {
  let currentDate = 0;

  ViewUtils.setupCanvases( window.innerWidth, window.innerHeight );

  const updateSolarSystem = ( shouldDraw, date ) => {
    const cSinceJ2000 = Kepler.JulianUtils.getCenturiesSinceJ2000( date );
    const planetKeys = Object.keys( SolarSystem );
    for ( let i = 0; i < planetKeys.length; i += 1 ) {
      const planetKey = planetKeys[i];
      const planet = SolarSystem[planetKey];
      const orbitals = Kepler.OrbitalUtils.calcOrbitals( planet, cSinceJ2000 );
      planet.orbit.genOrbElems = orbitals;
      orbitals.T = date;
      SolarSystem[planetKey] = planet;
      const { x, y } = planet.orbit.genOrbElems.helioCentricCoords;
      if ( shouldDraw ) { ViewUtils.drawPlanet( planet, x, y ); }
    }
    return SolarSystem;
  };

  const incrementSystem = () => {
    ViewUtils.getCtx().clearRect( 0, 0, ViewUtils.getWidth(), ViewUtils.getHeight() );
    updateSolarSystem( true, currentDate );
    currentDate += 1;
    setTimeout( incrementSystem, 0 );
  };

  const startSimulation = () => {
    ViewUtils.getCtx().clearRect( 0, 0, ViewUtils.getWidth(), ViewUtils.getHeight() );
    incrementSystem( currentDate );
  };

  const setCurrentDate = ( gregorianDate ) => {
    currentDate = Kepler.JulianUtils.getJulianDate( gregorianDate );
  };

  const addApiPeriData = ( planetKey, key, val ) => {
    SolarSystem[planetKey][key] = val;
    console.log( SolarSystem[planetKey] );
  };

  const drawOrbits = () => {
    const planetKeys = Object.keys( SolarSystem );
    for ( let i = 0; i < planetKeys.length; i += 1 ) {
      const planetKey = planetKeys[i];
      const planet = SolarSystem[planetKey];
      const periSystem = updateSolarSystem( false, Kepler.JulianUtils.getJulianDate( planet.periDate ) );
      ViewUtils.drawPoint( 'P', periSystem[planetKey], addApiPeriData );
      const apiSystem = updateSolarSystem( false, Kepler.JulianUtils.getJulianDate( planet.apiDate ) );
      ViewUtils.drawPoint( 'A', apiSystem[planetKey], addApiPeriData );
      ViewUtils.drawOrbit( planet );
    }
    ViewUtils.drawPlutoOrbit( SolarSystem.pluto, Kepler.OrbitalUtils.getPlutoFullOrbit() );
  };


  return {
    startSimulation,
    setCurrentDate,
    drawOrbits,
  };
}() );

app.setCurrentDate( '1985/04/30' );
app.drawOrbits();
app.startSimulation();


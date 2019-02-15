require( '../styles/application.scss' );
const Kepler = require( 'kepler-utils' );
const ViewUtils = require( './view_utils' );

const { SolarSystem } = Kepler;
const app = ( function () {
  let currentDate = 0;

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
      if ( shouldDraw ) {
        ViewUtils.drawPlanet( planet, x, y );
        ViewUtils.setDates( currentDate, Kepler.JulianUtils.getGregorianDate( currentDate ) );
      }
    }
    return SolarSystem;
  };

  const incrementSystem = () => {
    ViewUtils.getCtx().clearRect( 0, 0, ViewUtils.getWidth(), ViewUtils.getHeight() );
    updateSolarSystem( true, currentDate );
    if ( ViewUtils.isStarted() ) {
      currentDate += 1;
      setTimeout( incrementSystem, ViewUtils.getMS() );
    }
  };

  const addApiPeriData = ( planetKey, key, val ) => {
    SolarSystem[planetKey][key] = val;
  };

  const drawOrbits = () => {
    const planetKeys = Object.keys( SolarSystem );
    for ( let i = 0; i < planetKeys.length; i += 1 ) {
      const planetKey = planetKeys[i];
      const planet = SolarSystem[planetKey];
      const periSystem = updateSolarSystem(
        false,
        Kepler.JulianUtils.getJulianDate( planet.periDate ),
      );
      ViewUtils.drawPoint( 'P', periSystem[planetKey], addApiPeriData );
      const apiSystem = updateSolarSystem(
        false,
        Kepler.JulianUtils.getJulianDate( planet.apiDate ),
      );
      ViewUtils.drawPoint( 'A', apiSystem[planetKey], addApiPeriData );
      ViewUtils.drawOrbit( planet );
    }
    ViewUtils.drawPlutoOrbit( SolarSystem.pluto, Kepler.OrbitalUtils.getPlutoFullOrbit() );
  };

  const startSimulation = () => {
    ViewUtils.initialize( incrementSystem );
    drawOrbits();
    ViewUtils.getCtx().clearRect( 0, 0, ViewUtils.getWidth(), ViewUtils.getHeight() );
    incrementSystem( currentDate );
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

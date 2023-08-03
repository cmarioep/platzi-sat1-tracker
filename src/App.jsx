import { MapView } from './components/MapView';
import { NavBar } from './components/NavBar';
import { SatelliteProvider } from './context/SatelliteProvider';


function App() {

  return (

    <SatelliteProvider>

      <div className='layout'>
        <NavBar />
        <MapView />
      </div>

    </SatelliteProvider>

  )
}

export default App;

import MapContainer from './MapContainer';
import logo from './assets/logo.png'

function App() {
  return (
    <div>
      <div className='
      h-[10vh]
      flex items-center justify-center'>
        <img src={ logo } className='h-full'/>
      </div>
      <MapContainer />
    </div>
  );
}

export default App;

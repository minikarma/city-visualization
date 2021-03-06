/*global L:false*/
import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup} from 'react-leaflet';
import coords from './coords';
import './App.css';
import CityList from './CityList';
import cityIconFactory from './CityIcon';
const cityIcon = cityIconFactory(L);

const YEAR_TIME = 500; // милисекунд на один год
// крайние географические точки по городам России
const NORTH = 69.7;
const SOUTH = 41.18528;
const WEST = 19.63861;
const EAST = 180;

const cities = coords.filter(Boolean).map(city => ({
  lat: city[6],
  lon: city[7],
  name: city[1],
  osmId: city[9],
  year: city[5]
})).sort((a, b) => a.year - b.year);

class App extends Component {
  constructor() {
    super()
    this.state = {
      index: 0
    }
  }

  componentDidMount() {
    let interval = setInterval(function () {
      if (this.state.index === cities.length) {
        clearInterval(interval)
      }
      this.setState({
        index: this.state.index + 1
      })
    }.bind(this), YEAR_TIME)
  }

  render() {
    var founded = cities.filter((c, i) => i <= this.state.index);
    return (
      <div className="container">
        <Map bounds={[[NORTH, WEST], [SOUTH, EAST]]}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          />
          {founded.map(city => {
            return (
              <Marker
                key={city.osmId}
                position={[city.lat, city.lon]}
                icon={cityIcon}
              >
                <Popup>
                  <span>{city.name}</span>
                </Popup>
              </Marker>
            )
          })}
        </Map>
        <CityList cities={founded} />
      </div>

    );
  }
}

export default App;

import React, {useRef, useEffect} from 'react'
import Model from '../../../../data/model'
import * as d3 from 'd3'

const Map = props => {
  let d3Container = useRef(null)
  let countries = require('./csvjson.json')
  useEffect(() => {
    if (props.data.length > 0) {
      d3.select(d3Container.current)
        .selectAll('*')
        .remove()

      let svg = d3.select(d3Container.current)

      // The svg
      // Map and projection
      let projection = d3
        .geoMercator()
        .scale(100)
        .translate([1200 / 2, (600 / 2) * 1.3])

      // Change these data to see ho the great circle reacts*/

      // A path generator
      let path = d3.geoPath().projection(projection)

      fetch(
        'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'
      )
        .then(response => {
          return response.json()
        })
        .then(map => {
          console.log(map)

          let groupByCountry = d3
            .nest()
            .key(function(d) {
              console.log(d)
              return [d.arrival_country, d.departure_country]
            })
            .entries(props.data[0].values)
          console.log(groupByCountry)

          /*data.features.forEach(function(d) {
            d.population = populationById[d.id]
          })*/

          // Draw the map
          svg
            .append('g')
            .selectAll('path')
            .data(map.features)
            .enter()
            .append('path')
            .attr('fill', function(d) {
              let country = groupByCountry.filter(country => {
                let res = country.key.split(',')
                let swedish
                for (let i = 0; i < countries.length; i++) {
                  if (countries[i].english == d.properties.name) {
                    swedish = countries[i].swedish
                  }
                }
                if (res[0] == swedish) {
                  return res
                }
                if (res[1] == swedish) {
                  return res
                }
              })

              return country.length > 0 ? 'red' : '#b8b8b8'
            }) // //return color(populationById[d.id])
            .attr('d', d3.geoPath().projection(projection))
            .style('stroke', '#fff')
            .style('stroke-width', 0)

          // Create data: coordinates of start and end
          props.data[0].values.map(function(flight) {
            try {
              let coordinates = [
                [
                  parseInt(flight.departure_coord[1]),
                  parseInt(flight.departure_coord[0]),
                ],
                [
                  parseInt(flight.arrival_coord[1]),
                  parseInt(flight.arrival_coord[0]),
                ],
              ]

              let link = {
                type: 'LineString',
                coordinates: coordinates,
              }
              // Add the path
              svg
                .append('path')
                .attr('d', path(link))
                .style('fill', 'none')
                .style('stroke', 'orange')
                .style('opacity', 0.5)
                .style('stroke-width', 1)
            } catch (TypeError) {
              console.log(TypeError)
            }
          })
        })
    }
  })
  return <svg width={1400} height={800} ref={d3Container}></svg>
}

export default Map

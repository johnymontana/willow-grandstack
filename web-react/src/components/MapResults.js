import React, { useState } from 'react'
import { Grid, Paper } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import clsx from 'clsx'
import MapGL, { Marker } from '@urbica/react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export default function MapResults(props) {
  console.log(props.properties)
  const theme = useTheme()

  const style = {
    padding: '4px',
    color: '#fff',
    cursor: 'pointer',
    background: '#1978c8',
    borderRadius: '50%',
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
    },
    fixedHeight: {
      height: 540,
    },
  }))
  const classes = useStyles(theme)
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

  const [viewport, setViewport] = useState({
    latitude: 45.667397,
    longitude: -111.054718,
    zoom: 15,
  })

  const [currentProperty, setCurrentProperty] = useState(props.properties[0])

  return (
    <React.Fragment>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={7}>
          <Paper className={fixedHeightPaper}>
            <MapGL
              style={{ width: '100%', height: '100%' }}
              mapStyle="mapbox://styles/mapbox/light-v9"
              accessToken={process.env.REACT_APP_MAPBOX_TOKEN}
              latitude={viewport.latitude}
              longitude={viewport.longitude}
              zoom={viewport.zoom}
              onViewportChange={setViewport}
            >
              {props.properties.map((p, i) => {
                return (
                  <Marker
                    key={i}
                    longitude={p.location.longitude}
                    latitude={p.location.latitude}
                  >
                    <div
                      onClick={() => setCurrentProperty(p)}
                      style={style}
                    ></div>
                  </Marker>
                )
              })}
            </MapGL>
            ;
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={5}>
          <Paper className={fixedHeightPaper}>
            <p>{currentProperty.address}</p>
            <ul>
              <li>Square feet: {currentProperty.sqft}</li>
              <li>Bedrooms: {currentProperty.bedrooms}</li>
              <li>Full baths: {currentProperty.full_baths}</li>
              <li>Half baths: {currentProperty.half_baths}</li>
            </ul>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

import React from 'react'
import MapResults from './MapResults'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

const PROPERTY_SEARCH_QUERY = gql`
  {
    Property(
      first: 200
      filter: {
        location_distance_lt: {
          point: { latitude: 45.667397, longitude: -111.054718 }
          distance: 1000
        }
      }
    ) {
      address
      bedrooms
      full_baths
      half_baths
      sqft
      photos(radius: 1000, first: 100) {
        url
      }
      in_subdivision {
        name
      }
      location {
        latitude
        longitude
      }
    }
  }
`

export default function Search() {
  const { loading, error, data } = useQuery(PROPERTY_SEARCH_QUERY)

  if (error) return <p>Error</p>
  if (loading) return <p>Loading...</p>

  return <MapResults properties={data.Property} />
}

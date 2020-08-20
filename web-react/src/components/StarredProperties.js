import React from 'react'
import Typography from '@material-ui/core/Typography'
import Title from './Title'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

const GET_STARRED_PROPERTIES_QUERY = gql`
  {
    getStarredProperties {
      PropertyID
      address
      LegalDescr
    }
  }
`

export default function StarredProperties() {
  const { loading, error, data } = useQuery(GET_STARRED_PROPERTIES_QUERY)
  if (loading) return <p>Loading starred properties</p>
  if (error) return <p>No Starred Properties</p>

  return (
    <React.Fragment>
      <Title>Starred Properties</Title>

      <ul>
        {data.getStarredProperties.map((p) => {
          return <li>{p.LegalDescr}</li>
        })}
      </ul>
    </React.Fragment>
  )
}

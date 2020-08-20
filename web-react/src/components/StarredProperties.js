import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import Title from './Title'

const GET_STARRED_PROPERTIES_QUERY = gql`
  {
    getStarredProperties {
      id
      address
      LegalDescr
    }
  }
`

export default function StarredProperties() {
  const { loading, error, data } = useQuery(GET_STARRED_PROPERTIES_QUERY)
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error</p>

  return (
    <React.Fragment>
      <Title>Starred Properties</Title>

      <ul>
        {data.getStarredProperties.map((p) => {
          return <li key={p.id}>{p.LegalDescr}</li>
        })}
      </ul>
    </React.Fragment>
  )
}

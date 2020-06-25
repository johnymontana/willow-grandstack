import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Title from './Title'

const GET_RECENT_REVIEWS_QUERY = gql`
  {
    Property(
      first: 10
      orderBy: TotalAcres_desc
      filter: {
        address_not: null
        bedrooms_not: null
        full_baths_not: null
        in_subdivision: { name_not: "N/A" }
      }
    ) {
      TotalValue
      id
      address
      bedrooms
      full_baths
      half_baths
      sqft
      in_subdivision {
        name
      }
    }
  }
`

export default function RecentReviews() {
  const { loading, error, data } = useQuery(GET_RECENT_REVIEWS_QUERY)
  if (error) return <p>Error</p>
  if (loading) return <p>Loading</p>

  return (
    <React.Fragment>
      <Title>Most Expensive Properties</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Address</TableCell>
            <TableCell>Subdivision Name</TableCell>
            <TableCell>Bedrooms</TableCell>
            <TableCell>Sqft</TableCell>
            <TableCell align="right">Total Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.Property.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.address}</TableCell>
              <TableCell>{row.in_subdivision[0].name}</TableCell>
              <TableCell>{row.bedrooms}</TableCell>
              <TableCell>{row.sqft}</TableCell>
              <TableCell align="right">{row.TotalValue}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  )
}

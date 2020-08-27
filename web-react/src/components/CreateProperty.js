import React from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

const CREATE_PROPERTY_MUTATION = gql`
  mutation createCityMutation($city: String!) {
    CreateCity(name: $city) {
      name
    }
  }
`

export default function CreateProperty() {
  let input
  const [createProperty, { data }] = useMutation(CREATE_PROPERTY_MUTATION)

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          createProperty({ variables: { city: input.value } })
          input.value = ''
        }}
      >
        <input
          ref={(n) => {
            input = n
          }}
        />
        <button type="submit">Add City</button>
      </form>
    </div>
  )
}

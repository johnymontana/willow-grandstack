import React, { useCallback, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'

const AppWithApollo = () => {
  const [accessToken, setAccessToken] = useState()
  const { getAccessTokenSilently, loginWithRedirect } = useAuth0()

  const getAccessToken = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently()
      console.log(token)
      setAccessToken(token)
    } catch (err) {
      //loginWithRedirect()
    }
  }, [getAccessTokenSilently, loginWithRedirect])

  useEffect(() => {
    getAccessToken()
  }, [getAccessToken])

  const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_URI || '/graphql',
    request: async (operation) => {
      if (accessToken) {
        operation.setContext({
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      }
    },
  })

  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  )
}

const Main = () => (
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
    redirectUri={window.location.origin}
    audience="https://grandstack.auth0.com/api/v2/"
  >
    <AppWithApollo />
  </Auth0Provider>
)

ReactDOM.render(<Main />, document.getElementById('root'))
registerServiceWorker()

const dotenv = require('dotenv')
const axios = require('axios')

dotenv.config()

export const resolvers = {
  Property: {
    photos: async (property, args) => {
      const requestURL = `https://a.mapillary.com/v3/images?client_id=${process.env.MAPILLARY_KEY}&lookat=${property.location.longitude},${property.location.latitude}&closeto=${property.location.longitude},${property.location.latitude}&radius=${args.radius}&per_page=${args.first}`

      const response = await axios.get(requestURL)

      //console.log(response)

      const features = response.data.features

      return features.map((v) => {
        return {
          url: `https://images.mapillary.com/${v.properties.key}/thumb-640.jpg`,
        }
      })
    },
  },
}

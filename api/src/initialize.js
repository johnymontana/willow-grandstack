export const initializeDatabase = (driver) => {
  const initCypher = `CALL apoc.schema.assert({Property: ["location"]}, {Neighborhood: ["name"], Property: ["id"], Subdivision: ["name"]})`

  const executeQuery = (driver) => {
    const session = driver.session()
    return session
      .writeTransaction((tx) => tx.run(initCypher))
      .then()
      .finally(() => session.close())
  }

  executeQuery(driver).catch((error) => console.error(error))
}

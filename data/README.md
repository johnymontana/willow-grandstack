# Data Import

## Parcels

Import county level parcel data (in this case for Gallatin, MT):

Download county level shapefile

```shell
wget ftp://ftp.geoinfo.msl.mt.gov/Data/Spatial/MSDI/Cadastral/Parcels/Gallatin/GallatinOwnerParcel_shp.zip
```

Convert shapefile to geojson, using [GDAL command line tool](https://gdal.org/index.html)

```shell
ogr2ogr gallatin.geojson -f "GeoJSON" -lco id_field=PARCELID -t_srs "EPSG:4326" GallatinOwnerParcel_shp.shp
```

**Import into Neo4j**

Create database uniqueness constraint for `Property` nodes

```cypher
CREATE CONSTRAINT ON (p:Property) ASSERT p.id IS UNIQUE
```

Import `Property` nodes

```cypher
CALL apoc.load.json("file:///gallatin.geojson") YIELD value
FOREACH (feat IN  value.features |
    MERGE (p:Property {id: feat.id})
    SET p += feat.properties
)
```

Create database uniqueness constraint for `City` nodes

```cypher
CREATE CONSTRAINT ON (c:City) ASSERT c.name IS UNIQUE;
```

Add `City` nodes and connect to `Property` nodes

```cypher
MATCH (p:Property) WHERE EXISTS(p.CityStateZ)
WITH p, split(p.CityStateZ,",")[0] AS cityname
MERGE (c:City {name: toUpper(cityname)})
MERGE (p)-[:IN_CITY]->(c)
```

What is the average property value per city?

```cypher
MATCH (c:City)<-[:IN_CITY]-(p:Property)
WITH c.name as city, avg(p.TotalValue) as avgValue
RETURN * ORDER BY avgValue DESC
```

**Working with geospatial data**

Filter out any MultiPolygon geometries, we'll deal with those later

```shell
jq '.features[] | select(.geometry.type=="Polygon") | [.]' gallatin.geojson > filtered.geojson
```

Add polygon property - list of `Point` types

```cypher
CALL apoc.load.json("file:///filtered.geojson") YIELD value
    MATCH (p:Property {id: value.id})
    SET p.polygon = apoc.cypher.runFirstColumnSingle('UNWIND $coords AS coord RETURN COLLECT(Point({latitude: coord[1], longitude: coord[0]}))', {coords: value.geometry.coordinates[0]})
```

Set location property to first Point in polygon

```cypher
MATCH (p:Property) WHERE EXISTS(p.polygon)
SET p.location = p.polygon[0]
```

Create index on `polygon` property for fast searching:

```cypher
CREATE INDEX ON :Property(polygon)
```

Create index on `location` property:

```cypher
CREATE INDEX ON :Property(location)
```

given a point:

```cypher
RETURN Point({latitude:45.667397, longitude:-111.054718})
```

Find properties within 1km of this point:

```cypher
MATCH (p:Property)
WHERE EXISTS(p.location)
AND distance(p.location, Point({latitude:45.667397, longitude:-111.054718})) < 1000
RETURN p LIMIT 10
```

What property does this point belong to? Query withinPolygon using [spatial algorithms library](https://github.com/neo4j-contrib/spatial-algorithms/)

```cypher
MATCH (p:Property) WHERE EXISTS(p.polygon)
AND spatial.algo.withinPolygon(Point({latitude:45.667397, longitude:-111.054718}), p.polygon)
RETURN p
```

**Additional Property Information**

See [ScrapePropertyRecordCards.ipynb](ScrapePropertyRecordCards.ipynb) python notebook to scrape additional property information.

```cypher
CREATE CONSTRAINT ON (s:Subdivision) ASSERT s.name IS UNIQUE;
```

```cypher
CREATE CONSTRAINT ON (n:Neighborhood) ASSERT n.name IS UNQIUE;
```

```cypher
LOAD CSV WITH HEADERS FROM "file:///property_features_full.csv" AS row
MATCH (p:Property {id: row.id})
SET p.sqft = toInteger(row.sqft),
    p.bedrooms = toInteger(row.bedrooms),
    p.full_baths = toInteger(row.full_baths),
    p.half_baths = toInteger(row.half_baths),
    p.lot_size = toInteger(row.lot_size),
    p.acres    = toInteger(row.acres),
    p.year_built = toInteger(row.year_built),
    p.address = row.address,
    p.subdivision = row.subdivision,
    p.style = row.style,
    p.heating = row.heating,
    p.category = row.subcategory

MERGE (s:Subdivision {name: coalesce(row.subdivision, 'N/A')})
MERGE (s)<-[:IN_SUBDIVISION]-(p)


MERGE (n:Neighborhood {code: coalesce(row.neighborhood, 'N/A')})
MERGE (n)<-[:IN_NEIGHBORHOOD]-(p)
```

```cypher
CREATE CONSTRAINT ON (n:Appraisal) ASSERT (n.property_id, n.year) IS NODE KEY
```

```cypher
LOAD CSV WITH HEADERS FROM "file:///appraisals.csv" AS row
MATCH (p:Property {id: row.id})
MERGE (a:Appraisal {property_id: row.id, year: toInteger(row.year)})
SET a.land = toInteger(row.land),
    a.building = toInteger(row.building),
    a.total = toInteger(row.total),
    a.method = row.method
MERGE (p)-[:HAS_APPRAISAL]->(a)
```

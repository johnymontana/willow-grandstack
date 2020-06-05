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

Import into Neo4j

```cypher
CALL apoc.load.json("file:///gallatin.geojson") YIELD value
FOREACH (feat IN  value.features |
    CREATE (p:Property {id: feat.id})
    SET p += feat.properties
)
```

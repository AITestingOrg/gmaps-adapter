# gmaps-adapter

A simple Node.js app using restify that interacts with the googleMaps directions API.

## Running locally:

* Make sure that the most updated node version is installed.
* Run `npm install`.
* Run `npm start`.

## Swagger 2.0 docs

This service currently provides the following endpoints:

* POST to api/v1/directions with a body:

```js
{
	"origin": "string value",
	"destination": "string value",
	"departureTime": "time of departure in epoch"
}
```

* POST to api/v1/geocode with a body:

```js
{
	"address": "string value",
}
```

The json for swagger on this API can be found in src/swagger/api-swagger-v2.json

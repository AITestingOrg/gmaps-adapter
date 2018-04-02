# gmaps-adapter

A simple Node.js app using restify that interacts with the googleMaps directions API.

## Running locally:

* Make sure that the most updated node version is installed.
* Run `npm install`.
* Run `npm start`.

## Swagger 2.0 docs

This service currently provides the following endpoints:

* POST to api/v1/diretions with a body :

```js
{
	"origin": "string value",
	"destination": "string value",
	"departure_time": "time of departure in epoch"
}
```

The json for swagger on this API can be found in src/swagger/api-swagger-v2.json

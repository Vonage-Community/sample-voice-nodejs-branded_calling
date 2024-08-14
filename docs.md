# Branded Calling

Using the [Vonage Voice API](https://developer.vonage.com/en/voice/voice-api/overview) and [Vonage Client SDK](https://developer.vonage.com/en/vonage-client-sdk/overview) you are able to display a brand and reason when calling a customer via your App.

Your SIP Number/Username/Called ID should be entered as the `ID/Number` then the matching `Reason` will show in the Android/iOS client. The Android/iOS client can use the `Reason` as the `to` when making a call, this will connect the call to your SIP URI with the `ID/Number` in the header.

If you are not using [Cloud Runtime]https://developer.vonage.com/en/cloud-runtime) to run the project, you will need to expose the server to the internet. Then update the Answer URL and Event Webhook to point to `/voice/answer` and `/voice/event` respectfully.

## Endpoints

* POST `/users`
* GET `/token`

## POST `/users`

This endpoint creates a new Vonage User and returns a token for use with the Vonage Client SDK.

### Request Body

|Key|Value|
|:---|:---|
|username|The number of the user|

#### Example
```
{
	"username": "447000000000"
}
```

### Response
```
{
	"token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## GET `/token`

This endpoint returns a token for Vonage User. The User must be created first.

### Query Parameters

|Key|Value|
|:---|:---|
|username|The number of the user|

### Response
```
{
	"token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
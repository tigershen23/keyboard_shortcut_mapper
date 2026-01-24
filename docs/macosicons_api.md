Search icons

Search for icons using various filters and search options.

https://api.macosicons.com/api/v1/search

Examples

cURL

JavaScript

const response = await fetch('https://api.macosicons.com/api/v1/search', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'x-api-key': 'c7cb464ff7623480f5e1400eeeca5f4e6961c17c6e444c6a50dceb9381a441ac'
},
body: JSON.stringify({
query: 'chrome',
searchOptions: {
hitsPerPage: 20,
page: 1
}
})
});

const data = await response.json();
console.log(data);
Parameters
Name Location Type Description
x-api-key header string API key for authentication (not required for macosicons.com domain)
query query string Search query as URL parameter
Request Body
Schema
JSON
application/json
query
string
e.g. safari
Search query string

searchOptions
object
hitsPerPage
number
e.g. 20
Number of results per page (default: 20)

page
number
e.g. 1
Page number (default: 1)

offset
number
e.g. 0
Offset for pagination (default: 0)

filters
string[]
e.g. ["category = \"browsers\""]
Array of filter strings

Array items
string
sort
string[]
e.g. ["downloads:desc"]
Array of sort criteria

Array items
string
Responses
Schema
JSON
200
Successful search results
hits
object[]
Array items
appName
string
lowResPngUrl
string
icnsUrl
string
iOSUrl
string
category
string
downloads
number
credit
string
timeStamp
string
uploadedBy
string
totalHits
number
totalPages
number
hitsPerPage
number
page
number
400
Bad request
statusCode
number
e.g. 400
message
string
e.g. Valid search query is required
401
Unauthorized
statusCode
number
e.g. 401
message
string
e.g. Invalid API key
429
Too Many Requests - Rate limit exceeded or API call limit exceeded
statusCode
number
e.g. 429
message
string
e.g. Rate limit exceeded. Maximum 2 requests per second allowed.
statusMessage
string
e.g. API call limit exceeded
500
Internal server error
statusCode
number
e.g. 500
message
string
e.g. An error occurred while searching.

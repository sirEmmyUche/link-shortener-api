# link-shortener-api

## Description
This API was designed for reducing long links and urls into a shorter links that still redirects to the original long link page.
it was built using the node-url-shortener package installer, together with express that is suitable for frontend users.

## Usage
function () {
longUrl = your long links or url to be shortened
fetch( '/shorten', {
method:post,
body:longUrl 
}
)}

// response  longLink: (the initial long link)
              shortLink: (the shortened url)
              date: date of occurence.
              
              
## Error message 
for error handling, using try, catch method or .catch() will reference the type of error.

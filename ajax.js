const smartyUrl = `https://us-street.api.smartystreets.com/street-address?key=21102174564513388&street=525%20S%20Winchester%20Blvd&city=San%20Jose&state=CA&candidates=10`;
const smartyAPIKey = "116245326468663699"
const parkAPIKey = "Dh9t2ouUlJP0VGC7e4oZfCCi8GGZz13WfVJOXl3G";
// const parkAPIKey = "Dh9t2ouUlJP0VGC7e4oZfCCi8GGZz13WfVJOXl";
const parkUrl = `https://developer.nps.gov/api/v1/parks?stateCode=tx&stateCode=&api_key=${parkAPIKey}`;

// Selecting the input fields in the DOM
const addressField = document.forms["myForm"]["address"]
const cityField = document.forms["myForm"]["city"]
const stateField = document.forms["myForm"]["state"]
const zipcodeField = document.forms["myForm"]["zipcode"]

// Grabbing the parksection elements with JS
const parkSection = document.querySelector('#park-section')
const parkSectionImage = document.querySelector('#park-section div img')
const parkSectionLink = document.querySelector('#park-section a')
const parkSectionDescription = document.querySelector('#park-section p')
const parkSectionNumber = document.querySelector('#park-section h4')

// Reusable AJAX functinon for making http request
// const makeRequest = function(url, success, fail) {
//   // Create the new XMLHttpRequest Object
//   const httpRequest = new XMLHttpRequest();

//   // readyState of 4 means the request has been completed
//   httpRequest.onreadystatechange = function() {
//     if (this.readyState === 4) {
//       handleResponse(this, success, fail);
//     }
//   };
//   httpRequest.open("GET", url); // Create connection with the server
//   httpRequest.send(); // Send the request
// }

// Function that handles any error in the fetch request
function handleError(response) {
  if (!response.ok) {
    throw (response.status + ": " + response.statusText)
  }

  return response.json();
}

// Using the fetch API instead of the XHR
function makeRequest(url, success, fail) {
  fetch(url)
    .then((response) => handleError(response))
    .then((data) => success(data))
    .catch((error) => fail(error))
}

// handles the request response when the ready state changes
// function handleResponse(httpRequest, success, fail) {
//   if (httpRequest.readyState === 4) {
//     if (httpRequest.status === 200) {
//       success(httpRequest.responseText)
//     } else {
//       fail(httpRequest.status + ":" + httpRequest.response)
//     }
//   }
// }

// function that handles successful request completion for smarty
function smartyUpdateUISuccess(res) {
  // console.log(data)
  // const res = JSON.parse(data)
  const zipcode = res[0].components.zipcode
  const plus4_code = res[0].components.plus4_code
  zipcodeField.value = `${zipcode}-${plus4_code}`
}

// function that handles successful request completion from park API
function parkUpdateUISuccess(parsedRes) {
  // console.log(data)
  // const parsedRes = JSON.parse(data)
  const eventNum = Math.floor(Math.random() * parsedRes.data.length) + 1
  const eventName = parsedRes.data[eventNum].fullName;
  const eventUrl = parsedRes.data[eventNum].directionsUrl;
  const eventDesc = parsedRes.data[eventNum].description

  // Updating the DOM with the data gotten
  parkSectionImage.src = "https://www.nps.gov/common/commonspot/templates/assetsCT/images/branding/logo.png";
  parkSectionLink.href = eventUrl
  parkSectionLink.textContent = eventName
  parkSectionDescription.textContent = eventDesc
  parkSectionNumber.textContent = `Event Number: ${eventNum}`
}

// function that handles failed request completion for smarty
function smartyUpdateUIFailure(data) {
  console.log(data)
}

// function that handles failed request completion for park API
function parkUpdateUIFailure(data) {
  console.log(data)
}

const checkCompletion = () => {
  if (addressField.value !== '' && cityField.value !== '' && stateField.value !== '') {
    const requestUrl = `https://us-street.api.smartystreets.com/street-address?key=${smartyAPIKey}&street=${addressField.value}&city=${cityField.value}&state=${stateField.value}&candidates=10`;
    makeRequest(requestUrl, smartyUpdateUISuccess, smartyUpdateUIFailure)
  }
}

// Add event listener to the input filed
[addressField, cityField, stateField].forEach((item) => item.addEventListener("blur", checkCompletion))

// add event listener to make request when content has loaded
window.addEventListener("DOMContentLoaded", () => {makeRequest(parkUrl, parkUpdateUISuccess, parkUpdateUIFailure)})
// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();


// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
    requestAnimFrame( animate );
	var currentTime = new Date().getTime();
	if (mLastFrameTime === 0) {
		mLastFrameTime = currentTime;
	}

	if ((currentTime - mLastFrameTime) > mWaitTime) {
		addPhoto();
		mLastFrameTime = currentTime;
	}
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/
// Variable for more moreIndicator

function GalleryImage(source, blurb, d, location) {
	//implement me as an object to hold the following data about an image:
	//1. location where photo was take
  this.image = source;
	//2. description of photo
  this.description = blurb;
	//3. the date when the photo was taken
  this.date = d;
	//4. either a String (src URL) or an an HTMLImageObject (bitmap of the photo. https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement)
  this.location = location;
}
// Counter for the mImages array
var mCurrentIndex = 0;

// add info from json file to DOM
function addPhoto() {
  document.getElementById("photo").src = mImages[mCurrentIndex].image;
  $('.location').text('Location: ' + mImages[mCurrentIndex].description);
  $('.date').text('Date: ' + mImages[mCurrentIndex].date);
  $('.description').text('Description: ' + mImages[mCurrentIndex].location);
  console.log(mImages[mCurrentIndex].image);
}
let backClicked = false;
// move to next photo
function goForward() {
  $('#nextPhoto').click(function() {
    backClicked = false;
    if (mCurrentIndex === mImages.length - 1) {
      mCurrentIndex = 0;
      addPhoto();
      mLastFrameTime = 0;
    } else {
      mCurrentIndex++;
      mLastFrameTime = 0;
      addPhoto();
    }
  });
};
// move to previous photo
function goBackward() {
  $('#prevPhoto').click(function() {
    backClicked = true;
    if (mCurrentIndex === 0) {
      mCurrentIndex = mImages.length -1;
      addPhoto();
      mLastFrameTime = 0;
    } else {
      mCurrentIndex--;
      addPhoto();
      mLastFrameTime = 0;
    }
  })
};
// shows details when clicked
function showDetails() {
  $('.moreIndicator').click(function() {
    if($('.moreIndicator').hasClass('rot90')) {
      $('.details').slideDown();
      $('.moreIndicator').removeClass('rot90');
      $('.moreIndicator').addClass('rot270');
    }
    else {
      $('.details').slideUp();
      $('.moreIndicator').removeClass('rot270');
      $('.moreIndicator').addClass('rot90');
    }
  });
};
// Get request function
function getQueryParams(qs) {
    qs = qs.replace(/\+/g, " ");
    var params = {},
        re = /[?&]?([^=]+)=([^&]*)/g,
        tokens;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
}
// URL for the JSON to load by default
var $_GET = getQueryParams(document.location.search + '');
var mUrl = '';
if($_GET['json']) {
  mUrl = $_GET['json'];
} else {
  mUrl = ['images.json']
}
// XMLHttpRequest variable
var mRequest = new XMLHttpRequest();

mRequest.onreadystatechange = function() {
    // Do something if file is opened
    if (mRequest.readyState == 4 && mRequest.status == 200) {
      try {
        mJson = JSON.parse(mRequest.responseText);
        for (let i = 0; i < mJson.images.length; i++) {
          let imgSrc = mJson.images[i].imgPath;
          let locat = mJson.images[i].imgLocation;
          let dat = mJson.images[i].date;
          let descrip = mJson.images[i].description;
          mImages.push(new GalleryImage(imgSrc, locat, dat, descrip));

        }
        console.log(mJson);
      } catch(err) {

        console.log(err.message);
      }
    }
  };
mRequest.open('GET', mUrl, true);
mRequest.send();
// Array holding GalleryImage objects (see below).
var mImages = [];

// Holds the retrived JSON information
let mJson;


//Push gallery image object into an array
function makeGalleryImageOnloadCallback(galleryImage) {
	return function(e) {
		galleryImage.img = e.target;
		mImages.push(galleryImage);
	}
}

$(document).ready( function() {
  goForward();
  goBackward();
  showDetails();

	// This initially hides the photos' metadata information
	$('.details').eq(0).hide();

});

window.addEventListener('load', function() {

	console.log('window loaded');

}, false);

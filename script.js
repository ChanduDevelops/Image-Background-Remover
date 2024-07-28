// import imglyRemoveBackground from "@imgly/background-removal";

// let image_src = "./image.png"; // This could be ImageData, ArrayBuffer, Uint8Array, Blob, URL, or string

// imglyRemoveBackground(image_src).then((blob) => {
//     // The result is a blob encoded as PNG. It can be converted to an URL to be used as HTMLImage.src
//     const url = URL.createObjectURL(blob);
// });


var inputImageButton = document.getElementById("input-image");
var previewImage = document.querySelector(".preview-image");
var imgContainer = document.querySelector(".image-container")

var inputImage = document.createElement("img");
var resultImage = document.createElement("img");

var cdDiv = document.querySelector(".cd")
var convertButton = document.querySelector(".convert");
var downloadButton = document.querySelector(".download");

var loadingArea = document.querySelector(".loading");

var imageProduced = false;
var isClicked = false;
var imageURL;


function removeBackground() {
  const formData = new FormData();
  formData.append("image_file", inputImage);
  formData.append("size", "auto");

  const API_URL = "https://sdk.photoroom.com/v1/segment"   //"https://api.remove.bg/v1.0/removebg";
  const API_KEY = "462e85b63d6eb909eaed3b2207304de1a39a6e48"  //"4sGX1xWUjSB56qBLxjVsUEg5";

  return fetch(API_URL, {
    method: "POST",
    headers: {
     'x-api-key': API_KEY,
    },
    body: formData,
  }).then(response => response.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob)
      imageURL = url;
      imageProduced = true;
      resultImage.src = url;
      console.log(resultImage);
      return resultImage
    }).catch(e => {
      console.error("Error :", e.message)
    })
}

function download() {
  var anchorElement = document.createElement("a");
  anchorElement.href = imageURL;
  anchorElement.download = "bg-removed-image.png";
  document.body.appendChild(anchorElement);
  anchorElement.click();
  document.body.removeChild(anchorElement);
}

inputImageButton.onchange = () => {
  const reader = new FileReader();
  inputImage = inputImageButton.files[0];

  reader.readAsDataURL(inputImageButton.files[0]);
  reader.onload = () => {
    isClicked = true;
    previewImage.src = reader.result;
    // inputImage = reader.result;
  }
  cdDiv.classList.add("open")
}

convertButton.addEventListener("click", clikcConvert)
function clikcConvert() {
  if (inputImageButton.files.length === 0 || isClicked == false) {
    window.alert("Cannot convert without Image\nPlease select an image");
    setTimeout(() => {
      window.location.reload()
    }, 500);
  } else {
    processImage()
  }
}

async function processImage() {
  imgContainer.classList.add("blur");

  try {
    let result = await removeBackground();
    if (result) {
      previewImage.src = result.src;
    }
    else {
      console.log("else");
    }
  } catch (e) {
    console.log("error");
  }

  imgContainer.classList.remove("blur");
  downloadButton.classList.add("download-open")
}

downloadButton.onclick = () => {
  if (inputImageButton.files.length === 0) {
    window.alert("Please select image");
  } else {
    if (imageProduced) {
      download();
    } else {
      window.alert("Please wait Image is in processing");
    }
  }
}

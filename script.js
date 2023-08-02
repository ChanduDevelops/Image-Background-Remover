
var inputImageButton = document.querySelector("#input-image");
var previewImage = document.querySelector("#selected-image");
var inputImage = document.createElement("img");
var resultImage = document.createElement("img");

var convertButton = document.querySelector("#convert-button");
var downloadButton = document.querySelector("#download-button");
var previewButton = document.querySelector("#preview-button");
// var beforeButton = document.querySelector("#before-button");
// var afterButton = document.querySelector("#after-button");

var loadingArea = document.querySelector("#loading");
loadingArea.style.display = "none";

var imageProduced = false;
var isClicked = false;
var imageURL;

function buffering() {
  previewImage.style.zIndex = "-1";
  loadingArea.style.display = "flex";
  previewImage.classList.add("blur");
  loadingArea.style.zIndex = "10";
  setTimeout(() => {
    loadingArea.style.zIndex = "-1";
    previewImage.classList.remove("blur");
    loadingArea.style.display = "none";
  }, 3000);
}

function removeBackground() {
  const formData = new FormData();
  formData.append("image_file", inputImage);
  formData.append("size", "auto");

  const API_URL = "https://api.remove.bg/v1.0/removebg";
  const API_KEY = "pWpqxkd8eNJxhJqQ59hYVFCk";

  fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: {
      "X-Api-Key": API_KEY,
    },
    body: formData,
  })
    .then(function (response) {
      return response.blob();
    })
    .then(function (blob) {
      const url = URL.createObjectURL(blob);
      imageURL = url;
      imageProduced = true;
      resultImage.src = url;
    })
    .catch((error) => {
      console.error("Error occurred:", error);
    });
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
  loadingArea.style.zIndex = "-1";
  previewImage.style.zIndex = "1";
  const reader = new FileReader();
  inputImage = inputImageButton.files[0];
  reader.readAsDataURL(inputImageButton.files[0]);
  reader.onload = () => {
    isClicked = true;
    previewImage.src = reader.result;
    // inputImage = reader.result;
  };
};

convertButton.onclick = () => {
  console.log(inputImageButton.files.length);
  console.log(isClicked);
  if (inputImageButton.files.length === 0 || isClicked == false) {
    window.alert("Cannot convert without Image\nPlease select an image");
  } else {
    buffering();
    removeBackground();
  }
};

previewButton.onclick = () => {
  if (imageProduced) {
    previewImage.src = resultImage.src;
  } else {
    window.alert("Click again on convert");
  }
};

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
};

// beforeButton.onclick = () => {
//   previewImage.classList.add("blur");
//   setTimeout(() => {
//     previewImage.classList.remove("blur");
//   }, 250);
//   previewImage.src = currentImageURL;
// };

// afterButton.onclick = () => {
//   previewImage.classList.add("blur");
//   setTimeout(() => {
//     previewImage.classList.remove("blur");
//   }, 250);
//   previewImage.src = resultImage.src;
// };

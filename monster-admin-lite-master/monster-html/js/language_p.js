/**
 * Language Panel Js
 */

'use strict';

document.addEventListener('DOMContentLoaded', function (e) {
  (function () {
    const deactivateAcc = document.querySelector('#formAccountDeactivation');

    // update core image
    let coreImage = document.getElementById('uploadedAvatar');
    const fileInput = document.querySelector('.account-file-input'),
      resetFileInput = document.querySelector('.account-image-reset');

    if (coreImage) {
      const resetImage = coreImage.src;
      fileInput.onchange = () => {
        if (fileInput.files[0]) {
          coreImage.src = window.URL.createObjectURL(fileInput.files[0]);
        }
      };
      resetFileInput.onclick = () => {
        fileInput.value = '';
        coreImage.src = resetImage;
      };
    }


       // update first image
       let firstImage = document.getElementById('uploadedAvatar1');
       const fileInputfirst = document.querySelector('.account-file-input1'),
         resetFileInputfirst = document.querySelector('.account-image-reset1');
   
       if (firstImage) {
         const resetImagef = firstImage.src;
         fileInputfirst.onchange = () => {
           if (fileInputfirst.files[0]) {
            firstImage.src = window.URL.createObjectURL(fileInputfirst.files[0]);
           }
         };
         resetFileInputfirst.onclick = () => {
          fileInputfirst.value = '';
           firstImage.src = resetImagef;
         };
       }
         // update second image
         let secondImage = document.getElementById('uploadedAvatar2');
         const fileInputsecond = document.querySelector('.account-file-input2'),
           resetFileInputsecond = document.querySelector('.account-image-reset2');
     
         if (secondImage) {
           const resetImagesec = secondImage.src;
           fileInputsecond.onchange = () => {
             if (fileInputsecond.files[0]) {
              secondImage.src = window.URL.createObjectURL(fileInputsecond.files[0]);
             }
           };
           resetFileInputsecond.onclick = () => {
            fileInputsecond.value = '';
             secondImage.src = resetImagesec;
           };
         }

          // update third image
          let thirdImage = document.getElementById('uploadedAvatar3');
          const fileInputthird = document.querySelector('.account-file-input3'),
            resetFileInputthird = document.querySelector('.account-image-reset3');
      
          if (thirdImage) {
            const resetImagesec = thirdImage.src;
            fileInputthird.onchange = () => {
              if (fileInputthird.files[0]) {
                thirdImage.src = window.URL.createObjectURL(fileInputthird.files[0]);
              }
            };
            resetFileInputthird.onclick = () => {
              fileInputthird.value = '';
             thirdImage.src = resetImagesec;
            };
          }
        // update forth image
          let forthImage = document.getElementById('uploadedAvatar4');
          const fileInputforth = document.querySelector('.account-file-input4'),
            resetFileInputforth = document.querySelector('.account-image-reset4');
      
          if (forthImage) {
            const resetImagesec = forthImage.src;
            fileInputforth.onchange = () => {
              if (fileInputforth.files[0]) {
                forthImage.src = window.URL.createObjectURL(fileInputforth.files[0]);
              }
            };
            resetFileInputforth.onclick = () => {
              fileInputforth.value = '';
              forthImage.src = resetImagesec;
            };
          }


          
  })();
});

// function saveDetailedRoadmapImages() {
//     // Get references to all the file inputs for detailed roadmap images
//     var files = [
//         document.getElementById("upload1").files[0],
//         document.getElementById("upload2").files[0],
//         document.getElementById("upload3").files[0],
//         document.getElementById("upload4").files[0]
//     ];

//     // Check if all files are selected
//     for (var i = 0; i < files.length; i++) {
//         if (!files[i]) {
//             alert("Please select all detailed roadmap images.");
//             return;
//         }
//     }

//     const storageRef = firebase.storage().ref();

//     var urls = [];

//     // Loop through each file and upload to Firebase Storage
//     Promise.all(files.map(file => {
//         const name = +new Date() + "-" + file.name;
//         const metadata = {
//             contentType: file.type
//         };

//         return storageRef.child(name).put(file, metadata)
//             .then(snapshot => snapshot.ref.getDownloadURL())
//             .then(url => {
//                 urls.push(url);
//             });
//     }))
//     .then(() => {
//         // Now you have an array 'urls' containing download URLs for all uploaded images

//         // Perform any necessary actions with the URLs, such as saving to a database
//         // You can use 'urls' to store the image URLs in Firebase Realtime Database or elsewhere

//         alert("Detailed roadmap images uploaded successfully!");
//     })
//     .catch(error => {
//         console.error("Error uploading images:", error);
//         alert("An error occurred while uploading images. Please try again.");
//     });
// }



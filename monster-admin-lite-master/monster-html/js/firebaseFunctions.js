//modified save
function saveLanguageMod() {
   console.log("saveLanguage function is being called.");

   var languageName = document.getElementById("language-name").value;
   var languageDesc = document.getElementById("language-desc").value;
   var languageUses = document.getElementById("language-uses").value;
   var languageOtherDetails = document.getElementById("language-other").value;
   var coreRoadmapFile = document.getElementById("photo").files[0];

   if (!languageName || !languageOtherDetails || !languageDesc || !languageUses || !coreRoadmapFile) {
       alert("Please fill in all the fields and select an image.");
       return;
   }

   const storageRef = firebase.storage().ref();
   const coreRoadmapName = +new Date() + "-" + coreRoadmapFile.name;
   const coreRoadmapMetadata = {
       contentType: coreRoadmapFile.type
   };

   const coreRoadmapTask = storageRef.child(coreRoadmapName).put(coreRoadmapFile, coreRoadmapMetadata);

   coreRoadmapTask
       .then(snapshot => snapshot.ref.getDownloadURL())
       .then(coreRoadmapUrl => {
           // Save language data with core roadmap image URL to Realtime Database
           var languageData = {
               name: languageName,
               description: languageDesc,
               uses: languageUses,
               coreRoadmapImageURL: coreRoadmapUrl,
               detailedRoadmap: []  // Initialize the detailed roadmap array
           };

           // Now, handle detailed roadmap images
           for (var i = 1; i <= 4; i++) {
               var detailedRoadmapFile = document.getElementById("upload" + i).files[0];
               if (detailedRoadmapFile) {
                   const detailedRoadmapName = +new Date() + "-" + detailedRoadmapFile.name;
                   const detailedRoadmapMetadata = {
                       contentType: detailedRoadmapFile.type
                   };

                   const detailedRoadmapTask = storageRef.child(detailedRoadmapName).put(detailedRoadmapFile, detailedRoadmapMetadata);

                   detailedRoadmapTask
                       .then(snapshot => snapshot.ref.getDownloadURL())
                       .then(detailedRoadmapUrl => {
                           languageData.detailedRoadmap.push({
                               imgurl: detailedRoadmapUrl,
                               index: i - 1
                           });

                           // Check if all detailed roadmap images have been processed
                           if (languageData.detailedRoadmap.length === 4) {
                               var languagesRef = firebase.database().ref("languages");
                               var newLanguageRef = languagesRef.push();
                               newLanguageRef.set(languageData);

                               alert("Language saved successfully!");

                               // Clear form fields
                               document.getElementById("language-name").value = "";
                               document.getElementById("language-desc").value = "";
                               document.getElementById("language-uses").value = "";
                               document.getElementById("photo").value = "";

                               for (var j = 1; j <= 4; j++) {
                                   document.getElementById("upload" + j).value = "";
                               }
                           }
                       })
                       .catch(error => {
                           console.error("Error uploading detailed roadmap image:", error);
                           alert("An error occurred while uploading detailed roadmap images. Please try again.");
                       });
               }
           }
       })
       .catch(error => {
           console.error("Error uploading core roadmap image or saving language details:", error);
           alert("An error occurred. Please try again.");
       });
}



function saveLanguage() {
   console.log("saveLanguage function is being called."); // Add this line
    var languageName = document.getElementById("language-name").value;
    var languageDesc = document.getElementById("language-desc").value;
    var languageUses = document.getElementById("language-uses").value;
    var languageOtherDetails = document.getElementById("language-other").value;
    var file = document.getElementById("coreroadmap").files[0];
 
    if (!languageName ||  !languageOtherDetails || !languageDesc || !languageUses || !file) {
       alert("Please fill in all the fields and select an image.");
       return;
    }
 
    const storageRef = firebase.storage().ref();
    const name = +new Date() + "-" + file.name;
    const metadata = {
       contentType: file.type
    };
 
    const task = storageRef.child(name).put(file, metadata);
    task
       .then(snapshot => snapshot.ref.getDownloadURL())
       .then(url => {
          // Save language data with image URL to Realtime Database
          var languageData = {
             name: languageName, // Set the language name explicitly
             description: languageDesc,
             uses: languageUses,
             imageURL: url
          };
 
          var languagesRef = firebase.database().ref("languages");
 
          // Generate a new unique key for the language entry
          var newLanguageRef = languagesRef.push();
 
          // Set the language data with the new key
          newLanguageRef.set(languageData);
 
          alert("Language saved successfully!");
 
          // Clear form fields
          document.getElementById("language-name").value = "";
          document.getElementById("language-desc").value = "";
          document.getElementById("language-uses").value = "";
          document.getElementById("photo").value = "";
       })
       .catch(error => {
          console.error("Error uploading file or saving language details:", error);
          alert("An error occurred. Please try again.");
       });
 }

 function showLanguages() {
    var languageListContainer = document.getElementById("language-list-container");
    var languageList = document.getElementById("language-list");

    // Clear previous language data
    languageList.innerHTML = "";

    // Retrieve and display all languages from the Realtime Database
    firebase.database().ref("languages").once("value")
       .then(snapshot => {
          snapshot.forEach(childSnapshot => {
           var languageKey = childSnapshot.key;
             var languageData = childSnapshot.val();
             var languageCard = document.createElement("div");
             languageCard.className = "language-card";
             languageCard.innerHTML = `
             <button id="show-languages" class="upload-btn" onclick="editLanguage('${languageKey}')">Edit </button>
             <button class="delete-btn" onclick="deleteLanguage('${languageKey}')">Delete</button>
                <h3>${languageData.name}</h3>
                <p>Description: ${languageData.description}</p>
                <p>Uses: ${languageData.uses}</p>
                <img src="${languageData.imageURL}" alt="Language Image" class="language-image">
               
             `;
             languageList.appendChild(languageCard);
          });

          // Show the language list container
          languageListContainer.style.display = "block";
       })
       .catch(error => {
          console.error("Error retrieving language data:", error);
          alert("An error occurred while retrieving language data. Please try again.");
       });
 }


function deleteLanguage(languageKey) {
 // Delete the language data from the Realtime Database
 firebase
    .database()
    .ref("languages/" + languageKey)
    .remove()
    .then(() => {
       alert("Language deleted successfully!");
       showLanguages()
    })
    .catch(error => {
       console.error("Error deleting language:", error);
       alert("An error occurred while deleting the language. Please try again.");
    });
}
function editLanguage(languageKey) {
// Retrieve the language details based on the language key
firebase
 .database()
 .ref("languages/" + languageKey)
 .once("value")
 .then(snapshot => {
    var languageData = snapshot.val();

    if (languageData) {
       // Set the language details in the form fields for editing
       document.getElementById("language-name").value = languageData.name || "";
       document.getElementById("language-desc").value = languageData.description || "";
       document.getElementById("language-uses").value = languageData.uses || "";

       // Change the button text and onclick event for updating the language
       document.getElementById("upload").textContent = "Update Language";
       document.getElementById("upload").onclick = () => updateLanguage(languageKey);
    } else {
       console.error("Language details not found.");
       alert("Language details not found. Please try again.");
    }
 })
 .catch(error => {
    console.error("Error retrieving language details:", error);
    alert("An error occurred while retrieving language details. Please try again.");
 });
}
function updateLanguage(languageKey) {
 var languageName = document.getElementById("language-name").value;
 var languageDesc = document.getElementById("language-desc").value;
 var languageUses = document.getElementById("language-uses").value;

 if (!languageName || !languageDesc || !languageUses) {
    alert("Please fill in all the fields.");
    return;
 }

 // Get the reference to the specific language entry using the languageKey
 var languageRef = firebase.database().ref("languages/" + languageKey);

 // Update the language data in the Realtime Database
 languageRef
    .update({
       name: languageName,
       description: languageDesc,
       uses: languageUses
    })
    .then(() => {
       alert("Language updated successfully!");
       // Reset the form fields and button text
       document.getElementById("language-name").value = "";
       document.getElementById("language-desc").value = "";
       document.getElementById("language-uses").value = "";
       document.getElementById("photo").value = "";
       document.getElementById("upload").textContent = "Save Language";
       document.getElementById("upload").onclick = saveLanguage;
    })
    .catch(error => {
       console.error("Error updating language:", error);
       alert("An error occurred while updating the language. Please try again.");
    });
}
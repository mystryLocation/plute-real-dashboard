
var logoutLink = document.getElementById('logout-link');
if (logoutLink) {
    logoutLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default behavior of the link
        logout(); // Call the logout function
    });
}


function logout() {
firebase.auth().signOut().then(function() {
    // Sign-out successful, clear session data
    sessionStorage.removeItem('isLoggedIn');
    window.location.href = '../index.html'; // Redirect to the login page
}).catch(function(error) {
    // An error happened.
    console.error(error);
});
}

function saveLanguage() {
    var languageName = document.getElementById("language-name").value;
    var languageDesc = document.getElementById("language-desc").value;
    var languageuses = document.getElementById("language-uses").value;
    var languageOther = document.getElementById("language-other").value;
    var files = document.getElementsByClassName("coreroadmap")[0].files;


    if (!languageName || !languageDesc || !languageuses || !languageOther || files.length === 0) {
        alert("Please fill in all the fields and select at least one image.");
        return;
    }

    const storageRef = firebase.storage().ref();
    const technologiesRef = firebase.database().ref("technologies");

    // Array to store image URLs
    var imageURLs = [];

    // Counter to keep track of image order
    var imageIndex = 0;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const name = +new Date() + "-" + file.name;
        const metadata = {
            contentType: file.type
        };

        const task = storageRef.child(name).put(file, metadata);
        task
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => {
                // Push the URL to the array
                imageURLs.push({ index: imageIndex++, url: url });

                // Check if all images have been processed
                if (imageURLs.length === files.length) {
                    // Save language data with image URLs to Realtime Database
                    var languageData = {
                        name: languageName,
                        description: languageDesc,
                        usesUsed: languageuses,
                        languageOtherInfo:languageOther,
                        images: imageURLs
                    };

                    // Generate a new unique key for the language entry
                    var newlanguageRef = technologiesRef.push();

                    // Set the language data with the new key
                    newlanguageRef.set(languageData);

                    // Reset the input fields
                    document.getElementById("language-name").value = '';
                    document.getElementById("language-desc").value = '';
                    document.getElementById("language-uses").value = '';
                    // document.getElementById("language-images").value = '';
                    document.getElementById("language-other").value='';
                    alert("Technologies saved successfully!");
                }
            })
            .catch(error => {
                console.error("Error uploading file or saving language details:", error);
                alert("An error occurred. Please try again.");
            });
    }
}



function previewImages(event) {
    const input = event.target;

    if (input.files && input.files.length > 0) {
        const imagesPreview = document.getElementById('images-preview');
        imagesPreview.innerHTML = ''; // Clear previous previews

        for (let i = 0; i < input.files.length; i++) {
            const reader = new FileReader();
            const img = document.createElement('img');
            img.classList.add('image-preview');
            reader.onload = function(e) {
                img.src = e.target.result;
            };
            reader.readAsDataURL(input.files[i]);
            imagesPreview.appendChild(img);
        }
    }
}

// Function to retrieve and display language data from Firebase Realtime Database
// Function to retrieve and display language data from Firebase Realtime Database
function displayLanguageData() {
    var technologiesRef = firebase.database().ref("technologies");

    technologiesRef.on('child_added', function(childSnapshot) {
        var languageKey = childSnapshot.key;
        var languageData = childSnapshot.val();

        var languageList = document.getElementById('language-list');
        if (!languageList) {
            console.error("Language list element not found");
            return;
        }

        var languageItem = document.createElement('div');
        languageItem.classList.add('language-item'); // Add a class for styling
        languageItem.innerHTML = `
            <h3>${languageData.name}</h3>
            <p>Description: ${languageData.description}</p>
            <p>Uses Used: ${languageData.usesUsed}</p>
            <p>Language Other Info: ${languageData.languageOtherInfo}</p>
            <div id="image-container-${languageKey}" class="image-container"></div>
            <button class="edit-button" data-key="${languageKey}">Edit</button>
            <button class="delete-button" data-key="${languageKey}">Delete</button>
        `;
        languageList.appendChild(languageItem);

        // Display images
        var imageContainer = document.getElementById(`image-container-${languageKey}`);
        if (!imageContainer) {
            console.error(`Image container not found for language key: ${languageKey}`);
            return;
        }

        languageData.images.forEach(function(image, index) {
            var imgElement = document.createElement('img');
            imgElement.src = image.url;
            imgElement.alt = `Image ${index + 1}`;
            imgElement.classList.add('language-image');
            imageContainer.appendChild(imgElement);
        });

        // Add event listener to delete button
        var deleteButton = languageItem.querySelector('.delete-button');
        if (deleteButton) {
            deleteButton.addEventListener('click', function() {
                var key = this.getAttribute('data-key');
                deletelanguage(key);
            });
        } else {
            console.error("Delete button not found for language item");
        }

        // Add event listener to edit button
        var editButton = languageItem.querySelector('.edit-button');
        if (editButton) {
            editButton.addEventListener('click', function() {
                var key = this.getAttribute('data-key');
                editlanguage(key);
            });
        } else {
            console.error("Edit button not found for language item");
        }
    });
}

function editlanguage(key) {
    // Redirect to the edit language page with the key as a query parameter
    window.location.href = "../monster-html/editLang/edit_language.html?key=" + key;
}

function deletelanguage(key) {
    var technologiesRef = firebase.database().ref("technologies").child(key);
    technologiesRef.remove()
        .then(function() {
            alert("language deleted successfully!");
            window.location.reload();
        })
        .catch(function(error) {
            console.error("Error deleting language:", error);
            alert("An error occurred while deleting language. Please try again.");
        });
}



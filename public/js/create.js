function error(element, message) {
    element.classList.add('error');
    element.textContent = message;
}

function charsCount(element, wordCountElement, count) {
    wordCountElement.textContent = element.value.length + '/' + count;
    if (element.value.length > count) {
        element.value = element.value.substring(0, count);
        wordCountElement.textContent = element.value.length + '/' + count;
        wordCountElement.style.color= 'red';
    } else {
        wordCountElement.style.color= '#444';
    }
    
}

function fileData(element) {
    const imageElement = document.getElementById('coverPreview');
    const coverInfoElement = document.getElementById('coverInfo');
    const file = element.files[0];

    if (!file) {
        coverInfoElement.innerHTML = 'No file selected';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const resolution = img.width + 'x' + img.height;
            const size = (file.size / 1024 / 1024).toFixed(2); // Size in MB
            if (size > 2) {
                coverInfoElement.innerHTML = 'Cover image must be less than 2MB.';
                error(document.getElementById('coverError'), 'Cover image must be less than 2MB.');
            } else {
                error(document.getElementById('coverError'), '');
            }
            const name = file.name;
            const type = file.type;

            imageElement.innerHTML = `<img src="${e.target.result}" alt="Cover Image" class="coverPreview" />`;
            coverInfoElement.innerHTML = `Name: ${name}   Size: ${size}MB    Type: ${type}    Resolution: ${resolution}`;
        };
        img.src = e.target.result;
    };

    reader.onerror = function() {
        coverInfoElement.innerHTML = 'Error reading file';
    };

    reader.readAsDataURL(file);
}

function validateAndSubmit() {
    const form = document.getElementById('articleForm');
    const title = document.getElementById('title');
    const description = document.getElementById('description');
    const content = document.getElementById('content');
    const cover = document.getElementById('coverImage');

    if (!title.value) {
        error(document.getElementById('titleError'), 'Title is required.');
        return;
    }
    if (!description.value) {
        error(document.getElementById('descriptionError'), 'Description is required.');
        return;
    }
    if (!content.value) {
        error(document.getElementById('contentError'), 'Content is required.');
        return;
    }
    if (cover.files[0].size > 2000000) {
        error(document.getElementById('coverError'), 'Cover image must be less than 2MB.');
        return;
    }
    if (title.length > 50) {
        error(document.getElementById('titleError'), 'Title must be less than 50 characters.');
        return;
    }
    if (title.length < 8) {
        error(document.getElementById('titleError'), 'Title must be more than 10 characters.');
        return;
    }
    if (description.length > 70) {
        error(document.getElementById('descriptionError'), 'Description must be less than 100 characters.');
        return;
    }
    if (description.length < 10) {
        error(document.getElementById('descriptionError'), 'Description must be more than 10 characters.');
        return;
    }
    form.onsubmit = null;
    form.submit();
}
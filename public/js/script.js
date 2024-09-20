function modalist(choice) {
    document.getElementById('hider').style.display = "block";
    if (choice == "info") {
        document.getElementById("info").style.display = "flex";
    }
}

function setDefault(choice) {
    if (choice == "bg") {
        document.querySelector('.user-edit-banner').style.backgroundImage = 'url(/img/default_banner.svg)';
        document.getElementById('bg').value = '';
        document.getElementById('defaultBg').value = '1';
    }
    if (choice == "pp") {
        document.querySelector('.user-edit-img').style.backgroundImage = 'url(/img/default.jpg)';
        document.getElementById('pic').value = '';
        document.getElementById('defaultPic').value = '1';
    }
}

function hideHider() {
    document.getElementById('hider').style.display = "none";
}

function validateForm() {
    document.getElementById('edit-form').querySelectorAll('input').forEach(input => {
        input.style.borderBottom = "none";
    });
    document.querySelectorAll('.input-error').forEach(error => {
        error.innerHTML = "";
    });
    const id = document.getElementById('id');
    const fullname = document.getElementById('fullname');
    const username = document.getElementById('username');
    const bio = document.getElementById('bio');
    const banner = document.getElementById('bg');
    const image = document.getElementById('pic');

    if (id.value == '') {
        formError('Don\'t try to hack me please, we all know about the console');
        return false;
    } else {
        if (fullname.value == '') {
            inputError('fullname', 'Please enter a fullname');
            return false;
        } else {
            if (fullname.value.length > 30) {
                inputError('fullname', 'Fullname must be at most 30 characters');
                return false;
            }
            if (!fullname.value.match(/^[a-zA-Z\s]*$/)) {
                inputError('fullname', 'Fullname can only contain letters and whitespace');
                return false;
            }
            if (fullname.value.match(/^[a-zA-Z\s]*$/)) {
                let fullnameArray = fullname.value.split(' ');
                if (fullnameArray.length < 2) {
                    inputError('fullname', 'Full name must contain at least two words');
                    return false;
                }
            }
        }
        if (username.value == '') {
            inputError('username', 'Please enter a username');
            return false;
        } else {
            if (username.value.length > 15) {
                inputError('username', 'Username must be at most 15 characters');
                return false;
            }
            if (username.value.length < 5) {
                inputError('username', 'Username must be at least 5 characters');
                return false;
            }
            if (!username.value.match(/^[a-zA-Z0-9_.]*$/)) {
                inputError('username', 'Username can only contain letters, numbers and underscores');
                return false;
            }
            if (username.value.match(/^[a-zA-Z0-9_]*$/)) {
                if (!checkUsernameAvailabilityAjax(username.value)) {
                    inputError('username', 'Username already taken');
                    return false;
                }
            }
        }
        if (bio.value.length > 160) {
            inputError('bio', 'Bio must be at most 160 characters');
            return false;
        }
        if (banner.value && !banner.value.match(/\.(jpg|jpeg|png|gif)$/)) {
            inputError('bg', 'Please select a valid image file');
            return false;
        }
        if (banner.value && banner.files[0].size > 2097152) {
            inputError('bg', 'Banner must be at most 2MB');
            return false;
        }
        if (image.value && !image.value.match(/\.(jpg|jpeg|png|gif)$/)) {
            inputError('pic', 'Please select a valid image file');  
            return false;
        }
        if (image.value && image.files[0].size > 2097152) {
            inputError('pic', 'Profile picture must be at most 2MB');
            return false;
        }

        return true;
    }
}

function inputError(input, message) {
    document.getElementById(input).style.borderBottom = "1.5px solid red";
    document.getElementById(input + '-error').innerText = message;
}

function formError(message) {
    document.getElementById('form-error').style.display = "block";
    document.getElementById('form-error').innerHTML = message;
}

function checkUsernameAvailabilityAjax(username) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `/username/${username}`, true);

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            if (xhr.responseText == 'Username already taken') {
                return false;
            } else {
                return true;
            }
        } else {
            console.error('Something went wrong');
        }
    };

    xhr.onerror = function() {
        console.error('Something went wrong');
    };

    xhr.send();
}

function submitForm(btn) {
    if (!validateForm()) {
        return;
    }
    btn.innerHTML = `<div class="loader"></div>`;
    let form = document.getElementById('edit-form');
    let formData = new FormData(form);

    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/edit', true);

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            if (xhr.responseText == 'Profile updated') {
                setTimeout(() => {
                    btn.innerHTML = `<i class="bi bi-check"></i>`;
                }, 1000);
                setTimeout(() => {
                    document.getElementById('info').style.display = "none";
                    document.getElementById('hider').style.display = "none";
                    window.location.reload();
                }, 1500);
            }
        } else {
            console.error('Something went wrong');
        }
    };

    xhr.onerror = function() {
        console.error('Something went wrong');
    };

    xhr.send(formData);
}

function showActions(element) {
    document.querySelectorAll('.actions-').forEach(action => {
        action.previousElementSibling.outerHTML = `<i class="bi bi-three-dots"></i>`;
        action.parentNode.onclick = function() {
            showActions(action);
        }
        action.style.display = "none";
    });
    element.previousElementSibling.outerHTML = `<i class="bi bi-x   "></i>`;
    element.parentNode.onclick = function() {
        hideActions(element);
    };
    element.style.display = "flex";
}

function hideActions(element) {
    element.previousElementSibling.outerHTML = `<i class="bi bi-three-dots"></i>`;
    element.parentNode.onclick = function() {
        showActions(element);
    };
    element.style.display = "none";
}
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  // Function to show messages (error or success)
  const showMessage = (input, message, type) => {
    removeMessages(input); // First, remove any existing messages

    const p = document.createElement("p");
    p.classList.add(
      "mt-2",
      "text-xs",
      type === "error" ? "text-red-600" : "text-green-600",
      type === "error" ? "dark:text-red-400" : "dark:text-green-400"
    );
    p.innerHTML = `<span class="font-medium">${
      type === "error" ? "Oh, snapp!" : "Well done!"
    }</span> ${message}`;

    p.id = type === "error" ? "outlined_error_help" : "outlined_success_help";
    input.setAttribute("aria-describedby", p.id);

    const container = input.closest(".input-container");
    if (container) {
      container.appendChild(p);
    }
  };

  // Function to remove any existing messages (both success and error)
  const removeMessages = (input) => {
    const container = input.closest(".input-container");
    if (container) {
      const existingMessages = container.querySelectorAll(
        "#outlined_error_help, #outlined_success_help"
      );
      existingMessages.forEach((message) => message.remove());
    }
  };

  // Function to validate the password field
  const validatePassword = (input) => {
    const value = input.value.trim();
    let message = "";
    let isValid = true;

    // Check if password is empty
    if (value.length === 0) {
      showMessage(input, "Password is required.", "error");
      input.classList.add("border-red-600", "dark:border-red-500");
      input.classList.remove("border-green-600", "dark:border-green-500");
      return false; // Invalid password
    }

    // Check password criteria
    if (value.length < 8) {
      message += "Password must be at least 8 characters long. ";
      isValid = false;
    }
    if (!/[A-Z]/.test(value)) {
      message += "Must contain at least one uppercase letter. ";
      isValid = false;
    }
    if (!/[a-z]/.test(value)) {
      message += "Must contain at least one lowercase letter. ";
      isValid = false;
    }
    if (!/\d/.test(value)) {
      message += "Must contain at least one number. ";
      isValid = false;
    }
    if (!/[!@$!%*?&]/.test(value)) {
      message += "Must contain at least one special character. ";
      isValid = false;
    }

    // Show error or success message based on validity
    if (isValid) {
      showMessage(input, "Password is strong.", "success");
      input.classList.add("border-green-600", "dark:border-green-500");
      input.classList.remove("border-red-600", "dark:border-red-500");
      return true; // Valid password
    } else {
      showMessage(input, message, "error");
      input.classList.add("border-red-600", "dark:border-red-500");
      input.classList.remove("border-green-600", "dark:border-green-500");
      return false; // Invalid password
    }
  };

  // Function to validate input fields
  const validateField = (input) => {
    if (input.id === "password") {
      return validatePassword(input);
    } else {
      const isValid = validateInput(input);

      if (isValid) {
        input.classList.remove("border-red-600", "dark:border-red-500");
        input.classList.add("border-green-600", "dark:border-green-500");

        showMessage(input, "Valid input.", "success");
        return true;
      } else {
        input.classList.remove("border-green-600", "dark:border-green-500");
        input.classList.add("border-red-600", "dark:border-red-500");

        showMessage(input, "Invalid input. Please check again.", "error");
        return false;
      }
    }
  };

  // Event listener for input validation
  form.addEventListener("input", (event) => {
    if (
      event.target.matches(
        "input[type='text'], input[type='email'], input[type='password']"
      )
    ) {
      validateField(event.target);
    }
  });

  // Prevent form submission if fields are invalid
  form.addEventListener("submit", (event) => {
    const inputs = form.querySelectorAll(
      "input[type='text'], input[type='email'], input[type='password']"
    );
    let formIsValid = true;

    inputs.forEach((input) => {
      if (!validateField(input)) {
        formIsValid = false;
      }
    });

    if (!formIsValid) {
      event.preventDefault(); // Prevent submission if any field is invalid
    }
  });

  // Input validation for email and fullname
  function validateInput(input) {
    const id = input.id;
    switch (id) {
      case "fullname":
        return /^[a-zA-Z]+ [a-zA-Z]+$/.test(input.value.trim());
      case "email":
        return /^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(input.value.trim());
      default:
        return false;
    }
  }
});
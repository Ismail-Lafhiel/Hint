document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  const showMessage = (input, message, type) => {
    removeMessage(input, type);

    // Create the new message element
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

    // Assign the correct id and aria-describedby attribute
    p.id = type === "error" ? "outlined_error_help" : "outlined_success_help";
    input.setAttribute(
      "aria-describedby",
      type === "error" ? "outlined_error_help" : "outlined_success_help"
    );

    // Find the .input-container to append the message
    const container = input.closest(".input-container");
    if (container) {
      container.appendChild(p);
    }
  };

  // Function to remove the existing message
  const removeMessage = (input, type) => {
    const messageId =
      type === "error" ? "outlined_error_help" : "outlined_success_help";
    const container = input.closest(".input-container");
    if (container) {
      const existingMessage = container.querySelector(`#${messageId}`);
      if (existingMessage) {
        existingMessage.remove();
      }
    }
  };

  const validatePassword = (input) => {
    const value = input.value.trim();
    let message = "";
    let isValid = true;

    // Handle empty password case
    if (value.length === 0) {
      removeMessage(input, "error");
      removeMessage(input, "success");
      return;
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

    // Display message based on validity
    if (isValid) {
      showMessage(input, "Password is strong.", "success");
      removeMessage(input, "error");
    } else {
      showMessage(input, message, "error");
    }
  };

  const validateField = (input) => {
    if (input.id === "password") {
      validatePassword(input);
    } else {
      const isValid = validateInput(input);

      const classes = input.classList;
      if (isValid) {
        // Success: Change the outline to green and display success message
        classes.remove(
          "border-red-600",
          "dark:border-red-500",
          "focus:border-red-600"
        );
        classes.add(
          "border-green-600",
          "dark:border-green-500",
          "focus:border-green-600"
        );

        // Show the success message
        showMessage(input, "Valid input.", "success");

        // Remove any error message
        removeMessage(input, "error");
      } else {
        // Error: Change the outline to red and display error message
        classes.remove(
          "border-green-600",
          "dark:border-green-500",
          "focus:border-green-600"
        );
        classes.add(
          "border-red-600",
          "dark:border-red-500",
          "focus:border-red-600"
        );

        // Show the error message
        showMessage(input, "Invalid input. Please check again.", "error");

        // Remove any success message
        removeMessage(input, "success");
      }
    }
  };

  // Add event listeners to input fields
  form.addEventListener("input", (event) => {
    if (
      event.target.matches(
        "input[type='text'], input[type='email'], input[type='password']"
      )
    ) {
      validateField(event.target);
    }
  });

  form.addEventListener("submit", (event) => {
    const inputs = form.querySelectorAll(
      "input[type='text'], input[type='email'], input[type='password']"
    );
    inputs.forEach((input) => validateField(input));
    if (form.querySelector(".border-red-600")) {
      event.preventDefault();
    }
  });

  // Example validation function
  function validateInput(input) {
    const id = input.id;
    switch (id) {
      case "fullname":
        return /^[a-zA-Z]+ [a-zA-Z]+$/.test(input.value.trim());
      case "email":
        return /^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(input.value.trim());
      case "password":
        // Special handling for password, so it won't reach here
        return true;
      default:
        return false;
    }
  }
});

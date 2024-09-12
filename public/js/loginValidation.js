document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  // Track validation states
  let isEmailValid = false;
  let isPasswordValid = false;

  const showMessage = (input, message, type) => {
    // First remove both error and success messages to ensure only one shows
    removeMessage(input, "error");
    removeMessage(input, "success");

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
    input.setAttribute(
      "aria-describedby",
      type === "error" ? "outlined_error_help" : "outlined_success_help"
    );
    const container = input.closest(".input-container");
    if (container) {
      container.appendChild(p);
    }

    // Add or remove the error/success outline class
    input.classList.remove("border-red-600", "border-green-600");
    if (type === "error") {
      input.classList.add("border-red-600");
    } else {
      input.classList.add("border-green-600");
    }
  };

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

  const validateEmail = (input) => {
    const value = input.value.trim();
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!emailPattern.test(value)) {
      showMessage(input, "Please enter a valid email address.", "error");
      isEmailValid = false;
    } else {
      showMessage(input, "Email is valid.", "success");
      isEmailValid = true;
    }
  };

  const validatePassword = (input) => {
    const value = input.value.trim();
    let message = "";
    let isValid = true;

    // Handle empty password case
    if (value.length === 0) {
      showMessage(input, "Password is required.", "error");
      isPasswordValid = false;
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
      isPasswordValid = true;
    } else {
      showMessage(input, message, "error");
      isPasswordValid = false;
    }
  };

  form.addEventListener("input", (event) => {
    if (event.target.matches("input[type='email']")) {
      validateEmail(event.target);
    }
    if (event.target.matches("input[type='password']")) {
      validatePassword(event.target);
    }
  });

  form.addEventListener("submit", (event) => {
    const emailInput = form.querySelector("input[type='email']");
    const passwordInput = form.querySelector("input[type='password']");

    // Validate fields before submitting
    validateEmail(emailInput);
    validatePassword(passwordInput);

    // Prevent form submission if any field is invalid
    if (!isEmailValid || !isPasswordValid) {
      event.preventDefault();
    }
  });
});

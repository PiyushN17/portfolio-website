document.addEventListener("DOMContentLoaded", function () {
  emailjs.init("YxgJ-vqlDwKCrBFbE");

  const form = document.getElementById("contact-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_hx80yg9",
        "template_w5vfbsf",
        this
      )
      .then(
        function () {
          alert("Message sent successfully!");
          form.reset();
        },
        function (error) {
          console.error("FAILED...", error);
          alert("Failed to send message");
        }
      );
  });
});

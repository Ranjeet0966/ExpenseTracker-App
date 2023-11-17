/*const form = document.getElementById("form");
const submitbtn = document.getElementById("submit");
const email = document.getElementById("email");

form.addEventListener("submit", async function (e) {
  if (!form.checkValidity()) {
    e.preventDefault();
  } else {
    e.preventDefault();

    let obj = {
      email: email.value,
    };

    try {
      const res = await axios.post(
        "http://localhost:4000/password/forgotpassword",
        obj
      );
    } catch (error) {
      if (error.response.status === 404 || error.response.status === 401) {
        document.body.innerHTML += `<div style='color:red;'>${error.response.data.message}</div>`;
      } else {
        document.body.innerHTML += `<div style='color:red;'>${error}</div>`;
      }
    }

    email.value = "";
  }
  form.classList.add("was-validated");
});*/



const form = document.getElementById("form");
const email = document.getElementById("email");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  let obj = {
    email: email.value,
  };

  try {
    const res = await axios.post(
      "http://localhost:4000/password/forgotpassword",
      obj
    );

    // Handle success if needed
    console.log("Password reset email sent successfully");
  } catch (error) {
    if (error.response && (error.response.status === 404 || error.response.status === 401)) {
      document.body.innerHTML += `<div style='color:red;'>${error.response.data.message}</div>`;
    } else {
      document.body.innerHTML += `<div style='color:red;'>An error occurred</div>`;
    }
  }

  // Reset the form and remove validation classes
  form.reset();
  form.classList.remove("was-validated");
});

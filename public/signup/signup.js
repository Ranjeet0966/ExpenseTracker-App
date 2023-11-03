const form = document.getElementById("form");
const submitbtn = document.getElementById("submit");
const name1 = document.getElementById("name");
const email = document.getElementById("email");
const number = document.getElementById("number");
const password = document.getElementById("password");

form.addEventListener("submit", async function (e) {
  if (!form.checkValidity()) {
    e.preventDefault();
  } else {
    e.preventDefault();

    let signUpDetails = {
      name: name1.value,
      email: email.value,
      number: number.value,
      password: password.value,
    };

    try {
      const res = await axios.post(
        "http://localhost:4000/user/sign-up",
        signUpDetails
      );

      if (res.status === 201) {
        window.location.href = "../login/login.html";
      } else {
        throw new Error("Failed to Login");
      }
    } catch (error) {
      if (error.response.status === 409) {
        document.body.innerHTML += `<div style='color:red;'>${error.response.data.message}</div>`;
      } else {
        document.body.innerHTML += `<div style='color:red;'>${error}</div>`;
      }
    }

    name1.value = "";
    email.value = "";
    number.value = "";
    password.value = "";
  }
  form.classList.add("was-validated");
});
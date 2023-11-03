const form = document.getElementById("form");
const submitbtn = document.getElementById("submit");
const email = document.getElementById("email");
const password = document.getElementById("password");

form.addEventListener("submit", async function (e) {
  if (!form.checkValidity()) {
    e.preventDefault();
  } else {
    e.preventDefault();

    let logInDetails = {
      email: email.value,
      password: password.value,
    };

    try {
      const res = await axios.post(
        "http://localhost:4000/user/login",
        logInDetails
      );
      if (res.status === 202) {
        localStorage.setItem("token", res.data.token);
        window.location.href = "../expense/expenses.html";
      }
    } catch (error) {
      if (error.response.status === 404 || error.response.status === 401) {
        document.body.innerHTML += `<div style='color:red;'>${error.response.data.message}</div>`;
      } else {
        document.body.innerHTML += `<div style='color:red;'>${error}</div>`;
      }
    }

    email.value = "";
    password.value = "";
  }
  form.classList.add("was-validated");
});
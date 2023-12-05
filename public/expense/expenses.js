const form = document.getElementById("addForm");
const itemList = document.getElementById("items");
// Get input values
const category = document.getElementById("category");
const amount = document.getElementById("amount");
const description = document.getElementById("description");

const pagination = document.getElementById("pagination");
const rowsPerPage = document.getElementById("rowsperpage");
const btnrows = document.getElementById("btnrows");

const btnBuyPremium = document.getElementById("rzp-button1");
const btnDownload = document.getElementById("download");
const premium = document.getElementById("premium");
const btnLeaderBoard = document.getElementById("btn_leader_board");
const leaderBoardTitle = document.getElementById("leader_board_title");
const leaderBoardList = document.getElementById("leader_board_list");
const btnDownloadHistory = document.getElementById("btn_download_history");
const DownloadHistoryTitle = document.getElementById("download_history_title");
const DownloadHistoryContainer = document.getElementById(
  "download_history_container"
);
const DownloadHistoryList = document.getElementById("download_history_list");
const logout = document.getElementById("logout");

const token = localStorage.getItem("token");

// Form submit event
form.addEventListener("submit", addItem);

// Add item
async function addItem(e) {
  e.preventDefault();

  let obj = {
    amount: amount.value,
    description: description.value,
    category: category.value,
  };

  await axios
    .post("http://localhost:4000/user/add-expense", obj, {
      headers: { Authorization: token },
    })
    .then((res) => (obj.id = res.data))
    .catch((err) => console.log(err));

  show(obj);
  amount.value = "";
  description.value = "";
}

function show(obj) {
  // Create new li element
  var li = document.createElement("li");
  // Add class
  li.className = "list-group-item";

  // Create del button element
  var deletebtn = document.createElement("button");

  // Add classes to del button
  deletebtn.className = "btn btn-danger btn-sm float-right delete";

  // Append text node
  deletebtn.appendChild(document.createTextNode("X"));

  // Add text node with input value
  li.textContent =
    obj.amount +
    " " +
    "-" +
    " " +
    obj.description +
    " " +
    "-" +
    " " +
    obj.category;

  deletebtn.onclick = async () => {
    const id = obj.id;
    itemList.removeChild(li);
    await axios
      .delete(`http://localhost:4000/user/delete-expense/${id}`, {
        headers: { Authorization: token },
      })
      .catch((err) => console.log(err));
  };

  li.appendChild(deletebtn);
  itemList.appendChild(li);
}

async function showAllExpenses() {
  const numberOfRows = localStorage.getItem("rows") || 10;
  const page = 1;
  const response = await axios.post(
    `http://localhost:4000/user/expenses?page=${page}`,
    { numberOfRows },
    { headers: { Authorization: token } }
  );
  listExpenses(response.data.Expenses);
  showpagination(response.data);
}

window.addEventListener("DOMContentLoaded", showAllExpenses);

btnBuyPremium.onclick = async function (e) {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    "http://localhost:4000/purchase/premiummembership",
    { headers: { Authorization: token } }
  );
  let options = {
    key: response.data.key_id,
    order_id: response.data.order.id,
    handler: async function (response) {
      await axios.post(
        "http://localhost:4000/purchase/updatetransactionstatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
          cons: console.log(response),
        },
        { headers: { Authorization: token } }
      );

      ispremium();
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("payment.failed", function (response) {
    alert("something went wrong");
  });
};

const ispremium = async (e) => {
  const response = await axios.get(
    "http://localhost:4000/user/is-premium-user",
    {
      headers: { Authorization: token },
    }
  );
  const premiumuser = response.data;
  localStorage.setItem("pro", premiumuser);
  if (response.data) {
    btnBuyPremium.remove();
    const premiumUser = document.createElement("h3");
    premiumUser.className = "float-right";
    premiumUser.textContent = "Premium Member";
    premium.appendChild(premiumUser);
  }
};
ispremium();

btnLeaderBoard.onclick = async () => {
  leaderBoardTitle.textContent = "Leader Board";
  const response = await axios.get(
    "http://localhost:4000/premium/showleaderboard",
    { headers: { Authorization: token } }
  );
  const data = response.data;
  leaderBoardList.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    showLeaderBoard(data[i]);
  }
};

function showLeaderBoard(obj) {
  const li = document.createElement("li");
  li.className = "list-group-item";
  li.textContent =
    "Name" +
    " - " +
    obj.name +
    " " +
    " " +
    "Total Expenses" +
    " - " +
    obj.totalExpenses;
  leaderBoardList.appendChild(li);
}

if (localStorage.getItem("pro") !== null) {
  download.disabled = true;
  btnDownloadHistory.disabled = true;
  DownloadHistoryContainer.style.display = "none";
}

btnDownload.onclick = async () => {
  try {
    if (localStorage.getItem("pro")) {
      const response = await axios.get(
        "http://localhost:4000/premium/download",
        {
          headers: { Authorization: token },
        }
      );
      if (response.status === 200) {
        let a = document.createElement("a");
        a.href = response.data.fileURL;
        a.download = "myexpense.csv";
        a.click();
      } else {
        throw new Error(response.data.message);
        
      }
    }
  } catch (error) {
    showError(error);
    console.log(error);
  }
};

function showError(err) {
  document.body.innerHTML += `<div style='color:red;'>${err}</div>`;
}

btnDownloadHistory.onclick = async () => {
  const response = await axios.get(
    "http://localhost:4000/premium/alldownloadhistory",
    { headers: { Authorization: token } }
  );
  DownloadHistoryList.innerHTML = "";
  const arr = response.data.downloadHistory;
  for (let i = 0; i < arr.length; i++) {
    showAllDownloads(arr[i]);
  }
};

function showAllDownloads(obj) {
  const tr = document.createElement("tr");
  const urlTh = document.createElement("th");
  const a = document.createElement("a");
  a.href = obj.url;
  a.textContent = "Download";
  urlTh.appendChild(a);
  const dateTh = document.createElement("th");
  dateTh.textContent = obj.createdAt;
  tr.appendChild(urlTh);
  tr.appendChild(dateTh);
  DownloadHistoryList.appendChild(tr);
}

function showpagination({
  currentPage,
  hasNextPage,
  hasPreviousPage,
  nextPage,
  previousPage,
  lastPage,
  
}) {
  pagination.innerHTML = "";
  if (hasPreviousPage) {
    const btn2 = document.createElement("button");
    btn2.innerHTML = previousPage;
    btn2.addEventListener("click", () => showExpenses(previousPage));
    pagination.appendChild(btn2);
  }
  const btn1 = document.createElement("button");
  btn1.innerHTML = `<h3>${currentPage}</h3>`;
  btn1.addEventListener("click", () => showExpenses(currentPage));
  pagination.appendChild(btn1);

  if (hasNextPage) {
    const btn3 = document.createElement("button");
    btn3.innerHTML = nextPage;
    btn3.addEventListener("click", () => showExpenses(nextPage));
    pagination.appendChild(btn3);
  }
  if (lastPage > 2 && lastPage > nextPage) {
    const btn4 = document.createElement("button");
    btn4.innerHTML = lastPage;
    btn4.addEventListener("click", () => showExpenses(lastPage));
    pagination.appendChild(btn4);
  }
}

async function showExpenses(page) {
  try {
    const numberOfRows = localStorage.getItem("rows") || 10;
    const response = await axios.post(
      `http://localhost:4000/user/expenses?page=${page}`,
      { numberOfRows },
      { headers: { Authorization: token } }
    );
    listExpenses(response.data.Expenses);
    showpagination(response.data);
  } catch (error) {
    showError(error);
  }
}

function listExpenses(expenses) {
  itemList.innerHTML = "";
  for (let i = 0; i < expenses.length; i++) {
    show(expenses[i]);
  }
}

btnrows.onclick = async () => {
  const rows = rowsPerPage.value;
  rowsPerPage.value = "";
  if (rows > 0) {
    const page = 1;
    localStorage.setItem("rows", rows);
    const numberOfRows = localStorage.getItem("rows");
    const response = await axios.post(
      `http://localhost:4000/user/expenses?page=${page}`,
      { numberOfRows },
      { headers: { Authorization: token } }
    );
    listExpenses(response.data.Expenses);
    showpagination(response.data);
  }
};
logout.onclick = () => {
  localStorage.clear();
  window.location.href = "../login/login.html";
};
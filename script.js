const input = document.getElementById("searchInput");
const form = document.getElementById("searchForm");
const clearBtn = document.getElementById("clearBtn");
const themeBtn = document.getElementById("themeBtn");
const recentBox = document.getElementById("recentBox");
const recentList = document.getElementById("recentList");
const toast = document.getElementById("toast");

let searchType = "web";

function search(type = "web") {
  const query = input.value.trim();
  if (!query) {
    showToast("Type something to search.");
    input.focus();
    return;
  }

  saveRecent(query);

  let url;
  const encoded = encodeURIComponent(query);

  if (type === "images") {
    url = "https://www.google.com/search?tbm=isch&q=" + encoded;
  } else if (type === "news") {
    url = "https://www.google.com/search?tbm=nws&q=" + encoded;
  } else {
    url = "https://www.google.com/search?q=" + encoded;
  }

  window.location.href = url;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  search(searchType);
});

document.querySelectorAll(".quick button").forEach(btn => {
  btn.addEventListener("click", () => {
    searchType = btn.dataset.type;
    search(searchType);
  });
});

clearBtn.addEventListener("click", () => {
  input.value = "";
  input.focus();
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  localStorage.setItem("fnp-theme", dark ? "dark" : "light");
  themeBtn.textContent = dark ? "☀" : "☾";
});

if (localStorage.getItem("fnp-theme") === "dark") {
  document.body.classList.add("dark");
  themeBtn.textContent = "☀";
}

function saveRecent(query) {
  let items = JSON.parse(localStorage.getItem("fnp-recent") || "[]");
  items = [query, ...items.filter(x => x.toLowerCase() !== query.toLowerCase())].slice(0, 5);
  localStorage.setItem("fnp-recent", JSON.stringify(items));
  renderRecent();
}

function renderRecent() {
  const items = JSON.parse(localStorage.getItem("fnp-recent") || "[]");
  if (!items.length) {
    recentBox.classList.add("hidden");
    return;
  }

  recentBox.classList.remove("hidden");
  recentList.innerHTML = items.map(q =>
    `<div class="recent-item" data-query="${escapeHtml(q)}">🔎 ${escapeHtml(q)}</div>`
  ).join("");

  document.querySelectorAll(".recent-item").forEach(item => {
    item.addEventListener("click", () => {
      input.value = item.dataset.query;
      search("web");
    });
  });
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[c]));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

document.getElementById("aboutLink").addEventListener("click", e => {
  e.preventDefault();
  showToast("FNP Search — a simple search homepage.");
});

document.getElementById("privacyLink").addEventListener("click", e => {
  e.preventDefault();
  showToast("Search history is stored only in this browser.");
});

renderRecent();

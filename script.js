// Change these to your own details.
const profile = {
  name: "Your Name",
  role: "Full-stack developer",
  email: "you@example.com",
  available: true
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Theme: use the saved choice, otherwise follow the system setting
const themeBtn = $(".theme-btn");

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeBtn.textContent = theme === "dark" ? "Light mode" : "Dark mode";
}

let savedTheme = null;
try { savedTheme = localStorage.getItem("theme"); } catch (e) {}
setTheme(savedTheme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

themeBtn.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// Mobile menu
const menuBtn = $(".menu-btn");
const nav = $("#nav");

function setMenu(open) {
  nav.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
}

menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
$$("#nav a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

// Highlight the section being read
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const link = $(`#nav a[href="#${entry.target.id}"]`);
    if (link) link.classList.toggle("active", entry.isIntersecting);
  });
}, { rootMargin: "-40% 0px -55% 0px" });
$$("main section[id]").forEach((section) => observer.observe(section));

// Simulated request through the stack
const runBtn = $(".run-btn");
const output = $(".response");
const layers = $$(".layer");
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

runBtn.addEventListener("click", async () => {
  runBtn.disabled = true;
  output.textContent = "Sending request...";

  // Down to the database, then back up to the browser
  for (const index of [0, 1, 2, 1, 0]) {
    layers.forEach((layer, i) => layer.classList.toggle("active", i === index));
    await wait(450);
  }

  layers.forEach((layer) => layer.classList.remove("active"));
  const { name, role, available } = profile;
  output.textContent = "200 OK\n" + JSON.stringify({ name, role, available }, null, 2);
  runBtn.disabled = false;
});

// Project filters
const filterButtons = $$(".filters button");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    $$(".project").forEach((project) => {
      project.hidden = filter !== "all" && project.dataset.type !== filter;
    });
  });
});

// Placeholder links stay put until you add real URLs
$$("[data-placeholder]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (link.getAttribute("href") === "#") event.preventDefault();
  });
});

// Contact form: validates, then opens the visitor's email app
const form = $("#contact-form");
const formStatus = $(".form-status");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = [...form.querySelectorAll("input, textarea")];

  fields.forEach((field) => {
    const invalid = !field.value.trim() || !field.checkValidity();
    field.setAttribute("aria-invalid", String(invalid));
  });

  const firstInvalid = fields.find((f) => f.getAttribute("aria-invalid") === "true");
  if (firstInvalid) {
    formStatus.textContent = "Fill in every field with a valid email address.";
    firstInvalid.focus();
    return;
  }

  const data = new FormData(form);
  const subject = encodeURIComponent(`Portfolio message from ${data.get("name")}`);
  const body = encodeURIComponent(`${data.get("message")}\n\nReply to: ${data.get("email")}`);
  window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  formStatus.textContent = "Opening your email app. Press send there to deliver the message.";
});

$("#year").textContent = new Date().getFullYear();

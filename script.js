let form = document.getElementById("contact-form");
let container = document.getElementById('contribution-graph');
let gitProjects = document.getElementById('gitProjects');

let containArr = [];

document.addEventListener("DOMContentLoaded", function () {
  emailjs.init("YxgJ-vqlDwKCrBFbE");
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


window.addEventListener('load', () => {
  renderGraph();
  renderProjects();
  
})


async function renderGraph() {
  let API = 'https://github-contributions-api.jogruber.de/v4/PiyushN17?y=last';

  const res = await fetch(API);
  const data = await res.json();

  data.contributions.forEach(day => {
    const div = document.createElement('div');
    div.className = `day level-${day.level}`;
    div.title = `${day.date}: ${day.count} contributions`;
    container.appendChild(div);
  });
}

async function renderProjects() {
  let repo1 = 'https://api.github.com/repos/PiyushN17/quiz-trivia';
  let repo2 = 'https://api.github.com/repos/PiyushN17/eduscript';
  let repo3 = 'https://api.github.com/repos/PiyushN17/news-search';
  let repo4 = 'https://api.github.com/repos/PiyushN17/check-weather';
  let repo5 = 'https://api.github.com/repos/PiyushN17/live-flight-tracker';
  let repo6 = 'https://api.github.com/repos/PiyushN17/movie-lookup';
  let repo7 = 'https://api.github.com/repos/PiyushN17/word-dictionary';
  let out = await Promise.all([fetch(repo1), fetch(repo2), fetch(repo3), fetch(repo4), fetch(repo5), fetch(repo6), fetch(repo7)]);
  for(let item of out) {
    let resp = await item.json();
    containArr.push(resp);
  }
  console.log(containArr);
  containArr.forEach(repo => {
    let div = document.createElement("div");
    div.className = "repo-card";

    div.innerHTML = `
      <h3>
        <a href="${repo.html_url}" target="_blank">
          ${repo.name}
        </a>
      </h3>
      <a href="${repo.homepage}" target="_blank" class="live-button">
        Live
      </a>
      <p>${repo.description || "No description"}</p>
      <small>⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}</small>
    `;

    gitProjects.appendChild(div);
  });
}

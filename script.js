const GITHUB_USERNAME = "LorenzoBerto-Eduzz";
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?type=owner&sort=updated&per_page=100`;
const EXTRA_PROJECTS = [
  // Example:
  // {
  //   name: "My External Project",
  //   description: "Project hosted outside GitHub",
  //   url: "https://my-project.example.com",
  //   image: "https://my-project.example.com/preview.jpg"
  // }
];

const ownerNameEl = document.getElementById("owner-name");
const statusEl = document.getElementById("status");
const gridEl = document.getElementById("projects-grid");
const cardTemplate = document.getElementById("project-card-template");

ownerNameEl.textContent = GITHUB_USERNAME;

function formatDescription(repo) {
  if (repo.description && repo.description.trim()) {
    return repo.description;
  }

  if (repo.language) {
    return `Main language: ${repo.language}`;
  }

  return "Public repository";
}

function buildPreviewImageUrl(repo) {
  const cacheKey = encodeURIComponent(repo.pushed_at || repo.updated_at || "latest");
  return `https://opengraph.githubassets.com/${cacheKey}/${GITHUB_USERNAME}/${repo.name}`;
}

function createProjectCard(repo) {
  const node = cardTemplate.content.firstElementChild.cloneNode(true);
  const imgEl = node.querySelector(".project-image");
  const nameEl = node.querySelector(".project-name");
  const descEl = node.querySelector(".project-desc");

  node.href = repo.html_url;
  node.title = `Open ${repo.name}`;

  nameEl.textContent = repo.name;
  descEl.textContent = formatDescription(repo);

  imgEl.loading = "lazy";
  imgEl.alt = `${repo.name} preview`;
  imgEl.src = buildPreviewImageUrl(repo);
  imgEl.onerror = () => {
    imgEl.style.display = "none";
  };

  return node;
}

function createExtraCard(project) {
  const node = cardTemplate.content.firstElementChild.cloneNode(true);
  const imgEl = node.querySelector(".project-image");
  const nameEl = node.querySelector(".project-name");
  const descEl = node.querySelector(".project-desc");

  node.href = project.url;
  node.title = `Open ${project.name}`;

  nameEl.textContent = project.name;
  descEl.textContent = project.description || "External project";

  imgEl.loading = "lazy";
  imgEl.alt = `${project.name} preview`;
  imgEl.src = project.image || "";
  imgEl.onerror = () => {
    imgEl.style.display = "none";
  };

  if (!project.image) {
    imgEl.style.display = "none";
  }

  return node;
}

async function loadRepos() {
  statusEl.textContent = "Loading projects...";

  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: {
        Accept: "application/vnd.github+json"
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error (${response.status})`);
    }

    const repos = await response.json();
    const visibleRepos = repos
      .filter((repo) => !repo.fork && !repo.archived)
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

    if (visibleRepos.length === 0 && EXTRA_PROJECTS.length === 0) {
      statusEl.textContent = "No public repositories found yet.";
      return;
    }

    const fragment = document.createDocumentFragment();
    visibleRepos.forEach((repo) => fragment.appendChild(createProjectCard(repo)));
    EXTRA_PROJECTS.forEach((project) => fragment.appendChild(createExtraCard(project)));
    gridEl.appendChild(fragment);

    statusEl.textContent = `${visibleRepos.length + EXTRA_PROJECTS.length} project(s) found`;
  } catch (error) {
    statusEl.textContent = "Could not load projects right now.";
    const hint = document.createElement("p");
    hint.className = "status";
    hint.textContent = "Check if your username is correct in script.js and if repos are public.";
    gridEl.appendChild(hint);
    console.error(error);
  }
}

loadRepos();

const GITHUB_USERNAME = "LorenzoBerto-Eduzz";
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?type=owner&sort=updated&per_page=100`;
const EXCLUDED_REPOS = new Set([`${GITHUB_USERNAME}.github.io`.toLowerCase()]);

const gridEl = document.getElementById("projects-grid");
const cardTemplate = document.getElementById("project-card-template");

function formatProjectName(name) {
  return String(name || "").replace(/-/g, " ").trim();
}

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

function buildRepoImageUrl(repo) {
  const defaultBranch = repo.default_branch || "main";
  return `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repo.name}/${defaultBranch}/image.png`;
}

function setCardImage(imgEl, primaryImageUrl, fallbackImageUrl) {
  imgEl.loading = "lazy";
  imgEl.src = primaryImageUrl;

  imgEl.onerror = () => {
    if (fallbackImageUrl && imgEl.dataset.fallbackApplied !== "true") {
      imgEl.dataset.fallbackApplied = "true";
      imgEl.src = fallbackImageUrl;
      return;
    }
    imgEl.style.display = "none";
  };
}

function createProjectCard(repo) {
  const node = cardTemplate.content.firstElementChild.cloneNode(true);
  const imgEl = node.querySelector(".project-image");
  const nameEl = node.querySelector(".project-name");
  const descEl = node.querySelector(".project-desc");

  node.href = repo.html_url;
  node.title = `Open ${repo.name}`;

  nameEl.textContent = formatProjectName(repo.name);
  descEl.textContent = formatDescription(repo);

  imgEl.alt = `${repo.name} preview`;
  setCardImage(imgEl, buildRepoImageUrl(repo), buildPreviewImageUrl(repo));

  return node;
}

async function loadRepos() {
  let visibleRepos = [];

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
    if (!Array.isArray(repos)) {
      throw new Error("Unexpected GitHub API payload.");
    }

    visibleRepos = repos
      .filter((repo) => !repo.fork && !repo.archived)
      .filter((repo) => !EXCLUDED_REPOS.has(repo.name.toLowerCase()))
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
  } catch (error) {
    console.error(error);
  }

  const fragment = document.createDocumentFragment();
  visibleRepos.forEach((repo) => {
    fragment.appendChild(createProjectCard(repo));
  });

  if (!fragment.childElementCount) {
    return;
  }

  gridEl.appendChild(fragment);
}

loadRepos();

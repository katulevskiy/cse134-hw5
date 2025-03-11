document.addEventListener("DOMContentLoaded", () => {
  // Container for project cards
  const projectsContainer = document.getElementById("projects-container");
  const loadingIndicator = document.getElementById("loading-indicator");

  // First, load from localStorage if available
  const localProjects = loadProjectsFromLocalStorage();

  // Then fetch remote projects
  fetchRemoteProjects()
    .then((remoteProjects) => {
      // Remove loading indicator
      if (loadingIndicator) {
        loadingIndicator.remove();
      }

      // Clear existing project cards
      const existingCards = document.querySelectorAll("project-card");
      existingCards.forEach((card) => card.remove());

      // Combine local and remote projects, avoiding duplicates
      const allProjects = [...localProjects];

      // Add remote projects that aren't already in local storage
      remoteProjects.forEach((remote) => {
        if (!localProjects.some((local) => local.id === remote.id)) {
          allProjects.push(remote);
        }
      });

      // Create and append project cards
      renderProjects(allProjects, projectsContainer);
    })
    .catch((error) => {
      console.error("Error fetching remote projects:", error);

      // Show error message
      if (loadingIndicator) {
        loadingIndicator.textContent =
          "Could not load all projects. Showing locally stored projects.";
        loadingIndicator.style.color = "var(--accent-color)";
      }

      // If remote fetch fails, still render local projects
      renderProjects(localProjects, projectsContainer);
    });
});

function loadProjectsFromLocalStorage() {
  try {
    const projects =
      JSON.parse(localStorage.getItem("portfolio-projects")) || [];
    return projects;
  } catch (e) {
    console.error("Error loading projects from localStorage:", e);
    return [];
  }
}

function fetchRemoteProjects() {
  // Fetch projects from the JSON file
  return fetch("projects.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching projects.json:", error);
      // Fallback to empty array if fetch fails
      return [];
    });
}

function renderProjects(projects, container) {
  // If container doesn't exist, exit early
  if (!container) return;

  // Clear the container first
  const existingCards = container.querySelectorAll("project-card");
  existingCards.forEach((card) => card.remove());

  // Add project cards with a slight delay between each for a staggered animation effect
  projects.forEach((project, index) => {
    setTimeout(() => {
      const card = document.createElement("project-card");

      // Set all attributes explicitly
      card.setAttribute("title", project.title || "Untitled Project");
      card.setAttribute(
        "description",
        project.description || "No description available.",
      );
      card.setAttribute("image", project.image || "assets/proj1-800.webp");
      card.setAttribute("alt", project.alt || `${project.title} project image`);
      card.setAttribute(
        "github",
        project.github || "https://github.com/katulevskiy",
      );
      card.setAttribute("tags", project.tags || "");

      // Add margin-bottom for spacing between cards
      card.style.marginBottom = "2rem";

      container.appendChild(card);

      // Force browser to recalculate styles
      void card.offsetWidth;
    }, index * 150); // 150ms delay between each card for a nice staggered effect
  });

  // If no projects, show a message
  if (projects.length === 0) {
    const noProjectsMsg = document.createElement("p");
    noProjectsMsg.textContent = "No projects found.";
    noProjectsMsg.style.textAlign = "center";
    noProjectsMsg.style.padding = "2rem";
    container.appendChild(noProjectsMsg);
  }
}

// Example function to save a project to localStorage (for adding new projects)
function saveProjectToLocalStorage(project) {
  try {
    const projects = loadProjectsFromLocalStorage();

    // Check if project with this ID already exists
    const existingIndex = projects.findIndex((p) => p.id === project.id);

    if (existingIndex >= 0) {
      // Update existing project
      projects[existingIndex] = project;
    } else {
      // Add new project
      projects.push(project);
    }

    localStorage.setItem("portfolio-projects", JSON.stringify(projects));
    return true;
  } catch (e) {
    console.error("Error saving project to localStorage:", e);
    return false;
  }
}

// Function to add a sample project to localStorage (for testing)
function addSampleProject() {
  const sampleProject = {
    id: "sample-" + Date.now(),
    title: "Sample Local Project",
    description:
      "This is a sample project stored in localStorage. You can add more projects like this programmatically.",
    image: "assets/proj4-800.webp",
    alt: "Sample Project Image",
    github: "https://github.com/katulevskiy/sample-project",
    tags: "Sample, LocalStorage, Demo",
  };

  saveProjectToLocalStorage(sampleProject);

  // Reload the page to show the new project
  window.location.reload();
}

// Add a debug function to the window object for testing
window.portfolioTools = {
  addSampleProject,
  clearLocalStorage: () => {
    localStorage.removeItem("portfolio-projects");
    window.location.reload();
  },
};

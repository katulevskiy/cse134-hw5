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
  // For testing purposes, this function now returns a Promise with sample data
  // Change this to use fetch() when you have a real projects.json file
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "proj1",
          title: "Innovative Web App",
          description:
            "This project demonstrates advanced React techniques with server-side rendering for optimal performance. Features include real-time data visualization, responsive UI components, and accessibility compliance.",
          image: "assets/proj1-800.webp",
          alt: "A screenshot of the Innovative Web App interface showing data visualization components",
          github: "https://github.com/katulevskiy/project-one",
          tags: "React, Node.js, TypeScript, Accessibility",
        },
        {
          id: "proj2",
          title: "Creative Design System",
          description:
            "A comprehensive design system built to ensure consistency across multiple applications. Includes a component library, design tokens, and documentation for developers and designers to maintain a cohesive user experience.",
          image: "assets/proj2-800.webp",
          alt: "Components from the Creative Design System displayed in a grid layout",
          github: "https://github.com/katulevskiy/project-two",
          tags: "UI/UX, CSS, Storybook, Design Systems",
        },
        {
          id: "proj3",
          title: "Dynamic Data Solution",
          description:
            "This application processes large datasets in real-time, providing actionable insights through an intuitive dashboard. Built with performance in mind, it handles millions of data points while maintaining responsive interactions.",
          image: "assets/proj3-800.webp",
          alt: "Dashboard interface showing real-time data processing visualizations",
          github: "https://github.com/katulevskiy/project-three",
          tags: "Data Visualization, API Integration, Real-time Processing",
        },
        {
          id: "proj4",
          title: "Cutting-edge Tech Exploration",
          description:
            "An experimental project exploring emerging web technologies including WebGL, 3D rendering, and immersive user experiences. This forward-thinking application pushes the boundaries of what's possible in browser-based applications.",
          image: "assets/proj4-800.webp",
          alt: "3D visualization created with WebGL showing interactive elements",
          github: "https://github.com/katulevskiy/project-four",
          tags: "WebGL, 3D, ThreeJS, Performance Optimization",
        },
      ]);
    }, 500); // Simulate network delay
  });

  // Uncomment this for real implementation:
  // return fetch('projects.json')
  //   .then(response => {
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     return response.json();
  //   });
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

class ProjectCard extends HTMLElement {
  constructor() {
    super();

    // Create a shadow DOM for the component
    this.attachShadow({ mode: "open" });

    // Get attributes or use defaults
    const title = this.getAttribute("title") || "Project Title";
    const description =
      this.getAttribute("description") || "Project description goes here.";
    const imageUrl = this.getAttribute("image") || "assets/proj1-800.webp";
    const imageAlt = this.getAttribute("alt") || "Project Image";
    const githubUrl =
      this.getAttribute("github") || "https://github.com/katulevskiy";
    const tags = this.getAttribute("tags") || "";

    // Create the internal HTML structure
    this.shadowRoot.innerHTML = `
      <style>
        /* Import font to match the rest of the site */
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
        
        /* Inherit variables from parent document */
        :host {
          --primary-color: var(--primary-color, #3c78d8);
          --accent-color: var(--accent-color, #c05050);
          --bg-color: var(--bg-color, #f2f2f2);
          --text-color: var(--text-color, #333);
          --card-bg: var(--card-bg, #fff);
          --card-border: var(--card-border, #ddd);
          
          display: block;
          margin: 0 0 3rem 0; /* Added extra bottom margin */
          font-family: 'Montserrat', Arial, sans-serif;
          animation: slideIn 0.8s ease-out;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(20%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .card {
          display: flex;
          flex-wrap: nowrap; /* Changed to nowrap for better alignment */
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 8px;
          overflow: hidden;
          border-left: 5px solid transparent;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-left-color 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
          border-left-color: var(--accent-color);
        }
        
        .card-content {
          flex: 1 1 50%;
          max-width: 50%; /* Ensures content takes up to 50% of width */
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }
        
        .card-image {
          flex: 1 1 50%;
          max-width: 50%; /* Ensures image takes up to 50% of width */
          padding: 0; /* Removed padding to allow image to extend to edge */
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden; /* Ensures image doesn't overflow */
        }
        
        h2 {
          margin-top: 0;
          margin-bottom: 1rem;
          font-size: 1.5rem;
          color: var(--text-color);
        }
        
        p {
          margin-bottom: 1.5rem;
          line-height: 1.6;
          color: var(--text-color);
          flex-grow: 1;
        }
        
        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        
        .tag {
          background: rgba(60, 120, 216, 0.2);
          color: var(--primary-color);
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
          /* Ensure tags are readable in both light and dark modes */
          border: 1px solid rgba(60, 120, 216, 0.3);
        }
        
        /* Add specific styles for dark mode tags */
        :host([data-theme="dark"]) .tag {
          background: rgba(255, 183, 77, 0.2);
          color: var(--accent-color);
          border-color: rgba(255, 183, 77, 0.4);
        }
        
        .github-link {
          display: inline-block;
          background: var(--primary-color);
          color: white !important; /* Force white text for better contrast */
          padding: 0.75rem 1.25rem;
          text-decoration: none;
          border-radius: 4px;
          transition: background 0.3s ease;
          font-weight: bold;
          align-self: flex-start;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .github-link:hover {
          background: var(--accent-color);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        
        picture {
          display: block;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
          display: block; /* Remove any extra spacing */
        }
        
        .card:hover img {
          transform: scale(1.05);
        }
        
        picture {
          width: 100%;
          height: 100%;
          display: block;
        }
        
        source {
          width: 100%;
          height: 100%;
        }
        
        @media (max-width: 768px) {
          .card {
            flex-direction: column;
            flex-wrap: wrap;
          }
          
          .card-content, 
          .card-image {
            flex: 1 1 100%;
            max-width: 100%;
          }
          
          .card-image {
            order: -1; /* Image on top for mobile */
            height: 220px; /* Fixed height for mobile */
          }
        }
      </style>
      
      <div class="card">
        <div class="card-content">
          <h2>${title}</h2>
          <p>${description}</p>
          <div class="tags">
            ${tags
              .split(",")
              .map((tag) => `<span class="tag">${tag.trim()}</span>`)
              .join("")}
          </div>
          <a href="${githubUrl}" class="github-link" target="_blank">View on GitHub</a>
        </div>
        <div class="card-image">
          <picture>
            <source srcset="${imageUrl}" type="image/webp">
            <img src="${imageUrl.replace(".webp", ".jpg")}" alt="${imageAlt}">
          </picture>
        </div>
      </div>
    `;
  }

  // Lifecycle method - when element is added to DOM
  connectedCallback() {
    // When the element is attached, register an observer to watch for theme changes
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          this.updateThemeVariables();
        }
      });
    });

    // Start observing the document element for class attribute changes
    this.observer.observe(document.documentElement, { attributes: true });

    // Initial theme variables setup
    this.updateThemeVariables();
  }

  // Disconnect observer when element is removed
  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  // Update CSS variables based on current theme
  updateThemeVariables() {
    const isDarkMode = document.documentElement.classList.contains("dark");

    if (isDarkMode) {
      this.style.setProperty("--primary-color", "#1e1e1e");
      this.style.setProperty("--accent-color", "#ffb74d");
      this.style.setProperty("--bg-color", "#222");
      this.style.setProperty("--text-color", "#f1f1f1");
      this.style.setProperty("--card-bg", "#333");
      this.style.setProperty("--card-border", "#444");
      this.setAttribute("data-theme", "dark");
    } else {
      this.style.setProperty("--primary-color", "#3c78d8");
      this.style.setProperty("--accent-color", "#c05050");
      this.style.setProperty("--bg-color", "#f2f2f2");
      this.style.setProperty("--text-color", "#333");
      this.style.setProperty("--card-bg", "#fff");
      this.style.setProperty("--card-border", "#ddd");
      this.setAttribute("data-theme", "light");
    }
  }

  // Custom getter/setter for attributes to ensure updates when they change
  static get observedAttributes() {
    return ["title", "description", "image", "alt", "github", "tags"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Only update if a value actually changed
    if (oldValue !== newValue) {
      // Re-render component when attributes change
      if (this.shadowRoot) {
        // Update only the relevant part based on which attribute changed
        const titleEl = this.shadowRoot.querySelector("h2");
        const descEl = this.shadowRoot.querySelector("p");
        const imgEl = this.shadowRoot.querySelector("img");
        const srcEl = this.shadowRoot.querySelector("source");
        const linkEl = this.shadowRoot.querySelector("a.github-link");
        const tagsEl = this.shadowRoot.querySelector(".tags");

        switch (name) {
          case "title":
            if (titleEl) titleEl.textContent = newValue;
            break;
          case "description":
            if (descEl) descEl.textContent = newValue;
            break;
          case "image":
            if (imgEl) imgEl.src = newValue.replace(".webp", ".jpg");
            if (srcEl) srcEl.srcset = newValue;
            break;
          case "alt":
            if (imgEl) imgEl.alt = newValue;
            break;
          case "github":
            if (linkEl) linkEl.href = newValue;
            break;
          case "tags":
            if (tagsEl) {
              tagsEl.innerHTML = newValue
                .split(",")
                .map((tag) => `<span class="tag">${tag.trim()}</span>`)
                .join("");
            }
            break;
        }
      }
    }
  }
}

// Register the custom element
customElements.define("project-card", ProjectCard);

// Select all sections with the class "fade-in"
const sections = document.querySelectorAll(".fade-in");

// Function to reveal the sections with the fade-in effect
const revealSections = () => {
  const trigger = window.innerHeight * 0.8; // Trigger when 80% of the section is visible

  sections.forEach((section) => {
    const top = section.getBoundingClientRect().top;

    // Check if the section is in the viewport
    if (top < trigger) {
      section.classList.add("visible");
    } else {
      section.classList.remove("visible"); // Optional: remove the "visible" class if the section is not in view
    }
  });
};

// Event listener for scroll and load events
window.addEventListener("scroll", revealSections);
window.addEventListener("load", revealSections);

// Call the function to reveal sections immediately on load
revealSections();

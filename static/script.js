document
  .getElementById("addressForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent form submission from reloading the page

    const query = document.getElementById("query").value.trim();
    const limit = document.getElementById("limit").value;

    // Validate that the query starts with a number
    if (!/^\d/.test(query)) {
      alert("Please enter an address that starts with a number.");
      return;
    }

    // Validate the limit is a number and within the range
    if (limit < 1 || limit > 99) {
      alert("Limit must be between 1 and 99.");
      return;
    }

    const apiUrl = `/search?q=${encodeURIComponent(query)}&limit=${limit}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      const resultsList = document.getElementById("results");
      resultsList.innerHTML = ""; // Clear old results

      if (!response.ok) {
        // Display error message from backend
        resultsList.innerHTML = `<li>Error: ${data.error}</li>`;
        return;
      }

      if (data.features && data.features.length > 0) {
        data.features.forEach((feature, index) => {
          const li = document.createElement("li");
          li.textContent = `${index + 1} - ${feature.properties.label}`;
          resultsList.appendChild(li);
        });
      } else {
        resultsList.innerHTML = "<li>No results found</li>";
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  });

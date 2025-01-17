document
  .getElementById("addressForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const query = document.getElementById("query").value.trim();
    const limit = 99; // Fetch the maximum results allowed by the API
    const apiUrl = `/search?q=${encodeURIComponent(query)}&limit=${limit}`;
    const resultsPerPage = 10; // Number of results to show per page
    let currentPage = 1;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!response.ok || !data.features || data.features.length === 0) {
        document.getElementById("results").innerHTML = "<li>No results found</li>";
        document.getElementById("paginationInfo").textContent = "";
        document.getElementById("prevPage").disabled = true;
        document.getElementById("nextPage").disabled = true;
        return;
      }

      const results = data.features;
      const totalPages = Math.ceil(results.length / resultsPerPage);

      // Function to display a specific page
      function displayPage(page) {
        const resultsList = document.getElementById("results");
        resultsList.innerHTML = ""; // Clear old results

        const start = (page - 1) * resultsPerPage;
        const end = start + resultsPerPage;
        const paginatedResults = results.slice(start, end);

        paginatedResults.forEach((feature, index) => {
          const li = document.createElement("li");
          li.textContent = `${start + index + 1} - ${feature.properties.label}`;
          resultsList.appendChild(li);
        });

        // Update pagination info
        document.getElementById("paginationInfo").textContent = `Page ${page} of ${totalPages}`;

        // Enable or disable buttons
        document.getElementById("prevPage").disabled = page === 1;
        document.getElementById("nextPage").disabled = page === totalPages;
      }

      // Event listeners for navigation buttons
      document.getElementById("prevPage").onclick = function () {
        if (currentPage > 1) {
          currentPage--;
          displayPage(currentPage);
        }
      };

      document.getElementById("nextPage").onclick = function () {
        if (currentPage < totalPages) {
          currentPage++;
          displayPage(currentPage);
        }
      };

      // Display the first page
      displayPage(currentPage);

      // Enable or disable buttons based on totalPages
      document.getElementById("prevPage").disabled = currentPage === 1;
      document.getElementById("nextPage").disabled = currentPage === totalPages || totalPages === 1;
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  });

document
  .getElementById("addressForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const query = document.getElementById("query").value.trim();
    const limit = 99; // Fetch the maximum results allowed by the API
    const apiUrl = `/search?q=${encodeURIComponent(query)}&limit=${limit}`;
    const resultsPerPage = 10; // Number of results to show per page
    let currentPage = 1;

    // Vérification: l'adresse doit commencer par un nombre
    if (!/^\d/.test(query)) {
      alert("L'adresse doit commencer par un nombre.");
      return;
    }

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!response.ok || !data.features || data.features.length === 0) {
        document.getElementById("results").innerHTML =
          "<li>No results found</li>";
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

          // Create a clickable address
          const addressLink = document.createElement("a");
          addressLink.textContent = `${start + index + 1} - ${
            feature.properties.label
          }`;
          addressLink.href = `https://www.google.com/maps?q=${encodeURIComponent(
            feature.properties.label
          )}`;
          addressLink.target = "_blank"; // Open in a new tab

          // Create an icon for Google Maps
          const mapIcon = document.createElement("img");
          mapIcon.src =
            "https://upload.wikimedia.org/wikipedia/commons/8/88/Map_marker.svg"; // Example icon
          mapIcon.alt = "Google Maps";
          mapIcon.style.cursor = "pointer";
          mapIcon.style.marginLeft = "10px";
          mapIcon.width = 20; // Set the size of the icon
          mapIcon.onclick = function () {
            window.open(
              `https://www.google.com/maps?q=${encodeURIComponent(
                feature.properties.label
              )}`,
              "_blank"
            );
          };

          // Append the clickable address and icon to the list item
          li.appendChild(addressLink);
          li.appendChild(mapIcon);
          resultsList.appendChild(li);
        });

        // Update pagination info
        document.getElementById(
          "paginationInfo"
        ).textContent = `Page ${page} of ${totalPages}`;

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
      document.getElementById("nextPage").disabled =
        currentPage === totalPages || totalPages === 1;
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  });

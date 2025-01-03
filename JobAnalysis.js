// creating a Job Class that allows creating Job listings
class Job {
	constructor(title, posted, type, level, skill, detail) {
		this.title = title; // Job title
		this.posted = posted; // When the job was posted
		this.type = type; // Job type (e.g., ongoing, one-time)
		this.level = level; // Required skill level (e.g., entry, expert)
		this.skill = skill; // Primary skill for the job
		this.detail = detail; // Job description
	}
	// getter for displaying job details
	get getDetails() {
		return `Title: ${this.title}\nType: ${this.type}\nLevel: ${this.level}\nSkill: ${this.skill}\nDescription: ${this.detail}\nPosted: ${this.posted}`;
	}
	// Getter for parsin and returning the posted Date
	get getFormattedPostedTime() {
		const now = new Date(); // Current time
		const [value, unit] = this.posted.split(" ");

		// Convert the value to a number
		const timeValue = parseInt(value, 10);
        

		// Check the unit and calculate the correct date
		if (unit.startsWith("hour")) {
			return new Date(now.getTime() - timeValue * 60 * 60 * 1000);
		} else if (unit.startsWith("day")) {
			return new Date(now.getTime() - timeValue * 24 * 60 * 60 * 1000);
		} else if (unit.startsWith("minute")) {
			return new Date(now.getTime() - timeValue * 60 * 1000);
		} else if (unit.startsWith("week")) {
			return new Date(now.getTime() - timeValue * 7 * 24 * 60 * 60 * 1000);
		}

		// Default: return the current time if the format is unrecognized
		console.warn(`Unexpected time format: ${this.posted}`);
		return now;
	}
}

// intialize an array to store Job objects
let jobArray = [];

// Listedn for file input changes
document.addEventListener("change", () => {
	const fileNode = document.getElementById("fileInput"); // Get file input element
	const file = fileNode.files[0]; // get the selected file

	// check if the file is a JSON file
	if (file.type !== "application/json") {
		alert("Please select a JSON file"); // Show error if file type is invalid
		fileNode.value = "";
		return;
	}

	// Create FileReader to read the file content
	const reader = new FileReader();

	reader.onload = (event) => {
		try {
			// parse the JSON content of the file
			const jsonData = JSON.parse(event.target.result);

			jobArray = []; // Clear the jobArray before populating

			// Populate jobArray
			jsonData.forEach((e) => {
				jobArray.push(
					new Job(e.Title, e.Posted, e.Type, e.Level, e.Skill, e.Detail)
				);
			});

			// Create arrays constistsing of non-duplicates for filtering options
			const skillArray = [...new Set(jobArray.map((job) => job.skill))];
			const typeArray = [...new Set(jobArray.map((job) => job.type))];
			const levelArray = [...new Set(jobArray.map((job) => job.level))];

			// Check if filter dropdowns already exist
			if (!document.querySelector("#selectLevel")) {
				// Create filter form dynamically
				const element = document.createElement("div");
				// HTML that will be injected when the file is being read and jobArray is filled, consists of all the dropdown menus, buttons, labels, and forms
				element.innerHTML = `
                <form style="display: flex; margin-left: 20px; align-content: space-around; width: 70vw;">
                    <label for="level" style="margin-left: 30px; margin-right: 10px;">Filter by Level:</label>
                    <select name="level" id="selectLevel">
                        <option value="all">All</option>
                        ${levelArray // using .map in order to dynamically create options for the dropdowns
													.map(
														(level) =>
															`<option value="${level}">${level}</option>`
													)
													.join("")}
                    </select>
                    <label for="type" style="margin-left: 30px; margin-right: 10px;">Filter by Type:</label>
                    <select name="type" id="selectType">
                        <option value="all">All</option>
                        ${typeArray
													.map(
														(type) => `<option value="${type}">${type}</option>`
													)
													.join("")}
                    </select>
                    <label for="skill" style="margin-left: 30px; margin-right: 10px;">Filter by Skill:</label>
                    <select name="skill" id="selectSkill">
                    <option value="all">All</option>
                    ${skillArray
											.map(
												(skill) => `<option value="${skill}">${skill}</option>`
											)
											.join("")}
                    </select>
                    <button type="button" style="margin-left: 30px;" id="filterJobs">Filter Jobs</button>
                </form>
                <form style="margin-left: 20px; margin-top: 20px; >
                    <label for="type" style="margin-left: 30px; margin-right: 10px ">Sort by:</label>
                    <select name="type" id="selectSort">
                        <option value="posted-New">Posted Time (Newest First)</option>
                        <option value="posted-Old">Posted Time (Oldest First)</option>
                        <option value="title-AZ">Title (A-Z)</option>
                        <option value="title-ZA">Title (Z-A)</option>
                    </select>
                    <button type="button" style="margin-left: 30px;" id="sortJobs">Sort Jobs</button>
                </form>
                    `;
				// appending the element to the body
				document.querySelector(".background").appendChild(element);

				// adding event listeners to listen to Filtering button
				document
					.querySelector("#filterJobs")
					.addEventListener("click", applyFilters);

				// adding event listeners to listen to sorting button
				document
					.querySelector("#sortJobs")
					.addEventListener("click", applySorting);
			}

			// Create container for jobs
			let jobContainer = document.querySelector(".job-list");

			// Initial render of all jobs and checking if the jobContainer already exists to prevent duplicates
			if (!jobContainer) {
				// Only create a new jobContainer if it doesn't already exist
				jobContainer = document.createElement("div");
				jobContainer.className = "job-list";
				document.querySelector(".background").appendChild(jobContainer);
				renderJobs(jobArray); // Render all jobs initially
			}

			// Function to render jobs
			function renderJobs(filteredJobs) {
				jobContainer.innerHTML = ""; // clear the container

				// Show message if no jobs are available
				if (!filteredJobs || filteredJobs.length === 0) {
					jobContainer.textContent = "No Jobs Available";
					jobContainer.style.margin = "20px";
				} else {
					// Render each job as a paragraph and add HTML atributes
					filteredJobs.forEach((job) => {
						const jobElement = document.createElement("p");
						jobElement.textContent = `${job.title} - ${job.type} (${job.level})`;
						jobElement.style["margin-left"] = "30px";
						jobElement.style.cursor = "pointer";

						// Add click event to display job details
						jobElement.addEventListener("click", () => {
							alert(job.getDetails);
						});

						jobContainer.appendChild(document.createElement("hr"));
						jobContainer.appendChild(jobElement);
					});
					jobContainer.style.margin = "0";
				}
			}

			// Function to apply filters
			function applyFilters() {
				const selectedLevel = document.querySelector("#selectLevel").value;
				const selectedType = document.querySelector("#selectType").value;
				const selectedSkill = document.querySelector("#selectSkill").value;

				// Filter jobs based on the selected criteria
				const filteredJobs = jobArray.filter((job) => {
					const matchesLevel =
						selectedLevel === "all" || job.level === selectedLevel;
					const matchesType =
						selectedType === "all" || job.type === selectedType;
					const matchesSkill =
						selectedSkill === "all" || job.skill === selectedSkill;

					return matchesLevel && matchesType && matchesSkill;
				});

				// render jobs but with the filtered array
				renderJobs(filteredJobs);
			}

			// Function to apply sorting
			function applySorting() {
				const selectedSort = document.querySelector("#selectSort").value;
				let sortedJobs = [...jobArray]; // Copy the jobArray and sort it

				switch (selectedSort) {
					case "title-AZ": {
						sortedJobs.sort((a, b) => a.title.localeCompare(b.title));
						break;
					}
					case "title-ZA": {
						sortedJobs.sort((a, b) => b.title.localeCompare(a.title));
						break;
					}
					case "posted-New": {
						sortedJobs.sort(
							(a, b) => b.getFormattedPostedTime - a.getFormattedPostedTime
						);
						break;
					}
					case "posted-Old": {
						sortedJobs.sort(
							(a, b) => a.getFormattedPostedTime - b.getFormattedPostedTime
						);
						break;
					}
				}
				// if (selectedSort === "title") {
				// } else if (selectedSort === "posted") {
				// 	// Sort by "Posted" time (most recent first)
				// 	sortedJobs.sort((a, b) => {
				// 		// Compare the parsed "Posted" times
				// 		return b.getFormattedPostedTime - a.getFormattedPostedTime;
				// 	});
				// }

				renderJobs(sortedJobs); // render sorted jobs
			}

			// Adjust background style when adding elements
			document.querySelector(".background").style.height = "fit-content";
			document.querySelector(".background").style["padding-bottom"] = "20px";
		} catch (err) {
			fileNode.value = ""; // clear fileInput if an error is thrown
			alert("Unable to read the File"); // alert the user
			console.error(err);
		}
	};
	// read the file's content
	reader.readAsText(file);
});

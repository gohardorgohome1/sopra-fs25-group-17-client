# Contributions


Every member has to complete at least 2 meaningful tasks per week, where a single development task should have a granularity of 0.5-1 day. The completed tasks have to be shown in the weekly TA meetings. You have one "Joker" to miss one weekly TA meeting and another "Joker" to once skip continuous progress over the remaining weeks of the course. Please note that you cannot make up for "missed" continuous progress, but you can "work ahead" by completing twice the amount of work in one week to skip progress on a subsequent week without using your "Joker". Please communicate your planning **ahead of time**.

Note: If a team member fails to show continuous progress after using their Joker, they will individually fail the overall course (unless there is a valid reason).

**You MUST**:
- Have two meaningful contributions per week.

**You CAN**:
- Have more than one commit per contribution.
- Have more than two contributions per week.
- Link issues to contributions descriptions for better traceability.

**You CANNOT**:
- Link the same commit more than once.
- Use a commit authored by another GitHub user.

---

## Contributions Week 1 - 26.03.2025 to 02.04.2025

| **Student**      | **Date**     | **Link to Commit**                                                                                                                          | **Description**                                                     | **Relevance**                                                                                                                                                                                   |
|-------------------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **[@luciacortes063]** | [31.03.2025]       | [Link to Commit 1](https://github.com/gohardorgohome1/sopra-fs25-group-17-server/commit/d0682380fad09579eba4c91af9488cdd081078af)                                                                                                                          | Created MongoDB and connected it with the server repository. Refactored all exoplanets, photometric curve and user scripts to support MongoDB and ensure cohesion across the entire backend code                                    | This is rellevant to ensure we have a suitable database for our server, and the refactor was particularly meaningful because it ensured cohesion across the entire backend code and fixed errors.                                                                |
|                   | [1.04.2025]       | [Link to Commit 2](https://github.com/gohardorgohome1/sopra-fs25-group-17-server/commit/48f0971e7c521637fde5e521b7738dd4f65b36c4)                                                                                                                          | Fixed GetUserDTO and commented tests                                    | This change ensured that the id of the user was a String type in the GetUserDTO. In addition tests were commented so that the build could be successful.  |
|| [1.04.2025]       | [Link to Commit 3](https://github.com/gohardorgohome1/sopra-fs25-group-17-server/commit/3f6adc701a8b80ef6af808383e47d8622195bd25)                                                                                                                          | Added a mock fetchExoplanetDataFromAPI function for testing purposes                              | This temporal change allowed to test the Photometric Curve and Exoplanet by (using curl to upload a txt file) and see that all the backend code worked as expected.  |
|| [1.04.2025]       | [Link to Commit 4](https://github.com/gohardorgohome1/sopra-fs25-group-17-server/commit/47e1ab42cf439ab4afde66e326ef0c0b62ffb6ff)                                                                                                                          | Added error handling in fetchExoplanetDataFromAPI function for testing purposes                              | This change allows to debbug the fetchExoplanetDataFromAPI function and see why it's not working. 
| **[@AlexCapillaUZH]** | [27.03.2025]    | [Link to Commit 1](https://github.com/gohardorgohome1/sopra-fs25-group-17-server/commit/7634c72c99ea82be3896de2aa61ad3ee576613fc)          | Add entity and DTO for photometric curve and datapoints     | We need this changes for being able to save and handle the data obtained from the photometric curves     |
|                   | [28.03.2025]    | [Link to Commit 2](https://github.com/gohardorgohome1/sopra-fs25-group-17-server/commit/1afc09bc87119f381b0448cc9e3954f7b69bb70e)          | Implementing API call, calculating exoplanet parameters, parsing data from txt file, create endpoint. Issues fixed: #47, #59, #60, #61, #62    | Crutial for our application. Handles the data received from the photometric curve txt., saves it in form of datapoints and makes all the calculations for the exoplanet parameters. Also makes the call to the NASA TAP API for retrieving other exoplanet parameters that cannot be calculated.     |
|                   | [30.03.2025]    | [Link to Commit 3](https://github.com/gohardorgohome1/sopra-fs25-group-17-server/commit/26b159ca8635bf36c798b01e73b3032d97596e60)          | merge exoplanet and photometric curve integration    | Just putting both Jesse's and mine work all together (solving some merge conflicts).     |                                                                                                                                                    |
| **[@ayleenmr]** | [01.04.2025]       | [Link to Commit 1](https://github.com/gohardorgohome1/sopra-fs25-group-17-client/commit/d8159542c25920f79100360c289841a57a7c146f)                                                                                                   | Implemented Logout button and the basic design of the dashboard    |Being able to log out and return to the login page is part of our minimal viable product.                                                                                                                                                           |
|                   | [02.04.2025]       | [Link to Commit 2](https://github.com/gohardorgohome1/sopra-fs25-group-17-client/commit/89941ac9f4772791cd90df2377a724ec7b7db47b)                                                                                                | Added Card to the dashboard            | This step is necessary for the implementation of the Earth Similarity Ranking.                                                                                                                           |
| **[@PascalSenn2]** | 28.03.2025   | [Link to Commit 1](https://github.com/gohardorgohome1/sopra-fs25-group-17-client/commit/109aed9c3ef1c0fe18e0b0b8d18bb40d905696fe)           | Creating & Changing directories needed in the frontend              | For our Web-App, we need different pages compared to M1 (ex. /dashboard instead of /users)                                                                                                      |
|                   | 01.04.2025   | [Link to Commit 2](https://github.com/gohardorgohome1/sopra-fs25-group-17-client/commit/e0a925e2d5849ec5865e6f49b67e8c608ac62e2a)           | Creating the design (& some functionality) of the registration page | Users need to be able to register an account & that page should be well designed                                                                                                                |
|                   | 01.04.2025   | [Link to Commit 3](https://github.com/gohardorgohome1/sopra-fs25-group-17-client/commit/8a760bc12556fefc193d780a43310528ee5c01ea)           | Creating the design (& some functionality) of the start page        | It's the first page users see, therefore the design should be good. Additionally, the users should be able to access the login & register page from there                                       |
|                   | 01.04.2025   | [Link to Commit 4](https://github.com/gohardorgohome1/sopra-fs25-group-17-client/commit/80c86a6e57a31858d229b04958b143a38ddd506b)           | Creating the design (& some functionality) of the login page        | Users need to be able to log in to their account & that page should be well designed                                                                                                            |
| **[@gohardorgohome1]** | [28.03.2025] | [Link to Commit 1](https://github.com/gohardorgohome1/sopra-fs25-group-17-server/pull/132/commits/9752e1e3f8bf22b83f05b4a30040cf35342a3b73) | Cleanup of the existing backend code regarding the User object.     | User don't has attributes name and birthday in our application. Also the corresponding endpoints needed to be deleted to make the code much cleaner                                             |
|                   | [28.03.2025] | [Link to Commit 2](https://github.com/gohardorgohome1/sopra-fs25-group-17-server/commit/77b9bcd82d2d6f94fe2979e580da7ba689c7be21)           | basic implementation of the Exoplanet object                        | Foundation of our app                                                                                                                                                                           |
|                   | [28.03.2025] | [Link to Commit 3](https://github.com/gohardorgohome1/sopra-fs25-group-17-server/commit/8c733de54de4f75a4683d6da860d2b06b9153c36)           | DTOMapper, GET/POST mappings                                        | create the endpoints needed for the Exoplanet object                                                                                                                                            |
|                   | [28.03.2025] | [Link to Commit 4](https://github.com/gohardorgohome1/sopra-fs25-group-17-server/commit/8d28449d639909e887ca2f85a7ff237e96e40010)           | Controller, Repository, Service for Exoplanet                       | created the basic structure of these files, API calls to NASA are still open, because we first need to define, which values we actually need from NASA and which ones we calculate by ourselves |
---

## Contributions Week 2 - 02.04.2025 to 09.04.2025


| **Student**      | **Date**  | **Link to Commit**                                                                                                                | **Description**                     | **Relevance**                          |
|-------------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------|-------------------------------------|-----------------------------------------|
| **[@luciacortes063]**   | 06.04.2025   | [Commit 1](https://github.com/gohardorgohome1/sopra-fs25-group-17-server/commit/253e9f81be59a3a7bf3b2b21b89a0ae25eb703d6)                                 | Refactored `fetchExoplanetDataFromAPI` and `parseVOTable` to fix errors and correctly access the NASA TAP API                                            | Ensuring the NASA TAP API call works is crucial, as the calculation of the exoplanet parameters is the foundation of our program.                                    |
|                         | 06.04.2025   | [Commit 2](https://github.com/gohardorgohome1/sopra-fs25-group-17-server/commit/4416dbc18c25bae1cdfe63e56d196eb3c5aabaf8)                                 | Refactored `fetchExoplanetDataFromAPI` and `parseVOTable` to fix errors and correctly access the NASA TAP API                                            | Ensuring the NASA TAP API call works is crucial, as the calculation of the exoplanet parameters is the foundation of our program.                                    |
|                         | 06.04.2025   | [Commit 3](https://github.com/gohardorgohome1/sopra-fs25-group-17-server/commit/9b407dc23fae660d62ea1b75521ae80be7396fba)                                 | Added error handling to NASA TAP API (422 UNPROCESSABLE_ENTITY when there is not enough info in the NASA Database)                                       | We need to capture exceptions because the NASA TAP API might not always return information, and our program should be able to handle this edge case.                |
|                         | 06.04.2025   | [Commit 4](https://github.com/gohardorgohome1/sopra-fs25-group-17-server/commit/5b11f2e4e09e3e8c84cec129d15eccf78abc9fd9)                                 | Updated `ExoplanetGetDTO`                                                                                                                                | We have to retrieve all the exoplanet parameters that are being calculated, not only the name of the exoplanet, id and host star.                                   |
|                         | [date]       | [Commit 5](https://github.com/gohardorgohome1/sopra-fs25-group-17-server/commit/ca232676d6b8a8d5b342300eff89ed343e093023)                                 | Added `ownerId` as parameter in the photometric curve endpoint                                                                                           | The `ownerId` is the connection between our databases and it wasn't modelled yet. Now it is sent as a parameter to the upload photometric curve endpoint.            |
|                         | 08.04.2025   | [Commit 6](https://github.com/gohardorgohome1/sopra-fs25-group-17-server/commit/47fc9dd981998f585c91b53052296c832368e690)                                 | Changed the numerical precision of the photometric curve datapoints (from float to double)                                                               | This is needed in order to plot the photometric curve correctly in the frontend.                      |
| **[@AlexCapillaUZH]** | [06.04.2025]    | [Link to Commit 1](https://github.com/gohardorgohome1/sopra-fs25-group-17-client/commit/9476b849ee8491d0f6df4d58e49eeb6f74b5f886)          | Making a sketch of the exoplanet profile page    |  Exporting the design from figma, adjusting it so it fits in the screen. Implemented the exoplanets display retrieving the information with the endpont.    |     
|                   | [08.04.2025]    | [Link to Commit 2](https://github.com/gohardorgohome1/sopra-fs25-group-17-client/commit/9476b849ee8491d0f6df4d58e49eeb6f74b5f886)          | Created exoplanet profile. Solved: #16, #17, #18, #19    |  Fixing the data display (some issues were fixed in the backend), retrieved the datapoints and plotted them with plotly, displaying the plot in the correct position, and ensuring the page has a correct structure overall.  |     
| **[@ayleenmr]** | [09.04.2025]    | [Link to Commit 1](https://github.com/gohardorgohome1/sopra-fs25-group-17-client/commit/4ef9d3fabac823b349fc1d5f8a0a42a5b517c9fd) | Implemented logic of the earth similarity ranking    |  It is an important feature of the dashboard and part of our minimal viable product.    |
|                   | [09.04.2025]    | [Link to Commit 2](https://github.com/gohardorgohome1/sopra-fs25-group-17-client/commit/94893eb5391c5907cf9be78ba8a1bd13798eac62) | Added some formatting to the earth similarity ranking display in the dashboard     | We try to follow the Figma as closely as possible.     |
| **[@PascalSenn2]** | [08.04.2025] | [Link to Commit 1](https://github.com/gohardorgohome1/sopra-fs25-group-17-client/commit/623b02bd5e5536e7ceec1bba9649a32d688b4250) | The Design of the entire upload page (still with some flaws) | Users must be able to upload their Photometric Curves as .txt files and this page should be easily understandable and good looking.                                                                                                                                                                     |
|                   | [09.04.2025] | [Link to Commit 2](https://github.com/gohardorgohome1/sopra-fs25-group-17-client/commit/3b3edc035720a3998f09c0f9c1c2f21099f9a05b) | File upload & post request                                   | Any user needs to be able to upload their Photometric Curve file with the corresponding planet and host star name, so that all users can find the exoplanet, view it's parameters and see it on the dashboard.                                                                                          |
| **[@gohardorgohome1]** | [06.04.2025]    | [Link to Commit 1](https://github.com/gohardorgohome1/sopra-fs25-group-17-client/commit/4ea185388f5e9b6151b0c05f871ee1f0e02fa781) | Basic starmap with plotly    | its one of the main features on our dashboard, it categorises exoplanets and makes them visible on the map. I made the full design according to figma and also implemented the logic and put one test planet on the map.   |
|                   | [08.04.2025]    | [Link to Commit 2](https://github.com/gohardorgohome1/sopra-fs25-group-17-server/commit/61bddf1abc82f75fbc54cb7fb9f30d107bd878e8) | setup of web sockets    | as we want real-time notifications we need this setup in the backend, what is missing right now is the endpoint which needs to be done in the PhotometricCurveController.java, but this file first needs to be changed anyway, I will add the web sockets logic there once the basic logic is adjusted.    |

---

## Contributions Week 3 - 09.04.2025 to 16.04.2025

| **Student**      | **Date**  | **Link to Commit**          | **Description**                     | **Relevance**                          |
|-------------------|-----------|-----------------------------|-------------------------------------|-----------------------------------------|
| **[@luciacortes063]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@AlexCapillaUZH]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@ayleenmr]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@PascalSenn2]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@gohardorgohome1]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |

---

## Contributions Week 4 - 16.04.2025 to 23.04.2025

| **Student**      | **Date**  | **Link to Commit**          | **Description**                     | **Relevance**                          |
|-------------------|-----------|-----------------------------|-------------------------------------|-----------------------------------------|
| **[@luciacortes063]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@AlexCapillaUZH]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@ayleenmr]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@PascalSenn2]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@gohardorgohome1]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |

---

## Contributions Week 5 - 23.04.2025 to 30.04.2025

| **Student**      | **Date**  | **Link to Commit**          | **Description**                     | **Relevance**                          |
|-------------------|-----------|-----------------------------|-------------------------------------|-----------------------------------------|
| **[@luciacortes063]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@AlexCapillaUZH]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@ayleenmr]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@PascalSenn2]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@gohardorgohome1]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |

---

## Contributions Week 6 - 30.04.2025  to 07.05.2025

| **Student**      | **Date**  | **Link to Commit**          | **Description**                     | **Relevance**                          |
|-------------------|-----------|-----------------------------|-------------------------------------|-----------------------------------------|
| **[@luciacortes063]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@AlexCapillaUZH]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@ayleenmr]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@PascalSenn2]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@gohardorgohome1]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |

---

## Contributions Week 7 - 07.05.2025  to 14.05.2025

| **Student**      | **Date**  | **Link to Commit**          | **Description**                     | **Relevance**                          |
|-------------------|-----------|-----------------------------|-------------------------------------|-----------------------------------------|
| **[@luciacortes063]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@AlexCapillaUZH]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@ayleenmr]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@PascalSenn2]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@gohardorgohome1]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |

---

## Contributions Week 8 - 14.05.2025  to 21.05.2025

| **Student**      | **Date**  | **Link to Commit**          | **Description**                     | **Relevance**                          |
|-------------------|-----------|-----------------------------|-------------------------------------|-----------------------------------------|
| **[@luciacortes063]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@AlexCapillaUZH]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@ayleenmr]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@PascalSenn2]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@gohardorgohome1]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |

---

## Contributions Week 9 - 21.05.2025  to 28.05.2025

| **Student**      | **Date**  | **Link to Commit**          | **Description**                     | **Relevance**                          |
|-------------------|-----------|-----------------------------|-------------------------------------|-----------------------------------------|
| **[@luciacortes063]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@AlexCapillaUZH]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@ayleenmr]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@PascalSenn2]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |
| **[@gohardorgohome1]** | [date]    | [Link to Commit 1]          | [Brief description of the task]     | [Why this contribution is relevant]     |
|                   | [date]    | [Link to Commit 2]          | [Brief description of the task]     | [Why this contribution is relevant]     |

---
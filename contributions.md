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
|                   | [30.03.2025]    | [Link to Commit 3](https://github.com/gohardorgohome1/sopra-fs25-group-17-server/commit/26b159ca8635bf36c798b01e73b3032d97596e60)          | merge exoplanet and photometric curve integration    | Just putting both Jesse's and mine work all together (solving some merge conflicts).     |                                                                                                                                                      |
| **[@ayleenmr]** | [date]       | [Link to Commit 1]                                                                                                                          | [Brief description of the task]                                     | [Why this contribution is relevant]                                                                                                                                                             |
|                   | [date]       | [Link to Commit 2]                                                                                                                          | [Brief description of the task]                                     | [Why this contribution is relevant]                                                                                                                                                             |
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
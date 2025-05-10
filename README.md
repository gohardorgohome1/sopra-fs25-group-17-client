# Project Objective and Scientific Background
In this project, we aim to develop a tool that can be useful for the automation and optimization of the search for habitable exoplanets. Specifically, our project focuses on the analysis of planetary transits. 

A planetary transit is a very useful and widely used method in astrophysics to search for exoplanets in the universe. A transit occurs when an exoplanet passes in front of its star from the Earth's frame of reference. Figure 1 is an example of a planetary transit. 

Astrophysicists and space telescopes measure the light coming from a certain star, and if a planetary transit occurs, we will observe that the light from that star drops over a period of time, forming a curve. This curve is called a photometric curve, and it is the input provided by the user on our platform. By calculating the percentage drop in brightness from this curve, and combining it with some star data retrieved via the NASA Exoplanet Archive TAP API, we can compute key parameters of the exoplanet such as its mass, radius, density, surface temperature, gravity, etc.

One particularly important parameter we calculate is the Earth Similarity Index, which tells us how similar the exoplanet is to Earth. This allows us to identify potentially habitable planets. 

To summarize, this is the physical and scientific core of our project, which helps explain what our platform does and how it can assist in the search for habitable exoplanets. 

# Technologies Used

- **Backend**: Java 17, Spring Boot, MongoDB
- **Frontend**: JavaScript, React (with Next.js), Flake, Ant Design (UI), Plotly.js (charts)
- **Deployment**: Google App Engine (backend), Vercel (frontend)
- **Build Tools**: Gradle (backend), npm (frontend)
- **Development Environment**: WSL / Linux recommended for frontend

# High Level Components
Our platform consists of the following key components:

1. [**Dashboard**](./app/dashboard/page.tsx): Provides an overview of analyzed exoplanets, classifications, and quick links to detailed profiles.
2. [**Photometric Curve Upload Page**](./app/exoplanets/upload/page.tsx): Handles photometric curve upload, form validation, and triggers the analysis logic.
3. [**Exoplanet Profile Page**](./app/exoplanets/[id]/page.tsx): Dynamically renders all calculated parameters, the light curve plot, and comment section.
4. [**WebSocket Integration**](./app/components/WebSocketProvider.tsx): Enables real-time planet updates across all user dashboards using STOMP over SockJS.
5. [**AI Assistant**](./app/openai/page.tsx): Provides GPT-4o-mini powered chat functionality using OpenAI's API, shown in a collaborative chat interface.

These components work together through shared state and APIs to support user interaction, data analysis, and real-time collaboration.

# The platform: UI and functionalities

In this section we describe the platform itself and the user interface.

First, the user – typically an astrophysicist or a researcher – must register or log in to access the system. Once authenticated, the user lands on the Dashboard, the main page of the platform. On the left side of the Dashboard, there's a plot (with Orbital Period on the x-axis and Radius on the y-axis) that classifies exoplanets analyzed by all users into categories: Earth-Like Planets, Rocky Planets, Lava Worlds, Ocean Worlds, Ice Giants, Cold Gas Giants, and Hot Jupiters. This graph is very helpful for quickly identifying which planets might harbor life and which ones probably don't. Since clusters are formed in this plot, a researcher might want to further investigate a particular group of exoplanets.

On the right side of the Dashboard, the user can also see an Earth Similarity Ranking. This ranks the exoplanets analyzed by all users based on their Earth Similarity Index, a metric that tells us how Earth-like a given planet is and thus how likely it is to support life. In this way, researchers can narrow the search and focus on the most promising candidates. 

Users can also analyze a new exoplanet by clicking the “Analyze and Add Exoplanet” button on the Dashboard. This button redirects the user to a page where they can upload a photometric light curve. In practice, astrophysicists obtain these curves by taking telescope images of a star during a planetary transit. After postprocessing the images, they extract the photometric curves for each exoplanet. To simplify this process, we’ve used curves from the Exoplanet Transit Database. These are simply .txt files containing metadata and information about the filters used for the observations, as well as numerical data (magnitude and time) that generate the light curve. In our client GitHub repo, we’ve included several .txt files named after their corresponding exoplanets.

To analyze an exoplanet, the user must upload a .txt file containing a photometric curve and fill in the corresponding fields with the name of the exoplanet and its star. The exoplanet name must be entered correctly because it’s used to query the NASA Exoplanet Archive TAP API — if the name is incorrect, an AI assistant will make a suggestion for you.

Once the user clicks “Calculate,” a profile page is automatically generated for that exoplanet. First, the photometric curve is displayed (time on the X-axis, brightness on the Y-axis), showing the light dip caused by the exoplanet passing in front of its star. The page also displays all the calculated parameters of the exoplanet, based on formulas and the data retrieved from the NASA API (we fetch the star’s radius, the planet’s orbital period, and its temperature). Notably, the units used for all magnitudes are relative to Earth — for instance, the planet’s mass is expressed in Earth masses, its radius in Earth radii, etc. Lastly, the page includes a comment section, where users can post real-time, persistent feedback about the exoplanet. 

As soon as the user clicks “Calculate” and the exoplanet profile page is generated, a real-time notification (via WebSockets) is sent to all users in the Dashboard, indicating that a new exoplanet has been added. The planet also appears instantly in both the classification plot and the Earth Similarity Ranking. In both places, users can click on the exoplanet and will be redirected to its profile page. Additionally, users can delete an exoplanet — but only if they are the "owner" — using the “Delete Exoplanet” button. 

Lastly, we’ve also implemented an AI Assistant to answer questions and provide information about exoplanets. To access it, users can click “AI Assistant” in the Dashboard. This opens a chat interface, similar to OpenAI’s ChatGPT. However, in our case, the conversation is public — all users can see the questions asked by others and the responses from the AI Assistant. We’ve done this to encourage collaboration and shared knowledge in the fields of astrophysics and astrobiology. The AI Assistant uses OpenAI’s Chat Completions API with the gpt-4o-mini model. 

In conclusion, the goal of our project is to contribute to the progress of planetary detection and habitability research, while fostering collaboration among researchers. As someone wise once said: "Alone you go fast, but together you go far."


# User guide for adding and analyzing an exoplanet

The goal of this section is to guide users through the process of adding and analyzing exoplanets within the application. While the user interface becomes fairly intuitive after reading the sections below—which explains our project and the UI functionalities—we believe the specific step of adding and analyzing exoplanets might still feel slightly unintuitive. This is mainly because the user needs to upload a photometric light curve. Here's a step-by-step explanation of the process:

1. **Download the `.txt` files (photometric light curves) from the Client GitHub**

   In the Client GitHub repository, we have provided five photometric light curves. These files are in `.txt` format and can be easily identified. Each file is named after the exoplanet it corresponds to.

2. **Register / Log in and navigate to the Dashboard**

3. **Click on "Add and Analyze Exoplanet"**

   On the Dashboard, the user should click on "Add and Analyze Exoplanet". This will redirect them to the page where photometric curves can be uploaded.

4. **Click on "Upload File"**

   Here, the user needs to upload one of the `.txt` files mentioned in Step 1.

5. **Enter the exoplanet name in the text box**

   To simplify the process, the name of the exoplanet should exactly match the name of the uploaded `.txt` file.  
   For example, if the file is named `TrES-3 b.txt`, the user must enter `TrES-3 b` in the input field.  
   It is very important to respect capitalization and spacing. We understand that this requirement increases the chances of user error. This will be improved in Milestone 4.

6. **Enter the name of the star**

   Although we are not yet using this field for queries, it still needs to be filled in. It can be made up without affecting the analysis.  
   However, for accuracy, the name of the star is usually the exoplanet name without its last letter.  
   For instance, the star corresponding to `TrES-3 b` would be `TrES-3`.

7. **Click on "Calculate"**

   This will generate a new profile for the exoplanet and automatically redirect the user to its dedicated page. The exoplanet will also be added to the Dashboard and a real-time notification will be sent to all users. From this point on, the user can continue using the platform as normal.



# Launch and Deployment

### Prerequisites
- Git installed
- MacOS, Linux, or WSL2 (Windows-Subsystem-Linux) on Windows
- [Determinate Nix](https://determinate.systems)
- [direnv](https://direnv.net/)

> ⚠️ **Backend Required**: This frontend app relies on a running backend server.  
> Make sure to follow the setup instructions in the [server repository](https://github.com/gohardorgohome1/sopra-fs25-group-17-server.git) and start the backend before launching the client.


### Installation (One-Time Setup)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gohardorgohome1/sopra-fs25-group-17-client.git
   cd YOUR-CLIENT-REPO
   ```

2. **Run the setup script:**
   ```bash
   source setup.sh
   ```

This will install all necessary dependencies using Determinate Nix and configure your environment with `direnv`.

### Running Locally

#### Start development server (live reload):

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

#### Production build & preview:

```bash
npm run build     # Create optimized production build
npm run start     # Serve production build
```

### Releasing / Deployment

The app can be deployed to any static hosting service such as Vercel or Netlify.

#### Deploy to [Vercel](https://vercel.com/):

1. Push your repository to GitHub.
2. Connect the repo to your Vercel account.
3. Vercel will auto-detect the Next.js app and deploy it.


### External Dependencies

* **NASA Exoplanet Archive API** – used to fetch exoplanet data
* **OpenAI GPT-4o-mini** – powers the AI Assistant (API key is needed)
* **MongoDB** – the backend requires a running MongoDB instance for data persistence (e.g. for user accounts, exoplanets)


### Notes for Windows Users

Make sure your repository is located inside the WSL filesystem (e.g., `/home/your-username`). If it's on the Windows drive (`/mnt/c`), performance will suffer.

# Roadmap

If you'd like to contribute to this project, here are some features and tasks that can be worked on:

### 1. **Exoplanet Game with AI-Generated Questions**
   - **Description**: Build an interactive game within the platform where users can answer AI-generated questions about exoplanets. The questions can range from factual knowledge to more speculative queries (e.g., "Which exoplanets might be habitable?"). This can make the platform more engaging and educational.
   - **Skills Needed**: JavaScript, React, OpenAI API integration, Game Design

### 2. **Enhance Collaboration Features (Friends/Groups)**
   - **Description**: Improve collaboration by adding a "friends" system or the ability for users to create and join research groups. This would allow researchers to connect, share insights, and collaborate on analyzing exoplanets. Users could have the ability to follow others, comment, or share findings within a specific group.
   - **Skills Needed**: Backend development (Spring Boot, MongoDB), Frontend development (React)

### 3. **Redesign and Enhance Dashboard for Intuitiveness**
   - **Description**: Refactor and redesign the Dashboard to make it more user-friendly and intuitive. This includes improving the layout, adding tooltips, enhancing data visualizations, and making key metrics and features easier to access for users.
   - **Skills Needed**: UI/UX design, React, Ant Design, Plotly.js, Frontend development

---

We welcome contributions from all developers to help improve and expand the platform. If you're interested in tackling any of these tasks or have your own ideas, feel free to open an issue or a pull request!


# Authors
- **Jesse Koller** – Project Lead, Developer
  [GitHub Profile](https://github.com/gohardorgohome1)

- **Lucía Cortés** – Developer 
  [GitHub Profile](https://github.com/luciacortes063)

- **Àlex Capilla** – Developer 
  [GitHub Profile](https://github.com/AlexCapillaUZH)

- **Pascal Senn** – Developer 
  [GitHub Profile](https://github.com/PascalSenn2)

- **Ayleen Rüegg** – Developer
  [GitHub Profile](https://github.com/ayleenmr)


# License

This project is licensed under the [MIT License](LICENSE.txt).

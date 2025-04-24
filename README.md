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


# Project Objective and Scientific Background
In this project, we aim to develop a tool that can be useful for the automation and optimization of the search for habitable exoplanets. Specifically, our project focuses on the analysis of planetary transits. 

A planetary transit is a very useful and widely used method in astrophysics to search for exoplanets in the universe. A transit occurs when an exoplanet passes in front of its star from the Earth's frame of reference. Figure 1 is an example of a planetary transit. 

Astrophysicists and space telescopes measure the light coming from a certain star, and if a planetary transit occurs, we will observe that the light from that star drops over a period of time, forming a curve. This curve is called a photometric curve, and it is the input provided by the user on our platform. By calculating the percentage drop in brightness from this curve, and combining it with some star data retrieved via the NASA Exoplanet Archive TAP API, we can compute key parameters of the exoplanet such as its mass, radius, density, surface temperature, gravity, etc.

One particularly important parameter we calculate is the Earth Similarity Index, which tells us how similar the exoplanet is to Earth. This allows us to identify potentially habitable planets. 

To summarize, this is the physical and scientific core of our project, which helps explain what our platform does and how it can assist in the search for habitable exoplanets. 

# The platform: UI and functionalities

In this section we describe the platform itself and the user interface.

First, the user – typically an astrophysicist or a researcher – must register or log in to access the system. Once authenticated, the user lands on the Dashboard, the main page of the platform. On the left side of the Dashboard, there's a plot (with Orbital Period on the x-axis and Radius on the y-axis) that classifies exoplanets analyzed by all users into categories: Earth-Like Planets, Rocky Planets, Lava Worlds, Ocean Worlds, Ice Giants, Cold Gas Giants, and Hot Jupiters. This graph is very helpful for quickly identifying which planets might harbor life and which ones probably don't. Since clusters are formed in this plot, a researcher might want to further investigate a particular group of exoplanets.

On the right side of the Dashboard, the user can also see an Earth Similarity Ranking. This ranks the exoplanets analyzed by all users based on their Earth Similarity Index, a metric that tells us how Earth-like a given planet is and thus how likely it is to support life. In this way, researchers can narrow the search and focus on the most promising candidates. 

Users can also analyze a new exoplanet by clicking the “Analyze and Add Exoplanet” button on the Dashboard. This button redirects the user to a page where they can upload a photometric light curve. In practice, astrophysicists obtain these curves by taking telescope images of a star during a planetary transit. After postprocessing the images, they extract the photometric curves for each exoplanet. To simplify this process, we’ve used curves from the Exoplanet Transit Database. These are simply .txt files containing metadata and information about the filters used for the observations, as well as numerical data (magnitude and time) that generate the light curve. In our client GitHub repo, we’ve included several .txt files named after their corresponding exoplanets so the TAs can test our platform. 

So, to analyze an exoplanet, the user must upload a .txt file containing a photometric curve and fill in the corresponding fields with the name of the exoplanet and its star. It’s important to emphasize that, in this milestone, the exoplanet name must be entered correctly because it’s used to query the NASA Exoplanet Archive TAP API — if the name is incorrect, the external API won’t return any data. For Milestone 3, the name of the star is not yet relevant — only the exoplanet name is required. 

Once the user clicks “Calculate,” a profile page is automatically generated for that exoplanet. First, the photometric curve is displayed (time on the X-axis, brightness on the Y-axis), showing the light dip caused by the exoplanet passing in front of its star. The page also displays all the calculated parameters of the exoplanet, based on formulas and the data retrieved from the NASA API (we fetch the star’s radius, the planet’s orbital period, and its temperature). Notably, the units used for all magnitudes are relative to Earth — for instance, the planet’s mass is expressed in Earth masses, its radius in Earth radii, etc. Lastly, the page includes a comment section, where users can post real-time, persistent feedback about the exoplanet. 

As soon as the user clicks “Calculate” and the exoplanet profile page is generated, a real-time notification (via WebSockets) is sent to all users in the Dashboard, indicating that a new exoplanet has been added. The planet also appears instantly in both the classification plot and the Earth Similarity Ranking. In both places, users can click on the exoplanet and will be redirected to its profile page. Additionally, users can delete an exoplanet — but only if they have added it — using the “Delete Exoplanet” button. 

Lastly, we’ve also implemented an AI Assistant to answer questions and provide information about exoplanets. To access it, users can click “AI Assistant” in the Dashboard. This opens a chat interface, similar to OpenAI’s ChatGPT. However, in our case, the conversation is public — all users can see the questions asked by others and the responses from the AI Assistant. We’ve done this to encourage collaboration and shared knowledge in the fields of astrophysics and astrobiology. The AI Assistant uses OpenAI’s Chat Completions API with the gpt-4o-mini model. 

In conclusion, the goal of our project is to contribute to the progress of planetary detection and habitability research, while fostering collaboration among researchers. As someone wise once said: "Alone you go fast, but together you go far."





# Getting Started



### MacOS, Linux and WSL
If you are using MacOS, Linux or WSL(Windows-Subsystem-Linux), you can skip directly to the [installation part](https://github.com/HASEL-UZH/sopra-fs25-template-client?tab=readme-ov-file#installation)



### Windows
If you are using Windows, you first need to install WSL(Windows-Subsystem-Linux). You might need to reboot your computer for the installation, therefore, save and close all your other work and programs

1. Download the following [powershell script](./windows.ps1)\
![downloadWindowsScript](https://github.com/user-attachments/assets/1ed16c0d-ed8a-42d5-a5d7-7bab1ac277ab)
---
2. Open a new powershell terminal **with admin privileges** and run the following command and follow the instructions. Make sure that you open the powershell terminal at the path where you have downloaded the powershell script, otherwise the command will not work because it can not find the script. You can list currently accessible files in the powershell terminal with ```dir``` and you can use ```cd``` to navigate between directories
   ```shell
   C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe -ExecutionPolicy Bypass -File .\windows.ps1
   ```
---
3. If you experience any issues, try re-running the script a couple of times. If the installation remains unsuccessful, follow this [youtube tutorial](https://youtu.be/GIYOoMDfmkM) or post your question in the OLAT forum
---
4. After successful installation, you can open WSL/Ubuntu. You will need to choose a username and password, although no characters will be shown on the screen when typing the password but the system recognizes your input, no worries :) After these four steps your setup should look similar to this
![initialUbuntuScreen](https://github.com/user-attachments/assets/a2b1511f-943b-468e-a726-b7a9dc46ea2c)


<br>
<br>
<br>

# Installation
1. Open a new MacOS, Linux or WSL(Windows-Subsystem-Linux) terminal. Make sure you have git installed, you can check that by running
   ```shell
   git --version
   ```
   The output should be something similar to ```git version X.XX.X```, if not, try to install git in one of the following ways
   #### MacOS
   ```shell
   brew install --formulae git
   ```
   #### Linux/WSL
   ```shell
   sudo apt-get install git
   ```
   If you are not using Ubuntu, you will need to install git with your package manager of choice
---
2. Clone the repository with git using the following command
   ```shell
   git clone https://github.com/YOUR_USERNAME/YOUR-CLIENT-REPO
   ```
---
3. Navigate to the cloned directory in the terminal, in example with ```cd sopra-fs25-student-client```
---
4. Inside the repository folder (with ```ls``` you can list files) there is a bash script _setup.sh_ that will install everything you need, according to the system you are using. Run the following command and follow the instructions
   ```shell
   source setup.sh
   ```
The screenshot below shows an example of how this looks
![sourceScript](https://github.com/user-attachments/assets/2560320a-93ec-4086-994d-f3a0eed53c7b)

The installation script _setup.sh_ can take a few minutes, please be patient and do not abort the process. If you encounter any issues, please close the terminal and open a new one and try to run the command again

<br>
<br>
<br>

# Troubleshooting the installation
If the four steps above did not work for you and re-running the setup.sh script a couple of times did not help, try running the following steps manually
1. Open a new MacOS, Linux or WSL(Windows-Subsystem-Linux) terminal and navigate to the repository with ```cd```. Then ensure that curl is installed
   ```shell
   curl --version
   ```
   The output should be something similar to ```curl X.X.X```, if not, try to install curl in one of the following ways
      #### MacOS
   ```shell
   brew install --formulae curl
   ```
   #### Linux/WSL
   ```shell
   sudo apt-get install curl
   ```
   If you are not using Ubuntu, you will need to install curl with your package manager of choice
---
2. Download Determinate Nix
   ```shell
   curl --proto '=https' --tlsv1.2 -ssf --progress-bar -L https://install.determinate.systems/nix -o install-nix.sh
   ```
---
3. Install Determinate Nix
   ```shell
   sh install-nix.sh install --determinate --no-confirm --verbose
   ```
---
4. Install direnv using nix
   ```shell
   nix profile install nixpkgs#direnv
   ```
   If you encounter a permission error, try running with sudo
   ```shell
   sudo nix profile install nixpkgs#direnv
   ```
---
5. Find out what shell you are using
   ```shell
   echo $SHELL
   ```
---
6. Hook direnv into your shell according to [this guide](https://github.com/direnv/direnv/blob/master/docs/hook.md)
---
7. Allow direnv to access the repository
   ```shell
   direnv allow
   ```

If all troubleshooting steps above still did not work for you, try the following as a **last resort**: Open a new terminal and navigate to the client repository with ```cd```. Run the command. Close the terminal again and do this for each of the six commands above, running each one in its own terminal, one after the other.

<br>
<br>
<br>

# Available commands after successful installation
With the installation steps above your system now has all necessary tools for developing and running the sopra frontend application. Amongst others, two javascript runtimes have been installed for running the app:
- [NodeJS](https://nodejs.org)
- [Deno](https://deno.com)

Runtimes is what your system needs to compile [typescript](https://www.typescriptlang.org) code (used in this project) to javascript and execute the application. You can use either runtime for this project, according to your preference. Both come with an included package manager, ```npm``` for nodejs and ```deno``` for deno. Thereby, the [package.json](./package.json) file defines possible commands that can be executed (using either ```deno``` or ```npm```). The following commands are available in this repository:
1. **Running the development server** - This will start the application in development mode, meaning that changes to the code are instantly visible live on [http://localhost:3000](http://localhost:3000) in the browser
   ```bash
   deno task dev
   ```
2. **Building a production-ready application** - This will create an optimized production build that is faster and takes up less space. It is a static build, meaning that changes to the code will only be included when the command is run again
   ```bash
   deno task build
   ```
3. **Running the production application** - This will start the optimized production build and display it on [http://localhost:3000](http://localhost:3000) in the browser. This command can only be run _after_ a production build has been created with the command above and will not preview live code changes
   ```bash
   deno task start
   ```
4. **Linting the entire codebase** - This command allows to check the entire codebase for mistakes, errors and warnings
   ```bash
   deno task lint
   ```
5. **Formatting the entire codebase** - This command will ensure that proper indentation, spacing and further styling is applied to the code. This ensures that the code looks uniform and the same across your team members, it is best to run this command _every time before pushing changes to your repository_!
   ```bash
   deno task fmt
   ```

All of the above mentioned commands can also be run using the nodejs runtime by substituting ```deno task``` with ```npm run```, i.e
```bash
npm run dev
```

<br>
<br>
<br>

# Installing additional software by modifying [flake.nix](./flake.nix)
As this project uses Determinate Nix for managing development software, installing additional tools you might need is straightforward. You only need to adjust the section ```nativeBuildInputs = with pkgs;``` in the [nix flake](./flake.nix) with the package you would like to install. For example, if you want to use docker (the [Dockerfile](./Dockerfile) and [.dockerignore](./.dockerignore) are already included in this repo) you can simply add:
```nix
        nativeBuildInputs = with pkgs;
          [
            nodejs
            git
            deno
            watchman
            docker ### <- added docker here
          ]
          ++ lib.optionals stdenv.isDarwin [
            xcodes
          ]
          ++ lib.optionals (system == "aarch64-linux") [
            qemu
          ];
```

and add the package path to the ```shellHook''``` section
```nix
        devShells.default = pkgs.mkShell {
          inherit nativeBuildInputs;

          shellHook = ''
            export HOST_PROJECT_PATH="$(pwd)"
            export COMPOSE_PROJECT_NAME=sopra-fs25-template-client
            
            export PATH="${pkgs.nodejs}/bin:$PATH"
            export PATH="${pkgs.git}/bin:$PATH"
            export PATH="${pkgs.deno}/bin:$PATH"
            export PATH="${pkgs.watchman}/bin:$PATH"
            export PATH="${pkgs.docker}/bin:$PATH" ### <- added docker path here
            
            ### rest of code ###
        };
```

and finally do ```direnv reload``` in your terminal inside the repository folder. If you need a specific version of a package, you can override it in the ```overlays``` section
```nix
        overlays = [
          (self: super: {
            nodejs = super.nodejs_23; ### <- changed to nodejs 23
          })
        ];
```

<br>
<br>
<br>

# Miscellaneous
This project uses
[`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
to automatically optimize and load [Geist](https://vercel.com/font), a new font
family for Vercel.

## Learn More
To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out
[the Next.js GitHub repository](https://github.com/vercel/next.js) - your
feedback and contributions are welcome!

## Deploy on Vercel
The easiest way to deploy your Next.js app is to use the
[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our
[Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)
for more details.

## Windows users
Please ensure that the repository folder is inside the WSL2 filesystem (otherwise, the disk IO performance will be horrible). If you followed the tutorial closely, this is already the case. If for whatever reason you deviated from the instructions, please take the time now to ensure the repo is on the WSL filesystem. You can do this either by
1. _Cloning the repository again with git in a WSL/Ubuntu terminal using the following command and deleting the repository on the windows filesystem_
   ```shell
   git clone https://github.com/HASEL-UZH/sopra-fs25-template-client
   ```
2. _Using the Windows explorer to move the repository from the windows filesystem to WSL filesystem_
   In the left overview of all folders and drives there should be a new filesystem called Linux (also check in the network tab). Open the Linux drive and open the folder named "home", followed by your username. Copy the whole repository folder from your current location to the Linux folder /home/your-username (note that the folder will initially be empty). Finally, delete the folder from your current location such that you only have the folder inside the Linux filesystem.
3. _Using the command line in WSL to move the repo_
   Open a new Ubuntu / WSL2 terminal window. This will automatically open your home folder of the Linux file system. You then need to locate where the repository / folder that you have downloaded resides. You can use the ```cp -ar``` command to copy the folder from the Windows drive to the Linux filesystem. The command takes the following arguments: cp **source_file** _target_file_. Thus we need to specify **source_file** the folder we want to copy from Windows filesystem and the _target_file_ where to copy the folder to in the Linux filesystem. As visible in this screenshot ![copyFolderToUbuntu](https://github.com/user-attachments/assets/d483e495-e3af-4e85-929c-61dce1a39e10) the repository folder resides under the C drive in /mnt/c/. If your file is not on your C drive, the folder path will be something like /mnt/d/. In the screenshot, the downloaded repository folder is in the Downloads folder of the current user on the C drive, thus the path for **source_file** is ```/mnt/c/Users/immol/Downloads```. The terminal in the screenshot is currently in the home directory, indicated by ~ in the path in blue. As we want to copy the folder to the home folder (/home/your-username) we can specify the current directory (.) as the _target_file_, thus the dot at the end of the command. If you happen to not be in the home folder, you can also run the command with explicitly copying to the home folder as such:
   ```bash
   cp -ar /mnt/c/your-path /home/your-username
   ```
   Else you can run
   ```bash
   cp -ar /mnt/c/your-path .
   ```
   with . indicating to copy to the current path (in this case your home folder). You can check if the repository was successfully copied over using ```ls``` to list folders and files, as visible in the screenshot. You can then delete the downloaded folder / repository from the Windows filesystem in the explorer.

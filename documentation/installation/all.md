#### Directions for All
##### Installing source code
1. Download source code

    In the directory that you want the project in, run:
    ```console
    $ git clone https://github.com/Empyrean-Capstone/Empyrean.git
    ```

    Ensure that a directory named `Empyrean` has been correctly copied into the current working directory.

    Now, move into the repository with:
    ```console
    $ cd Empyrean
    ```

##### Installing Docker and Docker Compose
This application uses [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/get-started/08_using_compose/) for containerization. This allows the software to be run on any machine that can use Docker (all modern operating systems). All application dependencies will be installed for you in a container and the application will be capable of being start with just one command after proper setup.

Ensure that Docker is installed on the computer that you wish to run the application on. It can be used via a GUI (via Docker Desktop, which is recommended for new users) or via the command line. If used via the command line (meaning that you did not install Docker Desktop), you will need to install Docker Compose yourself. The directions below are for command line usage, given that it is the more difficult of the two. After installation, you may need to start Docker's service. How to do this depends on the operating system. See the [installation documentation](https://docs.docker.com/engine/install/) and [daemon documentation](https://docs.docker.com/config/daemon/start/), assuming you will not use Docker Desktop.

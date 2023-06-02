# Step 1: Installing source code and major dependencies

1. Download source code

    In the directory that you want the project in, run:
    ```console
    $ git clone https://github.com/Empyrean-Capstone/Empyrean.git
    ```

    Ensure that a directory named `Empyrean` has been correctly copied into this directory.

    Now, move into the repository with:
    ```console
    $ cd Empyrean
    ```

    <br>

2. Install major dependencies

    Ensure that the following tools are installed:

    On Ubuntu Linux:
    ```console
    $ sudo apt install -y npm python pip yarn postgresql
    ```

    On MacOS:
    ```console
    $ brew install npm
    $ brew install python
    $ brew install pip
    $ brew install yarn
    $ brew install postgresql
    ```

    `Important 💡:` if installing Postgresql through Brew does not work, run: `$ brew reinstall icu4c`

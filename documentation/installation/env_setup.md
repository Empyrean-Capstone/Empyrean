## Step 2: Setting up the environment and installing minor dependencies

1. Make a python virtual environment:

    Python virtual environments allow the project to have an isolated space for dependencies. This makes it so that any Python packages you install for the project, for example through pip, are separate from those installed on your machine. This eliminates conflicts between packages, ensuring that those installed will not conflict with those already present and that your project uses the ones you intend it to. Two common ways to create a virtual environment include via Conda or Pip:

    a. With Conda:

    If conda is installed, we can issue
    ```console
    $ conda create --name <name of environment, e.g. empyrean> python=3.10
    ```

    Then type `y` in response to the question.

    Once the environment is created, it should be activated:
    ```console
    $ conda activate <name of environment chosen in previous step>
    ```

    From here forward, Python packages can be installed like normal using pip with `pip install` or conda with `conda install`.

    b. With Pip:

    If not using Conda, we may use Pip to create a venv (Pip's type of virtual environment). This is conceptually more complicated, but not that much harder to implement. To create a venv, run:
    ```console
    $ python -m venv /path/to/new/environment
    ```
    To activate this venv, run:
    ```console
    $ source path/to/venv/bin/activate
    ```

    After this, new packages should be able to be installed with `pip install`.

    <br>

2. Install Python requirements:

    The back-end of the application is written in Python, and this code uses third-party libraries to help do its job. These libraries must be installed.

    Navigate into the directory where the file `requirements.txt` is:
    ```console
    $ cd api
    ```

    Then, install all Python dependencies with:
    ```console
    $ pip install -r requirements.txt
    ```

    This will install all the python packages needed for production

    <br>

3. Configure python variables:

    In the same directory as the step above (`/api`), there will be another directory named `main`. Move to this directory with:
    ```console
    $ cd main
    ```

    Here, we can configure the Flask application. This must be done to instruct the Flask application what we're currently using it for. The Flask application is currently configured using Python objects, as described in the [Flask documentation](https://flask.palletsprojects.com/en/2.3.x/config/#development-production), and relies upon two files:

    1. `app_config.py`: contains settings per configuration type that instruct Flask about how to act, where to look for the database, what the database credentials are, and so on. The configurations are separated into Python classes, with the name of the class being the configuration we desire Flask to use.

    2. `.env`: contains the name of the configuration from `app_config.py` (the name of the Python class) that we want to use.

    Configuration settings that will be useful to change include:

    - DATA_FILEPATH: where FITS files will be stored
    - POSTGRES_USER: the Postgres username to use
    - POSTGRES_PW: the Postgres password to use
    - POSTGRES_DB: the name of the Postgres database to use

    <br>

4. Install npm requirements:

    The front-end of the project is built in React and, like the Python back-end, uses third-party libraries to help it do its job.

    Navigate back to the root directory of the project with:
    $ cd $(git rev-parse --show-toplevel)

    Now, to install the Node packages needed for React, run:

    ```console
    $ npm install
    ```

5. Set up the database
    The application requires a database to store its outputs, so we will provide one with Postgres.

    On MacOS, you may need to start Postgres as a service with:

    ```console
    $ brew services start postgres
    ```

    Open postgresql with:
    ```console
    $ psql -U postgres
    ```

    We are now in Postgres' own shell, **not** the shell we have been using at the commandline.

    The application will use two different databases for testing and development/production. Using the database names the application is configured to use by default:

    Create a new database with the name `empyrean` (for production) for the app with:
    ```sql
    CREATE DATABASE empyrean;
    ```

    Create a new database with the name `empyrean_test` (for testing the application, only useful for developers) for the app with:
    ```sql
    CREATE DATABASE empyrean_test;
    ```

    Now, exit psql:
    ```console
    \q
    ```

    The application will set up all tables for the user if it is started and finds a valid database at the URI provided in `app_config.py`.

   <br>

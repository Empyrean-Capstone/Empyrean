## Step 3: Serving the application and setting up the database

1. Install Nginx

   Nginx (pronounced "engine-x") will be used to host the React server. Install it with:

   On Ubuntu Linux:
   ```console
   $ sudo apt install nginx
   ```

   On MacOS:
   ```console
   $ brew install nginx
   ```

   <br>

2. Configure Nginx:

    Now we need to make it so that nginx can serve our files. In the root directory of the source code, we need to build our project with:

    ```console
    $ yarn build
    ```

    After this process has ended, there will be a directory named 'build' in the current working directory. The contents of this folder are the files that will be served.

    Run the following command to find the location of configuration files for Nginx:

    ```console
    $ nginx -t
    ```

    This command will output a file path. In the file at that path, navigate to where the below displayed configuration is and follow the instructions given in the comments below (the text after the octothorpe characters). The ellipses indicate any amount of text in the file that can be ignored and is not relevant to what we're doing.

    ```
    ...
    server {
        listen          8080; # Change this value to 80 to enable web communication
    ...
        location /{
            root        html; # Change this to the location of the build directory generated at the beginning of this step
            index       indes.html; # This should stay the same, but this is the root file to be served
            ...
        }
    ...
    }
    ```

    Now we need to start Nginx as a service with:

    On Ubuntu Linux:

    ```console
    $ sudo service start nginx
    ```

    On MacOS:
    ```console
    $ sudo brew services start nginx
    ```

    Now Nginx should start on machine startup and after power outages, allowing us to be able to serve our server automatically.

   <br>

3. Start Eventlet as a service

    We need to do the same process with the Flask server as we did with the React server (discussed in the step above).
    The server we will use, called Eventlet, was installed as a Python dependency and all of its configuration is already in the source code, so we must only set it up as a service.

    To run the flask server (not as a service), issue the following command in the project root directory:

    ```console
    $ python api/wsgi.py
    ```

    This will start up the server, ready for actual usage.

    To make sure this is functionality a service, we must add it to the operating system's service list.

    In Ubuntu Linux:

    First, find which Python version is being used. Make sure the virtual environment is activated, then run:
    ```console
    $ which python
    ```

    `Important 💡:` take note of this location

    We need to add a new entry to our systemd configuration. Navigate to `/etc/systemd/system`:

    ```console
    $ cd /etc/systemd/system
    ```
    Create the needed file:
    ```console
    $ touch empyrean.service
    ```

    Enter this file, then paste and subsequently edit the following contents (wherever there are angle brackets):
    ```
    [Unit]
    Description=A simple Flask API
    After=network.target

    [Service]
    User=ubuntu
    WorkingDirectory=</path/to/project/Empyrean/api>
    ExecStart=</path/to/python/from/earlier/python wsgi.py>
    Restart=always

    [Install]
    WantedBy=multi-user.target
    ```

    After this, run:
    ```console
    $ sudo systemctl daemon-reload
    ```

    If this worked, we can now run:
    ```console
    $ sudo systemctl start empyrean
    ```

    On MacOS:
    `Important 💡:` Jobs are run with `launchctl` and `launchd`

    First, we must find where our Python executable is. Ensure the environment is loaded as discussed in Step 2, then run:
    ```console
    $ which python
    ```

    `Important 💡:` take note of this location

    Navigate into the global agents directory (the user-agnostic global launches):
    ```console
    $ cd /Library/LaunchDaemons/
    ```

    To create the service, we need to create the corresponding file:
    ```console
    $ touch com.empyrean.plist
    ```

    If a domain name is intended, the above file should be named in reverse domain name notation, e.g the result of the above file name will be `empyrean.com`.

    Enter this file, then paste and subsequently edit the following contents (wherever there are curly brackets):
    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
        <plist version="1.0">
            <dict>
                <key>EnvironmentVariables</key>
                    <dict>
                        <key>PYTHONPATH</key>
                        <string>{/path/to/application/root}</string>
                    </dict>
                <key>Label</key>
                <string>com.empyrean</string>
                <key>ProgramArguments</key>
                <array>
                    <string>{/absolute/path/to/python}</string>
                    <string>{/absolute/path/to/executable/wsgi.py}</string>
                </array>
                <key>KeepAlive</key>
                <true/>
                <key>WorkingDirectory</key>
                <string>{/path/to/application/root}</string>
                <key>StandardErrorPath</key>
                <string>{/path/to/error/file.txt}</string>
                <key>StandardOutPath</key>
                <string>{/path/to/standard/output/file.txt}</string>
            </dict>
        </plist>
    ```

    `Important 💡:`
    - the string under the Label <key> is the argument to start the service
    - the string under the Program <key> tells the daemon what program to run. In this case, the python server
    - the KeepAlive <key> tells the computer to keep this service running in case it is not in whatever situation

    <br>

    Now we need to restart the daemon and make sure our service is running. Reboot with:
    ```console
    $ reboot
    ```
    Once done, this service should be active.

4. Start instruments as services

   Each of the instruments (the camera and spectrograph) can be run as a service, through the process in step 7 above.

   Note: the program to be run for the spectrograph, as an example, is python spectrograph.py

5. Ensure basic operation

    At this point, opening a browser, and navigating to:
    ```
    IP.OF.Computer/
    ```

    Should show the basic app, sans any information.

   <br>

6. Ensure Working product

    At this point, the base product should be working with a database, so everything should be set up.
    It is possible that the services created prior will need to be restarted in order to find the database.

    This can be done with:
    On Ubuntu Linux:
    To restart Nginx:

    ```console
    $ sudo systemctl restart nginx
    ```

    To restart the application:
    ```console
    $ sudo systemctl reload empyrean
    ```

    On MacOS:
    To restart Nginx:
    ```console
    $ sudo brew services reload nginx
    ```

    The commands below restart Eventlet. Replace the content in angle brackets with the name of the plist created in step 7:

    ```console
    $ sudo launchctl unload <name of plist>
    $ sudo launchctl load <name of plist>
    ```

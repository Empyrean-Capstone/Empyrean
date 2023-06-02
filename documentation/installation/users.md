#### Directions for Users
##### Choosing Your Instruments
All astronomical instruments that this application can manage, meaning cameras and spectrographs, have been defined in `/instrument_interfaces`. If you were to look in `/instrument_interfaces/camera`, for example, you would find folders containing code that allows our application to actually use the camera. Each subdirectory there will be named after a camera brand, e.g. `/instrument_interfaces/camera/zwo` for the ZWO ASI cameras.

To choose a camera and spectrograph for operation, you must properly configure the relevant Dockerfiles at in `/instrument_interfaces`. `Dockerfile.camera` provides instruction on what camera code to choose and how to set it up, and the same is true of `Dockerfile.spectrograph`.

##### Starting the Application
Once the source code and Docker are installed, you may start the application. Ensure that `/api/main/.env` contains only the line

```python
export FLASK_CFG_CLASS="ProductionConfig"
```

At the root of the repository (which you can find with the shell command `$git rev-parse --show-toplevel`) will be a file called `docker-compose.yaml`. This file provides instructions to Docker about what to build and where the instructions for how to build it are located. To build and start the application, issue the command

```console
$ sudo docker-compose up --build
```
This command may take some time, so please be patient. Once Docker is done, the application services (such as the front end and instruments) will start and you will see a notification similar to this in this in your console:

```
✔ Container empyrean_db_c       Running               0.0s
✔ Container empyrean_api_c      Recreated             0.0s
✔ Container empyrean_src_c      Recreated             0.3s
✔ Container empyrean_cam_c      Recreated             0.0s
✔ Container empyrean_spectro_c  Recreated             0.0s
```

##### Logging in for the first time
When the various containers have started, you may navigate to `http://localhost:3000` in your web browser and the application login should appear. The system comes with a default administrative user with a username of `admin` and a password of `password`.

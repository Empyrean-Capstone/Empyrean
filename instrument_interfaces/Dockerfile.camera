FROM python:3.11

WORKDIR /instrument_interfaces

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY __init__.py instrument.py simulated_camera.py ./

CMD ["python", "simulated_camera.py"]

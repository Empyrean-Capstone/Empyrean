from main import app, sio

if __name__ == "__main__":
    sio.run(app, host="0.0.0.0", debug=True)

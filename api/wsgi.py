from main import app, sio

if __name__ == "__main__":
    sio.run(app, debug=True )

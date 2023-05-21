class BaseConfig(object):
    DATA_FILEPATH="../fits_data/"
    DEV_PORT=5000
    POSTGRES_URL="127.0.0.1:5432"
    TESTING = False

    POSTGRES_USER = "postgres"
    POSTGRES_PW = "postgres"

    # name of Docker container holding database
    POSTGRES_HOST = "empyrean_db_c"

    SESSION_COOKIE_HTTPONLY = False
    SESSION_COOKIE_SAMESITE = "None"
    SESSION_COOKIE_SECURE = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    BASE_URI = f"postgresql://{POSTGRES_USER}:{POSTGRES_PW}@{POSTGRES_HOST}/"

class ProductionConfig(BaseConfig):
    POSTGRES_DB = "empyrean"
    SQLALCHEMY_DATABASE_URI = BaseConfig.BASE_URI + POSTGRES_DB

class TestingConfig(BaseConfig):
    POSTGRES_DB = "empyrean_test"
    SQLALCHEMY_DATABASE_URI = BaseConfig.BASE_URI + POSTGRES_DB
    TESTING = True

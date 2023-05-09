class BaseConfig(object):
    DATA_FILEPATH="../fits_data/"
    DEV_PORT=5000
    POSTGRES_URL="127.0.0.1:5432"
    TESTING = False

    POSTGRES_PW = "postgres"
    POSTGRES_USER = "postgres"

    SESSION_COOKIE_HTTPONLY = False
    SESSION_COOKIE_SAMESITE = "None"
    SESSION_COOKIE_SECURE = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    BASE_URI = f"postgresql://{POSTGRES_USER}:{POSTGRES_PW}@localhost/"

class ProductionConfig(BaseConfig):
    POSTGRES_DB = "empyrean"
    SQLALCHEMY_DATABASE_URI = BaseConfig.BASE_URI + POSTGRES_DB

class TestingConfig(BaseConfig):
    POSTGRES_DB = "empyrean_test"
    SQLALCHEMY_DATABASE_URI = BaseConfig.BASE_URI + POSTGRES_DB
    TESTING = True

class BaseConfig:
    DATA_FILEPATH = "../fits_data/"
    DEV_PORT = 5000
    POSTGRES_URL = "127.0.0.1:5432"

    POSTGRES_USER = "postgres"
    POSTGRES_PW = "postgres"

    SESSION_COOKIE_HTTPONLY = False
    SESSION_COOKIE_SAMESITE = "None"
    SESSION_COOKIE_SECURE = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class ProductionConfig(BaseConfig):
    # name of Docker container holding database
    POSTGRES_USER = BaseConfig.POSTGRES_USER
    POSTGRES_PW = BaseConfig.POSTGRES_PW
    POSTGRES_HOST = "empyrean_db_c"
    POSTGRES_DB = "empyrean"

    BASE_URI = f"postgresql://{POSTGRES_USER}:{POSTGRES_PW}@{POSTGRES_HOST}/"
    SQLALCHEMY_DATABASE_URI = BASE_URI + POSTGRES_DB
    TESTING = False


class TestingConfig(BaseConfig):
    POSTGRES_USER = BaseConfig.POSTGRES_USER
    POSTGRES_PW = BaseConfig.POSTGRES_PW
    POSTGRES_HOST = "empyrean_db_c"
    POSTGRES_DB = "empyrean_test"

    BASE_URI = f"postgresql://{POSTGRES_USER}:{POSTGRES_PW}@{POSTGRES_HOST}/"
    SQLALCHEMY_DATABASE_URI = BASE_URI + POSTGRES_DB
    TESTING = True


class LocalConfig(BaseConfig):
    POSTGRES_USER = BaseConfig.POSTGRES_USER
    POSTGRES_PW = BaseConfig.POSTGRES_PW
    POSTGRES_HOST = "localhost"
    POSTGRES_DB = "empyrean"

    BASE_URI = f"postgresql://{POSTGRES_USER}:{POSTGRES_PW}@{POSTGRES_HOST}/"
    SQLALCHEMY_DATABASE_URI = BASE_URI + POSTGRES_DB
    TESTING = True

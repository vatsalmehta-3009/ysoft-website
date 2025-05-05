import urllib
from sqlalchemy.engine.url import URL

DB_CONFIG = {
    'drivername': 'mssql+pymssql',
    'username': 'db_9eb5dd_zor_admin',
    'password': 'Zor@1234',
    'host': 'SQL5088.site4now.net',
    'port': 1433,
    'database': 'db_9eb5dd_zor'
}

SQLALCHEMY_DATABASE_URI = URL.create(**DB_CONFIG)
SECRET_KEY = "ysoft-project"
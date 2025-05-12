import urllib
from sqlalchemy.engine.url import URL

DB_CONFIG = {
    'drivername': 'mysql+pymysql',
    'username': 'vatsal3',  # Replace with your MySQL username
    'password': 'Vatsalmehta123',  # Replace with your MySQL password
    'host': '127.0.0.1',  # Use 'localhost' or '127.0.0.1' for GoDaddy MySQL connection
    'port': 3306,  # MySQL default port
    'database': 'master_lahmy'  # Your MySQL database name
}

SQLALCHEMY_DATABASE_URI = URL.create(**DB_CONFIG)
SECRET_KEY = "ysoft-project"
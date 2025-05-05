from sqlalchemy import create_engine
from sqlalchemy.engine.url import URL
from sqlalchemy import create_engine, text
import os

# You can even read these from environment variables for extra security
DB_CONFIG = {
    'drivername': 'mssql+pymssql',
    'username': 'db_9eb5dd_zor_admin',
    'password': 'Zor@1234',
    'host': 'SQL5088.site4now.net',
    'port': 1433,
    'database': 'db_9eb5dd_zor'
}
 
from sqlalchemy.engine.url import URL

SQLALCHEMY_DATABASE_URI = URL.create(**DB_CONFIG)
print("SQLALCHEMY_DATABASE_URI:",SQLALCHEMY_DATABASE_URI)
# Define the database configuration in a dictionary
db_config = {
    'drivername': 'mssql+pymssql',
    'username': 'db_9eb5dd_zor_admin',
    'password': 'Zor@1234',
    'host': 'SQL5088.site4now.net',
    'port': 1433,
    'database': 'db_9eb5dd_zor'
}

# Create the engine using the URL helper
engine = create_engine(URL.create(**db_config))

# Test the connection
with engine.connect() as connection:
    result = connection.execute(text("SELECT 1"))
    print("Connection successful:", result.scalar())


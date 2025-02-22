import urllib

server = 'localhost\\SQLEXPRESS'
database = 'master'
driver = 'ODBC Driver 17 for SQL Server'  # Ensure this driver is installed
# dummy
SQLALCHEMY_DATABASE_URI  = f'mssql+pyodbc://@{server}/{database}?driver={driver}&trusted_connection=yes'
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = "your_secret_key"

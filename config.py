import urllib

server = 'localhost\\SQLEXPRESS'
database = 'master'
driver = 'ODBC Driver 17 for SQL Server'  # Ensure this driver is installed

SQLALCHEMY_DATABASE_URI  = f'mssql+pyodbc://@{server}/{database}?driver={driver}&trusted_connection=yes'
SECRET_KEY = "ysoft-project"

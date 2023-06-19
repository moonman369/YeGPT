from mindsdb_sdk import connect
import os
from dotenv import load_dotenv

load_dotenv()

print(os.environ)

server = connect(
    login=os.environ["MINDSDB_EMAIL"], password=os.environ["MINDSDB_PASSWORD"]
)

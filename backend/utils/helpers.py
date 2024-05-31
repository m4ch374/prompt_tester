import os
from dotenv import load_dotenv, find_dotenv

def get_dotenv(key: str):
    load_dotenv(find_dotenv())
    return os.environ.get(key)

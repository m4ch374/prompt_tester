from dotenv import dotenv_values

def get_dotenv():
    values = dotenv_values(".env")
    return values

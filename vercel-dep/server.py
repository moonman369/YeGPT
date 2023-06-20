import json
import os
from sqlalchemy import create_engine
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(
    app, origins="http://localhost:3000", supports_credentials=True
)  # Set CORS headers for all routes


@app.route("/bot", methods=["POST"])
def kanye_bot():
    try:
        # Set CORS headers for the response
        headers = {
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Credentials": "true",
        }

        # Get the request data
        request_json = request.get_json()
        message = request_json["message"]

        # mindsdb is a MySQL db so these are the credentials
        user = os.environ["MINDSDB_EMAIL"]
        password = os.environ["MINDSDB_PASSWORD"]
        host = "cloud.mindsdb.com"
        port = 3306
        database = "mindsdb"

        # "mysql+pymysql://mightyayan26@gmail.com:ayan#123@cloud.mindsdb.com:3306/mindsdb"

        # initializing the db connection
        def get_connection(user, password, host, port, database):
            return create_engine(
                url="mysql+pymysql://{0}:{1}@{2}:{3}/{4}".format(
                    user, password, host, port, database
                )
            )

        try:
            engine = get_connection(user, password, host, port, database)
            print(f"Connection to {host} for user {user} created successfully.")
        except Exception as ex:
            print("Connection could not be made due to the following error: \n", ex)

        # Run the query
        with engine.connect() as eng:
            query = eng.execute(
                f"SELECT response from mindsdb.ye_gpt_6 WHERE author_username = '@user' AND text='{message}';"
            )
            results = []
            for row in query:
                row_dict = dict(row)
                results.append(row_dict)

            # Create a dictionary to store the results
            result_dict = {"results": results}

            # Convert the dictionary to a JSON format
            json_result = json.dumps(result_dict, ensure_ascii=False)

            # Return the response with CORS headers
            return (json_result, 200, headers)
    except Exception as ex:
        # Handle any errors that may occur during processing
        # Return an error response if needed
        return jsonify({"error": str(ex)}), 500


if __name__ == "__main__":
    app.run(host="localhost", port=8080)

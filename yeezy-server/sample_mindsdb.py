import json
import os
import threading
from mindsdb_sdk import connect
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
        host = "https://cloud.mindsdb.com"
        # port = 3306
        database = "mindsdb"

        # "mysql+pymysql://mightyayan26@gmail.com:ayan#123@cloud.mindsdb.com:3306/mindsdb"

        # initializing the db connection
        def connect_to_server(user, password, host):
            try:
                server = connect(url=host, login=user, password=password)
                print(f"Connection to {host} for user {user} created successfully.")
                return server
            except Exception as ex:
                print("Connection could not be made due to the following error: \n", ex)

        # try:
        #     engine = get_connection(user, password, host, port, database)
        #     print(f"Connection to {host} for user {user} created successfully.")
        # except Exception as ex:
        #     print("Connection could not be made due to the following error: \n", ex)

        # Run the query
        # thread = threading.Thread(target=connect_to_server, args=[user, password, host])
        # server = connect_to_server(user, password, host)
        # thread.start()
        # server = connect_to_server(user, password, host)
        # dbs = server.list_databases()
        # print("db", dbs, flush=True)
        # dbs = list(connect_to_server(user, password, host).list_databases())

        db = connect_to_server(user, password, host).get_database(database)
        query = db.query(
            f"SELECT response from mindsdb.ye_gpt_6 WHERE author_username = '@user' AND text='{message}';"
        )
        result = query.fetch()

        #     with engine.connect() as eng:
        #         query = eng.execute(
        #             f"SELECT response from mindsdb.ye_gpt_6 WHERE author_username = '@user' AND text='{message}';"
        #         )
        #         results = []
        #         for row in query:
        #             row_dict = dict(row)
        #             results.append(row_dict)

        #         # Create a dictionary to store the results
        results = []
        for row in result:
            row_dict = dict(row)
            results.append(row_dict)

        result_dict = {"results": results}

        #         # Convert the dictionary to a JSON format
        json_result = json.dumps(result_dict, ensure_ascii=False)

        #         # Return the response with CORS headers
        return (json_result, 200, headers)
    except Exception as ex:
        # Handle any errors that may occur during processing
        # Return an error response if needed
        return jsonify({"error": str(ex)}), 500


if __name__ == "__main__":
    app.run(host="localhost", port=8080)

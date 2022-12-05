import os
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="capstone_test_db",
    user="koseward",
    password="Kos_678030"
    )

cur = conn.cursor()

# use cur.execute to use regular sql commands to access the database

cur.close()
conn.close()

import sqlite3
from os import path, getcwd

db = path.join(getcwd(), 'database.db')


def query(q, arg=()):
    connection = sqlite3.connect(db)
    cursor = connection.cursor()

    cursor.execute(q, arg)
    results = cursor.fetchall()
    cursor.close()
    # connection.close()
    return results


def insert(q, arg=()):
    connection = sqlite3.connect(db)
    cursor = connection.cursor()

    cursor.execute(q, arg)

    connection.commit()
    result = cursor.lastrowid
    cursor.close()
    return result


def select(q, arg=()):
    connection = sqlite3.connect(db)
    cursor = connection.cursor()
    return cursor.execute(q, arg)


def delete(q, arg=()):
    connection = sqlite3.connect(db)
    cursor = connection.cursor()
    result = cursor.execute(q, arg)
    connection.commit()
    # connection.close()
    return result

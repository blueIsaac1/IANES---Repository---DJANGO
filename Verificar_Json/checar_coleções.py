from pymongo import MongoClient as mg

def connect_mongo():
    client = mg("mongodb://localhost:27017/")
    return client['IANES']

db = connect_mongo()
def listar_colecoes(db):
    """Retorna uma lista com os nomes de todas as coleções no banco de dados."""
    return db.list_collection_names()
a = listar_colecoes(db)
print(a)
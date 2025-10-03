import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db import Base, engine, SessionLocal
from app.models import User
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
import time

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    max_retries = 10
    delay = 3
    for i in range(max_retries):
        try:
            Base.metadata.drop_all(bind=engine)
            Base.metadata.create_all(bind=engine)
            break
        except OperationalError:
            time.sleep(delay)
    yield

@pytest.fixture(scope="function")
def db_session():
    connection = engine.connect()
    transaction = connection.begin()
    db = SessionLocal(bind=connection)
    yield db
    transaction.rollback()
    db.close()
    connection.close()

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

def test_create_user(client, db_session):
    response = client.post("/users/", json={"name": "Alice"})
    assert response.status_code == 200
    user = response.json()
    assert user["name"] == "Alice"

def test_list_users(client, db_session):
    response = client.get("/users/")
    assert response.status_code == 200
    users = response.json()
    assert isinstance(users, list)
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.models import Song
import time
from sqlalchemy.exc import OperationalError

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

def test_create_song(client):
    response = client.post("/songs/", json={
        "title": "Song A",
        "artist": "Artist A",
        "duration": "3:45"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Song A"
    assert data["artist"] == "Artist A"

def test_list_songs(client):
    response = client.get("/songs/")
    assert response.status_code == 200
    songs = response.json()
    assert isinstance(songs, list)
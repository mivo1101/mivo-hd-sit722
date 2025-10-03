import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.models import Song, Playlist

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
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

def test_create_playlist(client):
    # First, create dummy songs
    client.post("/playlists/")  # no songs yet, test only playlist creation
    response = client.post("/playlists/", json={"name": "My Playlist", "song_ids": []})
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "My Playlist"
    assert data["songs"] == []

def test_list_playlists(client):
    response = client.get("/playlists/")
    assert response.status_code == 200
    playlists = response.json()
    assert isinstance(playlists, list)
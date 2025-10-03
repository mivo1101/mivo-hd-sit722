from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, crud, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Playlist Service")

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/playlists/", response_model=schemas.Playlist)
def create_playlist(playlist: schemas.PlaylistCreate, db: Session = Depends(get_db)):
    return crud.create_playlist(db=db, playlist=playlist)

@app.get("/playlists/", response_model=list[schemas.Playlist])
def read_playlists(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_playlists(db, skip=skip, limit=limit)

@app.get("/playlists/{playlist_id}", response_model=schemas.Playlist)
def read_playlist(playlist_id: int, db: Session = Depends(get_db)):
    db_playlist = crud.get_playlist(db, playlist_id=playlist_id)
    if not db_playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")
    return db_playlist

@app.post("/playlists/{playlist_id}/add_songs", response_model=schemas.Playlist)
def add_songs(playlist_id: int, song_ids: list[int], db: Session = Depends(get_db)):
    playlist = crud.add_songs_to_playlist(db, playlist_id=playlist_id, song_ids=song_ids)
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")
    return playlist
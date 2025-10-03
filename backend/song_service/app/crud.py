from sqlalchemy.orm import Session
from . import models, schemas

def get_song(db: Session, song_id: int):
    return db.query(models.Song).filter(models.Song.id == song_id).first()

def get_songs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Song).offset(skip).limit(limit).all()

def create_song(db: Session, song: schemas.SongCreate):
    db_song = models.Song(title=song.title, artist=song.artist, duration=song.duration)
    db.add(db_song)
    db.commit()
    db.refresh(db_song)
    return db_song
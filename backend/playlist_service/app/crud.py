from sqlalchemy.orm import Session
from . import models, schemas

def create_playlist(db: Session, playlist: schemas.PlaylistCreate):
    db_playlist = models.Playlist(name=playlist.name)
    if playlist.song_ids:
        db_songs = db.query(models.Song).filter(models.Song.id.in_(playlist.song_ids)).all()
        db_playlist.songs = db_songs
    db.add(db_playlist)
    db.commit()
    db.refresh(db_playlist)
    return db_playlist

def get_playlist(db: Session, playlist_id: int):
    return db.query(models.Playlist).filter(models.Playlist.id == playlist_id).first()

def get_playlists(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Playlist).offset(skip).limit(limit).all()

def add_songs_to_playlist(db: Session, playlist_id: int, song_ids: list[int]):
    playlist = db.query(models.Playlist).filter(models.Playlist.id == playlist_id).first()
    if not playlist:
        return None
    songs = db.query(models.Song).filter(models.Song.id.in_(song_ids)).all()
    playlist.songs.extend(songs)
    db.commit()
    db.refresh(playlist)
    return playlist
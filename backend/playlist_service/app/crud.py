from pydantic import BaseModel
from typing import List

class SongBase(BaseModel):
    id: int
    title: str
    artist: str
    duration: str

    class Config:
        orm_mode = True

class PlaylistCreate(BaseModel):
    name: str
    song_ids: List[int] = []  # IDs of songs to add

class Playlist(BaseModel):
    id: int
    name: str
    songs: List[SongBase] = []

    class Config:
        orm_mode = True
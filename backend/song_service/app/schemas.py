from pydantic import BaseModel

class SongCreate(BaseModel):
    title: str
    artist: str
    duration: str

class Song(BaseModel):
    id: int
    title: str
    artist: str
    duration: str

    class Config:
        orm_mode = True
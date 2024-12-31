import { Injectable } from '@nestjs/common';

@Injectable()
export class SongsService {
  // local db
  // local array

  private readonly songs = [];
  create(song: any) {
    // save the song in the database
    this.songs.push(song);
    return this.songs;
  }
  findAll() {
    // fetch the song from the db
    // error comes thile fetching the data from DB
    throw new Error('error in db connection.');
    return this.songs;
  }
}

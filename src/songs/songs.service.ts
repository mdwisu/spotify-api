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
    return this.songs;
  }
}

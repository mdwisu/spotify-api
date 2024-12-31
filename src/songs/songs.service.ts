import { Injectable, Scope } from '@nestjs/common';

@Injectable({
  scope: Scope.TRANSIENT, // Scope.TRANSIENT digunakan untuk membuat provider dengan instance yang baru setiap kali provider tersebut di-inject ke dalam kelas lain.
})
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
    // throw new Error('error in db connection.');
    return this.songs;
  }
}

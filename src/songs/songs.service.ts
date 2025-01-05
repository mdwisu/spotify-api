import { HttpException, HttpStatus, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './entities/song.entity';
import { CreateSongDto } from './dto/create-song-dto';
import { UpdateSongDto } from './dto/update-song.dto';

@Injectable({
  scope: Scope.DEFAULT, // Scope.TRANSIENT digunakan untuk membuat provider dengan instance yang baru setiap kali provider tersebut di-inject ke dalam kelas lain.
})
export class SongsService {
  constructor(
    @InjectRepository(Song) private songRepository: Repository<Song>,
  ) {}

  create(createSongDto: CreateSongDto) {
    const song = new Song();
    song.title = createSongDto.title;
    song.artists = createSongDto.artists;
    song.duration = createSongDto.duration;
    song.lyrics = createSongDto.lyrics;
    song.releaseDate = createSongDto.releaseDate;

    return this.songRepository.save(song);
  }
  findAll() {
    return this.songRepository.find();
  }

  findOne(id: number) {
    return this.songRepository.findOneBy({ id });
  }

  async update(id: number, updateSongDto: UpdateSongDto) {
    const song = await this.songRepository.findOneBy({ id });
    if (!song) {
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
    }
    Object.assign(song, updateSongDto);
    return this.songRepository.save(song);
  }

  async remove(id: number) {
    const deleteSong = await this.songRepository.delete(id);
    if (deleteSong.affected === 0) {
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
    } else {
      return {
        message: 'Song deleted successfully',
        id: id,
        affected: deleteSong.affected,
      };
    }
  }
}

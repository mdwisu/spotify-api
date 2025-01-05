import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { In, Repository } from 'typeorm';
import { Song } from '../songs/song.entity';
import { User } from '../users/entities/user.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createPlaylistDto: CreatePlaylistDto) {
    const playlist = new Playlist();
    playlist.name = createPlaylistDto.name;

    const songs = await this.songRepository.find({
      where: {
        id: In(createPlaylistDto.songs),
      },
    });
    const missingIds = createPlaylistDto.songs.filter(
      (id) => !songs.find((song) => song.id === id),
    );

    if (missingIds.length > 0) {
      throw new NotFoundException(`Songs not found: ${missingIds.join(', ')}`);
    }
    playlist.songs = songs;

    const user = await this.userRepository.findOne({
      where: {
        id: createPlaylistDto.user,
      },
    });
    if (!user) {
      throw new NotFoundException(`User not found: ${createPlaylistDto.user}`);
    }
    playlist.user = user;

    return this.playlistRepository.save(playlist);
  }
}

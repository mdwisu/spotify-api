import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';
import { Playlist } from './entities/playlist.entity';
import { Song } from '../songs/song.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist, Song, User])],
  providers: [PlaylistsService],
  controllers: [PlaylistsController],
})
export class PlaylistsModule {}

import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { connection } from '../common/constants/connection';
import { Song } from './entities/song.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Artist } from '../artists/artist.entity';

// const mockSongsService = {
//   findAll: () => [{ id: 1, title: 'song 1', artists: ['artist 1'] }],
// };

@Module({
  imports: [TypeOrmModule.forFeature([Song, Artist]), ConfigModule],
  controllers: [SongsController],
  providers: [
    //standard provider
    SongsService,
    //! class provider
    // {
    //   provide: SongsService,
    //   useClass: SongsService,
    // },
    //! value mock provider
    // {
    //   provide: SongsService,
    //   useValue: mockSongsService,
    // },
    { provide: 'CONNECTION', useValue: connection },
  ],
})
export class SongsModule {}

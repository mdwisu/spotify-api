import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { connection } from '../common/constants/connection';

// const mockSongsService = {
//   findAll: () => [{ id: 1, title: 'song 1', artists: ['artist 1'] }],
// };

@Module({
  controllers: [SongsController],
  providers: [
    //standard provider
    SongsService,
    //! class provider
    // {
    //   provide: SongsService,
    //   useClass: SongsService,
    // },
    //! value provider
    // {
    //   provide: SongsService,
    //   useValue: mockSongsService,
    // },
    { provide: 'CONNECTION', useValue: connection },
  ],
})
export class SongsModule {}

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { SongsController } from './songs/songs.controller';
import { DevConfigService } from './common/providers/DevConfigService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistsModule } from './playlists/playlists.module';
import { Song } from './songs/song.entity';
import { Playlist } from './playlists/entities/playlist.entity';
import { TestModule } from './test/test.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { Artist } from './artists/artist.entity';
import { DataSource } from 'typeorm';

const devConfig = { port: 3000 };
const proConfig = { port: 400 };

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres', // ganti dengan username database anda
      password: 'postgredwi', // ganti dengan password database anda
      database: 'db_spotify',
      entities: [User, Playlist, Song, Artist],
      synchronize: true,
    }),
    SongsModule,
    PlaylistsModule,
    UsersModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: DevConfigService,
      useClass: DevConfigService,
    },
    // factory providers
    {
      provide: 'CONFIG',
      useFactory: () => {
        return process.env.NODE_ENV === 'development' ? devConfig : proConfig;
      },
    },
  ],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {
    console.log('dbname', dataSource.driver.database);
  }
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('songs'); // option no 1
    // consumer
    //   .apply(LoggerMiddleware)
    //   .forRoutes({ path: 'songs', method: RequestMethod.POST }); // option no 2
    consumer.apply(LoggerMiddleware).forRoutes(SongsController);
  }
}

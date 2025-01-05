import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Scope,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song-dto';
import { UpdateSongDto } from './dto/update-song.dto';
// import { Connection } from '../common/constants/connection';

@Controller({
  path: 'songs',
  scope: Scope.REQUEST, // mengindikasikan bahwa controller ini akan dibuat untuk setiap request HTTP yang diterima.
})
export class SongsController {
  constructor(
    private songService: SongsService,
    // @Inject('CONNECTION') private connection: Connection,
  ) {
    // console.log('this is connection string', this.connection);
  }
  @Post()
  create(@Body() createSongDto: CreateSongDto) {
    return this.songService.create(createSongDto);
  }
  @Get()
  findAll() {
    try {
      return this.songService.findAll();
    } catch (error) {
      throw new HttpException(
        'Server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }
  @Get(':id')
  findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    return this.songService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSongDto: UpdateSongDto) {
    return this.songService.update(+id, updateSongDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.songService.remove(+id);
  }
}

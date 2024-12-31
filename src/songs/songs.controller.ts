import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Scope,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song-dto';
import { Connection } from '../common/constants/connection';

@Controller({
  path: 'songs',
  scope: Scope.REQUEST, // mengindikasikan bahwa controller ini akan dibuat untuk setiap request HTTP yang diterima.
})
export class SongsController {
  constructor(
    private songService: SongsService,
    @Inject('CONNECTION') private connection: Connection,
  ) {
    console.log('this is connection string', this.connection);
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
      throw new HttpException('error', HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error,
      });
    }
  }
  @Get(':id')
  findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return `This action returns a #${typeof id} song`;
  }
  @Put(':id')
  update(@Param('id') id: string) {
    return `This action updates a #${id} song`;
  }
  @Delete(':id')
  delete(@Param('id') id: string) {
    return `This action removes a #${id} song`;
  }
}

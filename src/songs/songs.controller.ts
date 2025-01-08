import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song-dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Song } from './entities/song.entity';
// import { Connection } from '../common/constants/connection';

@Controller({
  path: 'songs',
})
export class SongsController {
  constructor(private songService: SongsService) {}
  @Post()
  create(@Body() createSongDto: CreateSongDto) {
    return this.songService.create(createSongDto);
  }
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    try {
      limit = limit > 100 ? 100 : limit;
      return this.songService.findAll({ page, limit });
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
  @Get('/paginate')
  findAllPaginate(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Song>> {
    try {
      limit = limit > 100 ? 100 : limit;
      return this.songService.paginate({
        page,
        limit,
        route: 'http://songs.com/cats',
      });
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

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song-dto';

@Controller('songs')
export class SongsController {
  constructor(private songService: SongsService) {}
  @Post()
  create(@Body() createSongDto: CreateSongDto) {
    return this.songService.create(createSongDto);
  }
  @Get()
  findAll() {
    return this.songService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} song`;
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

import { HttpException, HttpStatus, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Song } from './entities/song.entity';
import { CreateSongDto } from './dto/create-song-dto';
import { UpdateSongDto } from './dto/update-song.dto';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { ConfigService } from '@nestjs/config';
import { Artist } from '../artists/artist.entity';

@Injectable({
  scope: Scope.DEFAULT, // Scope.TRANSIENT digunakan untuk membuat provider dengan instance yang baru setiap kali provider tersebut di-inject ke dalam kelas lain.
})
export class SongsService {
  constructor(
    @InjectRepository(Song) private songRepository: Repository<Song>,
    @InjectRepository(Artist) private artistRepository: Repository<Artist>,
  ) {}

  async create(createSongDto: CreateSongDto) {
    const artists = await this.artistRepository.find({
      where: {
        id: In(createSongDto.artists),
      },
    });

    const song = this.songRepository.create({
      ...createSongDto,
      artists,
    });
    console.log('song', song);
    return this.songRepository.save(song);
  }
  async findAll({ page, limit }: { page: number; limit: number }) {
    const [data, total] = await this.songRepository.findAndCount({
      skip: (page - 1) * limit, // Lewati data sesuai halaman
      take: limit, // Ambil jumlah item per halaman
      order: { title: 'ASC' }, // Opsional: Sorting data
    });
    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    const queryBuilder = this.songRepository.createQueryBuilder('song');
    queryBuilder.orderBy('song.releaseDate', 'DESC');
    return paginate<Song>(this.songRepository, options);
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

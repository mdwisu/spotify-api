import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Song } from '../songs/song.entity';

@Entity('artists') // Nama tabel di database
export class Artist {
  @PrimaryGeneratedColumn() // ID otomatis increment
  id: number;

  @Column({ length: 100 }) // Nama artist dengan maksimal 100 karakter
  name: string;

  @ManyToMany(() => Song, (song) => song.artists)
  songs: string[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Song } from '../../songs/entities/song.entity';
import { User } from '../../users/entities/user.entity';

@Entity('artists') // Nama tabel di database
export class Artist {
  @PrimaryGeneratedColumn() // ID otomatis increment
  id: number;

  @OneToOne(() => User, (user) => user.artist)
  @JoinColumn()
  user: User;

  @ManyToMany(() => Song, (song) => song.artists)
  songs: string[];
}

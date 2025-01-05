import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Song } from '../../songs/entities/song.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Song, (song) => song.playlist)
  @JoinTable()
  songs: Song[];

  @ManyToOne(() => User, (user) => user.playlists)
  @JoinColumn({ name: 'userId' })
  user: User;
}

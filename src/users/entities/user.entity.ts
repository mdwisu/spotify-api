import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Playlist } from '../../playlists/entities/playlist.entity';
import { Artist } from '../../artists/artist.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @OneToOne(() => Artist, (artist) => artist.user)
  artist: Artist;

  // @OneToMany(() => Playlist, (playlist) => playlist.user)
  // playlists: Playlist[];
}

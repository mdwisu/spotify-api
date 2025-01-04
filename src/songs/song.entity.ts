import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Playlist } from '../playlists/playlist.entity';
import { Artist } from '../artists/artist.entity';

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  releaseDate: Date;

  @Column()
  duration: Date;

  @ManyToMany(() => Artist, (artist) => artist.songs)
  @JoinTable({ name: 'songs_artists' })
  artists: Artist[];

  @ManyToOne(() => Playlist, (playlist) => playlist.songs)
  @JoinColumn({ name: 'playlistId' })
  playlist: Playlist;
}

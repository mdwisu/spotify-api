import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Playlist } from '../../playlists/entities/playlist.entity';
import { Artist } from '../../artists/artist.entity';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('date')
  releaseDate: Date;

  @Column('time')
  duration: Date;

  @Column('text', { nullable: true })
  lyrics: string;

  @ManyToMany(() => Artist, (artist) => artist.songs)
  @JoinTable({ name: 'songs_artists' })
  artists: Artist[];

  @ManyToMany(() => Playlist, (playlist) => playlist.songs)
  playlist: Playlist[];
}

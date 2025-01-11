import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Artist } from '../../artists/entities/artist.entity';
import { Exclude } from 'class-transformer';

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

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ nullable: true, unique: true })
  googleId: string;

  @Column({ nullable: true, unique: true })
  githubId: string;

  @OneToOne(() => Artist, (artist) => artist.user)
  artist: Artist;

  // @OneToMany(() => Playlist, (playlist) => playlist.user)
  // playlists: Playlist[];
}

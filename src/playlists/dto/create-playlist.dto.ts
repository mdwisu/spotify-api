import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreatePlaylistDto {
  @ApiProperty({
    default: 'New Playlist',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: 'Array of song IDs',
    type: [Number],
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  readonly songs: number[];

  @ApiProperty({
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;
}

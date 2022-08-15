import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({ id: true, timestamps: true, versionKey: false })
export class User {
  @ApiProperty()
  @Prop({ unique: true })
  readonly username: string = "";

  @ApiProperty()
  @Prop({ select: false })
  readonly password: string = "";

  @ApiProperty()
  @Prop({ select: false })
  readonly refreshToken: string = null;
}

export const UserSchema = SchemaFactory.createForClass(User);

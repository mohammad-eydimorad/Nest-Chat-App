import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

@Schema({ versionKey: false })
export class User extends AbstractDocument {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;
}

const UserSchemaDef = SchemaFactory.createForClass(User);
UserSchemaDef.methods.toJSON = function (): User {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UserSchema = UserSchemaDef;

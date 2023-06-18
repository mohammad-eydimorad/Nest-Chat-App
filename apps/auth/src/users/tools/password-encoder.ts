import * as bcrypt from 'bcrypt';

export class PasswordEncoder {
  static async encodePassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  static async comparePasswords(password1: string, password2: string) {
    return await bcrypt.compare(password1, password2);
  }
}

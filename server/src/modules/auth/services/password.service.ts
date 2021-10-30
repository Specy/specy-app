import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { checkStrenght,passwordStrength } from 'src/lib/passwordStrength';

@Injectable()
export class PasswordService {
  /**
   * Checks if the password is valid using bcrypt.
   * @param password The raw text password
   * @param passwordHash The hashed password to be checked against
   * @returns True if the password is valid, false otherwise
   */
  async validatePassword(password: string, passwordHash: string) {
    return bcrypt.compare(password, passwordHash);
  }
  /**
   *
   * @param password  Raw text to be hashed
   * @param saltOrRounds Salt or rounds to be used, optional. Defaults to 10.
   * @returns The hashed password
   */
  async hashPassword(password: string, saltOrRounds?: number | string) {
    return bcrypt.hash(password, saltOrRounds ?? 10);
  }
  getStrength(password: string):passwordStrength {
    return checkStrenght(password);
  }
}

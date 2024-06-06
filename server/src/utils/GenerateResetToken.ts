/* eslint-disable @typescript-eslint/no-explicit-any */
import { Token } from '../database';
import * as crypto from 'crypto';
import bcrypt from 'bcrypt';

const generateResetToken = async (id: any) =>{
  if(!id) return;
  const token = await Token.findOne({ userId: id });

  // if token exists delete
  if (token){ 
    await token.deleteOne();
  }

  const resetToken = crypto.randomBytes(64).toString('hex');
  const hash = await bcrypt.hash(resetToken, Number(10));
  await new Token({
    userId: id,
    token: hash,
    createdAt: Date.now(),
  }).save();

  return `aitlin.vercel.app/password/reset/${resetToken}/${id}`;
};

export default generateResetToken;
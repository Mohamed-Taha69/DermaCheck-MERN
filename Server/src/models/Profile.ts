import { Schema, model, Document } from 'mongoose';

export interface IProfile extends Document {
  userId: string;
  full_name?: string;
  username?: string;
  website?: string;
  age?: number;
  gender?: string;
  skin_type?: string;
  role?: string;
  phone?: string;
  city?: string;
}

const ProfileSchema = new Schema<IProfile>(
  {
    userId:    { type: String, required: true, unique: true },
    full_name: String,
    username:  String,
    website:   String,
    age:       Number,
    gender:    String,
    skin_type: String,
    role:      String,
    phone:     String,
    city:      String,
  },
  { timestamps: true }
);

const Profile = model<IProfile>('Profile', ProfileSchema);
export default Profile;

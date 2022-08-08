import { User as FirebaseUser } from 'firebase/auth';
import { Athlete } from '../generated/graphql';

export type StravaUser = {
  athlete: Athlete;
};

export type User = FirebaseUser & {
  strava?: StravaUser;
};

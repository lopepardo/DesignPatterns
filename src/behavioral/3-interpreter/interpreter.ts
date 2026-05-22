export type User = {
  age: number;
  country: string;
  isPremium: boolean;
};

type UserRule = (user: User) => boolean;

export const isPremium: UserRule = (user) => {
  return user.isPremium;
};

export const countryIs =
  (country: string): UserRule =>
  (user) => {
    return user.country === country;
  };

export const minimumAge =
  (age: number): UserRule =>
  (user) => {
    return user.age >= age;
  };

export const and =
  (left: UserRule, right: UserRule): UserRule =>
  (user) => {
    return left(user) && right(user);
  };

export const or =
  (left: UserRule, right: UserRule): UserRule =>
  (user) => {
    return left(user) || right(user);
  };

export const not =
  (rule: UserRule): UserRule =>
  (user) => {
    return !rule(user);
  };

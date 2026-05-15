type User = {
  id: string;
  fullName: string;
  email: string;
};

export type ExternalUserResponse = {
  user_id: number;
  first_name: string;
  last_name: string;
  contact: {
    email_address: string;
  };
};

export const adaptExternalUser = (response: ExternalUserResponse): User => {
  return {
    id: String(response.user_id),
    fullName: `${response.first_name} ${response.last_name}`,
    email: response.contact.email_address,
  };
};

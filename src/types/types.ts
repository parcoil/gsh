export type Site = {
  id: number;
  created_at: string;
  site_name: string;
  site_url: string;
  site_image: string;
  site_description: string;
};

export type User = {
  id: string;
  email: string;
  username?: string;
};
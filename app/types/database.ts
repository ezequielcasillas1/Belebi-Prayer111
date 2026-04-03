export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          country: string;
          country_code: string;
          flag: string;
          denomination: string;
          is_verified_leader: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name: string;
          country: string;
          country_code: string;
          flag: string;
          denomination: string;
          is_verified_leader?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          country?: string;
          country_code?: string;
          flag?: string;
          denomination?: string;
          is_verified_leader?: boolean;
          updated_at?: string;
        };
      };
      churches: {
        Row: {
          id: string;
          name: string;
          denomination: string;
          invite_code: string;
          creator_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          denomination: string;
          invite_code: string;
          creator_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          denomination?: string;
          invite_code?: string;
          updated_at?: string;
        };
      };
      church_members: {
        Row: {
          id: string;
          user_id: string;
          church_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          church_id: string;
          joined_at?: string;
        };
        Update: {
          user_id?: string;
          church_id?: string;
        };
      };
      church_prayers: {
        Row: {
          id: string;
          church_id: string;
          author_id: string;
          request_text: string;
          created_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          church_id: string;
          author_id: string;
          request_text: string;
          created_at?: string;
          expires_at?: string | null;
        };
        Update: {
          request_text?: string;
          expires_at?: string | null;
        };
      };
      prayer_responses: {
        Row: {
          id: string;
          prayer_id: string;
          author_id: string;
          prayer_text: string;
          sent_at: string;
        };
        Insert: {
          id?: string;
          prayer_id: string;
          author_id: string;
          prayer_text: string;
          sent_at?: string;
        };
        Update: {
          prayer_text?: string;
        };
      };
      answered_prayers: {
        Row: {
          id: string;
          user_id: string;
          prayer_request_id: string | null;
          testimony_text: string;
          is_public: boolean;
          answered_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          prayer_request_id?: string | null;
          testimony_text: string;
          is_public?: boolean;
          answered_at?: string;
          created_at?: string;
        };
        Update: {
          testimony_text?: string;
          is_public?: boolean;
        };
      };
      user_milestones: {
        Row: {
          id: string;
          user_id: string;
          milestone_key: string;
          achieved_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          milestone_key: string;
          achieved_at?: string;
        };
        Update: {
          milestone_key?: string;
        };
      };
    };
    Views: {};
    Functions: {};
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Church = Database['public']['Tables']['churches']['Row'];
export type ChurchMember = Database['public']['Tables']['church_members']['Row'];
export type ChurchPrayer = Database['public']['Tables']['church_prayers']['Row'];
export type PrayerResponse = Database['public']['Tables']['prayer_responses']['Row'];

export interface ChurchWithMemberCount extends Church {
  member_count: number;
}

export interface ChurchPrayerWithAuthor extends ChurchPrayer {
  author: {
    first_name: string;
    country: string;
    flag: string;
  };
  responses_count: number;
}

export interface AnsweredPrayer {
  id: string;
  user_id: string;
  prayer_request_id: string | null;
  testimony_text: string;
  is_public: boolean;
  answered_at: string;
  created_at: string;
}

export interface PublicTestimony extends AnsweredPrayer {
  author: {
    first_name: string;
    flag: string;
  };
}

export interface UserMilestone {
  id: string;
  user_id: string;
  milestone_key: string;
  achieved_at: string;
}

export type MilestoneKey = 
  | 'faithful_intercessor'    // First 10 prayers
  | 'steadfast_in_prayer'     // 7-day streak
  | 'nations_advocate'        // Prayed for 10+ countries
  | 'church_pillar'           // Active in 3+ church groups
  | 'emergency_responder'     // Prayed for emergency requests
  | 'prayer_warrior'          // 50 prayers sent
  | 'intercessor_100'         // 100 prayers sent
  | 'daily_devoted';          // 30-day streak

import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Int8 = ColumnType<string, bigint | number | string, bigint | number | string>;

export type Json = JsonValue;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type MissionsStatusEnum = "admin" | "independent" | "service";

export type StartupsPhaseEnum = "acceleration" | "alumni" | "construction" | "investigation" | "success" | "transfer";

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type UsersDomaineEnum = "Animation" | "Autre" | "Coaching" | "Data" | "Déploiement" | "Design" | "Développement" | "Intraprenariat" | "Produit";

export interface Accounts {
  access_token: string | null;
  expires_at: Int8 | null;
  id: Generated<number>;
  id_token: string | null;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  scope: string | null;
  session_state: string | null;
  token_type: string | null;
  type: string;
  userId: string;
}

export interface BadgeRequests {
  created_at: Generated<Timestamp>;
  dossier_number: number | null;
  ds_token: string | null;
  end_date: Timestamp;
  id: Generated<number>;
  request_id: string;
  start_date: Timestamp;
  status: string | null;
  updated_at: Generated<Timestamp>;
  username: string;
}

export interface Community {
  admin: number | null;
  animation: number | null;
  autre: number | null;
  coaching: number | null;
  date: Timestamp | null;
  deploiement: number | null;
  design: number | null;
  developpement: number | null;
  female: number | null;
  independent: number | null;
  intraprenariat: number | null;
  male: number | null;
  nsp: number | null;
  other: number | null;
  produit: number | null;
  service: number | null;
}

export interface Events {
  action_code: string;
  action_metadata: string | null;
  action_on_username: string | null;
  created_at: Generated<Timestamp>;
  created_by_username: string;
  id: Generated<string>;
}

export interface Formations {
  airtable_id: string | null;
  created_at: Generated<Timestamp>;
  formation_date: Generated<Timestamp>;
  formation_type: string | null;
  formation_type_airtable_id: string | null;
  id: Generated<string>;
  is_embarquement: boolean | null;
  name: string;
}

export interface Incubators {
  address: string | null;
  contact: string | null;
  description: string | null;
  ghid: string | null;
  github: string | null;
  owner_id: string | null;
  short_description: string | null;
  title: string;
  uuid: Generated<string>;
  website: string | null;
}

export interface KnexMigrations {
  batch: number | null;
  id: Generated<number>;
  migration_time: Timestamp | null;
  name: string | null;
}

export interface KnexMigrationsLock {
  index: Generated<number>;
  is_locked: number | null;
}

export interface LoginTokens {
  created_at: Generated<Timestamp>;
  email: string;
  expires_at: Timestamp;
  token: string;
  username: string;
}

export interface Marrainage {
  completed: Generated<boolean>;
  count: Generated<number>;
  created_at: Generated<Timestamp>;
  last_onboarder: string;
  last_updated: Generated<Timestamp>;
  username: string;
}

export interface MarrainageGroups {
  count: Generated<number>;
  created_at: Generated<Timestamp | null>;
  id: Generated<number>;
  onboarder: string | null;
  status: Generated<string | null>;
}

export interface MarrainageGroupsMembers {
  marrainage_group_id: Int8;
  username: string;
}

export interface MattermostMemberInfos {
  last_activity_at: Timestamp | null;
  mattermost_user_id: string | null;
  username: Generated<string | null>;
}

export interface Missions {
  employer: string | null;
  end: Timestamp | null;
  id: Generated<number>;
  start: Timestamp;
  status: MissionsStatusEnum | null;
  user_id: string | null;
  uuid: Generated<string>;
}

export interface MissionsStartups {
  mission_id: string;
  startup_id: string;
  uuid: Generated<string>;
}

export interface Newsletters {
  created_at: Generated<Timestamp>;
  id: Generated<string>;
  sent_at: Timestamp | null;
  url: string;
  validator: string | null;
  year_week: string | null;
}

export interface Organizations {
  acronym: string | null;
  domaine_ministeriel: string;
  ghid: string | null;
  name: string;
  type: string;
  uuid: Generated<string>;
}

export interface Phases {
  comment: string | null;
  end: Timestamp | null;
  name: StartupsPhaseEnum;
  start: Timestamp;
  startup_id: string;
  uuid: Generated<string>;
}

export interface PullRequests {
  created_at: Generated<Timestamp>;
  info: Json | null;
  startup: string | null;
  status: Generated<string | null>;
  type: Generated<string | null>;
  updated_at: Generated<Timestamp>;
  url: Generated<string | null>;
  username: string | null;
}

export interface Sessions {
  expires: Timestamp;
  id: Generated<number>;
  sessionToken: string;
  userId: string;
}

export interface StartupEvents {
  comment: string | null;
  date: Timestamp;
  name: string;
  startup_id: string | null;
  uuid: Generated<string>;
}

export interface Startups {
  accessibility_status: string | null;
  analyse_risques: boolean | null;
  analyse_risques_url: string | null;
  budget_url: string | null;
  contact: string | null;
  created_at: Generated<Timestamp>;
  dashlord_url: string | null;
  description: string | null;
  ghid: string;
  incubator_id: string | null;
  link: string | null;
  mailing_list: string | null;
  mon_service_securise: boolean | null;
  name: string;
  pitch: string | null;
  repository: string | null;
  stats: boolean | null;
  stats_url: string | null;
  techno: Json | null;
  thematiques: Json | null;
  updated_at: Generated<Timestamp>;
  usertypes: Json | null;
  uuid: Generated<string>;
}

export interface StartupsFiles {
  /**
   * Contenu base64 du document
   */
  base64: Buffer | null;
  comments: string | null;
  created_at: Generated<Timestamp>;
  /**
   * User qui a déposé le document
   */
  created_by: string;
  /**
   * Metadonnées du document
   */
  data: Json | null;
  deleted_at: Timestamp | null;
  /**
   * User qui a détruit le document
   */
  deleted_by: string | null;
  /**
   * Nom du document
   */
  filename: string | null;
  /**
   * Taille du document en octets
   */
  size: number | null;
  startup_id: string;
  /**
   * Titre du document
   */
  title: string | null;
  /**
   * Type de document
   */
  type: string | null;
  uuid: Generated<string>;
}

export interface StartupsOrganizations {
  organization_id: string;
  startup_id: string;
  uuid: Generated<string>;
}

export interface Tasks {
  created_at: Generated<Timestamp>;
  description: string | null;
  error_message: string | null;
  last_completed: Timestamp | null;
  last_failed: Timestamp | null;
  name: string;
  updated_at: Generated<Timestamp>;
}

export interface Teams {
  created_at: Generated<Timestamp>;
  ghid: string | null;
  incubator_id: string;
  mission: string | null;
  name: string;
  updated_at: Generated<Timestamp>;
  uuid: Generated<string>;
}

export interface UserDetails {
  active: boolean | null;
  average_nb_of_days: number | null;
  domaine: string | null;
  gender: Generated<string | null>;
  hash: string;
  nb_days_at_beta: number | null;
  tjm: number | null;
}

export interface Users {
  avatar: string | null;
  average_nb_of_days: number | null;
  bio: string | null;
  communication_email: Generated<string | null>;
  competences: Json | null;
  created_at: Generated<Timestamp>;
  domaine: UsersDomaineEnum;
  email_is_redirection: Generated<boolean | null>;
  email_verified: Timestamp | null;
  fullname: string;
  gender: Generated<string | null>;
  github: string | null;
  legal_status: string | null;
  link: string | null;
  member_type: string | null;
  osm_city: string | null;
  primary_email: string | null;
  primary_email_status: Generated<string | null>;
  primary_email_status_updated_at: Generated<Timestamp | null>;
  role: string;
  secondary_email: string | null;
  tjm: number | null;
  updated_at: Generated<Timestamp>;
  username: string;
  uuid: Generated<string>;
  workplace_insee_code: string | null;
}

export interface UsersFormations {
  formation_id: string | null;
  username: string | null;
}

export interface UsersStartups {
  startup_id: string;
  user_id: string;
}

export interface UsersTeams {
  team_id: string;
  user_id: string;
  uuid: Generated<string>;
}

export interface VerificationTokens {
  expires: Timestamp;
  identifier: string;
  token: string;
}

export interface Visits {
  created_at: Generated<Timestamp>;
  date: Timestamp;
  fullname: string;
  id: Generated<number>;
  number: string;
  referent: string;
  requester: string;
}

export interface DB {
  accounts: Accounts;
  badge_requests: BadgeRequests;
  community: Community;
  events: Events;
  formations: Formations;
  incubators: Incubators;
  knex_migrations: KnexMigrations;
  knex_migrations_lock: KnexMigrationsLock;
  login_tokens: LoginTokens;
  marrainage: Marrainage;
  marrainage_groups: MarrainageGroups;
  marrainage_groups_members: MarrainageGroupsMembers;
  mattermost_member_infos: MattermostMemberInfos;
  missions: Missions;
  missions_startups: MissionsStartups;
  newsletters: Newsletters;
  organizations: Organizations;
  phases: Phases;
  pull_requests: PullRequests;
  sessions: Sessions;
  startup_events: StartupEvents;
  startups: Startups;
  startups_files: StartupsFiles;
  startups_organizations: StartupsOrganizations;
  tasks: Tasks;
  teams: Teams;
  user_details: UserDetails;
  users: Users;
  users_formations: UsersFormations;
  users_startups: UsersStartups;
  users_teams: UsersTeams;
  verification_tokens: VerificationTokens;
  visits: Visits;
}

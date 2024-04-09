import { config } from "dotenv";
import {
    syncLdapEntities,
    syncLdapEntitiesFromDatabase,
} from "@schedulers/ldap/sync";
import { calendars, users } from "@schedulers/ldap/fixtures";

config();

if (!!true) {
    syncLdapEntities(users, calendars);
} else {
    syncLdapEntitiesFromDatabase();
}

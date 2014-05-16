grant all on mbsystem.users to mbsystem;
grant usage, select on sequence mbsystem.users_id_seq to mbsystem;

grant select on mbsystem.dual to mbsystem;
grant all on mbsystem.rooms to mbsystem;
grant usage, select on sequence mbsystem.rooms_id_seq to mbsystem;

grant all on mbsystem.events to mbsystem;
grant usage, select on sequence mbsystem.events_id_seq to mbsystem;

-- uzivatele
grant all on mbsystem_celikovsky.users to mbsystem_celikovsky;
grant usage, select on sequence mbsystem_celikovsky.users_id_seq to mbsystem_celikovsky;

grant select on mbsystem_celikovsky.dual to mbsystem_celikovsky;
grant all on mbsystem_celikovsky.rooms to mbsystem_celikovsky;
grant usage, select on sequence mbsystem_celikovsky.rooms_id_seq to mbsystem_celikovsky;

grant all on mbsystem_celikovsky.events to mbsystem_celikovsky;
grant usage, select on sequence mbsystem_celikovsky.events_id_seq to mbsystem_celikovsky;
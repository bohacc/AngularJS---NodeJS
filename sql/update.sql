create table users(
id Serial,
first_name Varchar(30),
last_name Varchar(30),
login Varchar(60),
login_token Varchar(100),
password Varchar(100),
login_token_expire timestamp with time zone
);

alter table users add primary key (id);
alter table users alter column first_name set not null;
alter table users alter column last_name set not null;
alter table users alter column login set not null;

insert into users(first_name,last_name,login,password) values('Martin','Boháč','bohacc@seznam.cz','heslo');

create table dual(dummy Varchar(30));
insert into dual values(null);

alter table users add column company varchar(60);

create table rooms(
id Serial,
name varchar(100)
);

create table events(
id Serial,
name varchar(100),
description varchar(500),
room numeric,
date_from Date,
date_to Date,
owner numeric
);

CREATE TABLE PARTNERI
(
  PARTNER                VARCHAR(40)      NOT NULL,
  NAZEV                  VARCHAR(240),
  ICO                    VARCHAR(25),
  DIC                    VARCHAR(25),
  SKUPINA                VARCHAR(25),
  REGION                 VARCHAR(10),
  SLEVA                  NUMERIC(5,2)            DEFAULT 0,
  SPLATNOST              NUMERIC(4),
  MENA                   VARCHAR(3),
  POZNAMKA               VARCHAR(4000),
  PRAVNICKA              NUMERIC(1)              DEFAULT 1,
  PLATCE_DPH             NUMERIC(1)              DEFAULT 1,
  WWW                    VARCHAR(120),
  DLUH                   NUMERIC(17,2),
  DODAVATEL              NUMERIC(1)              DEFAULT 0,
  ODBERATEL              NUMERIC(1)              DEFAULT 0,
  ZAMESTNANEC            NUMERIC(1)              DEFAULT 0,
  UA                     NUMERIC(4),
  PENALE                 NUMERIC(5,2)            DEFAULT 0,
  STAV                   NUMERIC(1)              DEFAULT 0                     NOT NULL,
  POTVRDIL               VARCHAR(30),
  POTVRZENO              DATE,
  INSTITUCE              NUMERIC(1)              DEFAULT 0                     NOT NULL,
  DRUH_CENY_NAK          VARCHAR(10),
  DRUH_CENY_PRO          VARCHAR(10),
  NASE_FIRMA             NUMERIC(1)              DEFAULT 0                     NOT NULL,
  UHRADA                 VARCHAR(40),
  KATEGORIE_CENY         VARCHAR(30),
  OMILOSTNENI            NUMERIC(1)              DEFAULT 0,
  UMISTENI_SKLAD         VARCHAR(10),
  FAKTURA_RPT            VARCHAR(60),
  KATEGORIE_CENY_KC      VARCHAR(30),
  ZAHRANICI              NUMERIC(1)              DEFAULT 0,
  MAKRO_SKUPINA          VARCHAR(10),
  AUTOR                  NUMERIC(1)              DEFAULT 0                     NOT NULL,
  SLEVA_DOD              NUMERIC(5,2)            DEFAULT 0,
  MESTO                  VARCHAR(50),
  ID                     SERIAL,
  ZAKAZKA                VARCHAR(10),
  BLOKOVAN               NUMERIC(1)              DEFAULT 0                     NOT NULL,
  VLASTNIK               VARCHAR(30),
  UPOZORNENI             VARCHAR(240),
  ZBOZI_NA_ZALOHU        NUMERIC(1)              DEFAULT 0,
  VOLNE_1                VARCHAR(25),
  VOLNE_2                NUMERIC(17,2),
  EX_ID                  VARCHAR(13),
  DLUH_POSPL             NUMERIC(17,2),
  DLUH_POSPL_DNY         NUMERIC(9),
  DODACI_PODMINKY        VARCHAR(3),
  DPH_STAT               VARCHAR(4),
  DPH_STAT_SKUPINA       NUMERIC(1)              DEFAULT 0,
  DAT_AKT                DATE,
  DOD_RABAT              NUMERIC(5,2),
  ZPUSOB_DORUCENI        VARCHAR(25),
  EMAIL                  VARCHAR(240),
  SKONTO_DNY             NUMERIC(3)              DEFAULT 0,
  SKONTO_PROC            NUMERIC(5,2)            DEFAULT 0,
  PRUMYSLOVE_OBALY       NUMERIC(1)              DEFAULT 0,
  XML_REPL_EXP           DATE,
  XML_REPL_IMP           DATE,
  HELP_DESK              NUMERIC(1)              DEFAULT 0,
  ZAPSANO                DATE,
  RIZIKO_POJ             NUMERIC(17,2)           DEFAULT 0                     NOT NULL,
  RIZIKO_FIRMA           NUMERIC(17,2)           DEFAULT 0                     NOT NULL,
  POJ_LIMIT_1            NUMERIC(17,2)           DEFAULT 0                     NOT NULL,
  POJ_PLATNOST_1         DATE,
  POJ_SPOLUCAST_1        NUMERIC(5,2)            DEFAULT 0                     NOT NULL,
  POJ_LIMIT_2            NUMERIC(17,2)           DEFAULT 0                     NOT NULL,
  POJ_PLATNOST_2         DATE,
  POJ_SPOLUCAST_2        NUMERIC(5,2)            DEFAULT 0                     NOT NULL,
  POJ_LIMIT_3            NUMERIC(17,2)           DEFAULT 0                     NOT NULL,
  POJ_PLATNOST_3         DATE,
  POJ_SPOLUCAST_3        NUMERIC(5,2)            DEFAULT 0                     NOT NULL,
  PENALE_TYP             NUMERIC(1)              DEFAULT 0                     NOT NULL,
  PRODEJCE               VARCHAR(40),
  SKUPINA_ZAK            VARCHAR(40),
  DLUH_POSPL_DNY_ROZSIR  NUMERIC(9),
  UDAVAT                 NUMERIC(1)              DEFAULT 1,
  JMENO_UZIVATELE        VARCHAR(240),
  HESLO_UZIVATELE        VARCHAR(240),
  HD_PRACOVNIK           VARCHAR(30),
  ZAPSAL                 VARCHAR(30),
  ZMENENO                DATE,
  ZMENIL                 VARCHAR(30),
  ESHOP                  NUMERIC(1)              DEFAULT 0,
  BLOKOVAT_PRIKAZ        NUMERIC(1)              DEFAULT 0,
  IMP_FILE_FORMAT        VARCHAR(25),
  SPLATNOST_DEN          NUMERIC(2),
  AFFILIATE              NUMERIC                 DEFAULT 0,
  OBCHODNIK              VARCHAR(40),
  PRODLENI               NUMERIC(4),
  ISIR_STAV              NUMERIC(1),
  ISIR_TEXT              VARCHAR(240),
  ISIR_DATUM             DATE,
  DODAVATELSKY_KREDIT    NUMERIC(17,2),
  PENALE_POKUTA          NUMERIC(6,3),
  INSOLVENCE             NUMERIC(1)              DEFAULT 0,
  SMLOUVA                NUMERIC(1)              DEFAULT 0,
  ELKOM_CHARSET          VARCHAR(25),
  VELKOOBCHOD            NUMERIC(1)              DEFAULT 0,
  CREDITCH_TEXT          VARCHAR(240),
  CREDITCH_DATUM         DATE,
  PREFEROVANA_EXPEDICE   NUMERIC(3),
  PREDLOHA               NUMERIC(9),
  FINDHODNOTA            VARCHAR(240),
  ARES_OR                NUMERIC(1)              DEFAULT 0,
  ARES_RES               NUMERIC(1)              DEFAULT 0,
  ARES_ZR                NUMERIC(1)              DEFAULT 0,
  ARES_PLATCE_DPH        NUMERIC(1)              DEFAULT 0,
  ARES_PLATCE_SD         NUMERIC(1)              DEFAULT 0,
  ARES_KONKURZ           NUMERIC(1)              DEFAULT 0,
  ARES_VYROVNANI         NUMERIC(1)              DEFAULT 0,
  ARES_INSOLVENCE        NUMERIC(1)              DEFAULT 0,
  ARES_DATUM             DATE,
  SKLAD_DOD              NUMERIC(9),
  KONKURENCE             NUMERIC(1)              DEFAULT 0,
  NP                     NUMERIC(1),
  NP_KONTROLA            DATE,
  NP_OD                  DATE,
  NP_ZVEREJNENI          DATE,
  NP_TEXT                VARCHAR(255),
  MATKA                  VARCHAR(40),
  DOPRAVA                VARCHAR(40),
  DLUH_MENA              NUMERIC(17,2),
  MENA_DLUH              VARCHAR(3),
  DOBA_DOPRAVY           NUMERIC(3)
);
alter table partneri add primary key (id);


CREATE TABLE PARTNERI_ADRESY
(
  PARTNER                VARCHAR(40),
  CISLO                  SERIAL,
  NAZEV_ADRESY           VARCHAR(80),
  ULICE                  VARCHAR(50),
  MESTO                  VARCHAR(50),
  PSC                    VARCHAR(11),
  STAT                   VARCHAR(4),
  SIDLO                  NUMERIC(1)              DEFAULT 0                     NOT NULL,
  POBOCKA                NUMERIC(1)              DEFAULT 0                     NOT NULL,
  DOPRAVA                NUMERIC(1)              DEFAULT 0                     NOT NULL,
  FAKTURACE              NUMERIC(1)              DEFAULT 0                     NOT NULL,
  VYCHOZI                NUMERIC(1)              DEFAULT 0,
  NAZEV_ADRESY_2         VARCHAR(80),
  POTVRZENI_OBJP         NUMERIC(1)              DEFAULT 0,
  TISK_NAZEV2            NUMERIC(1)              DEFAULT 0,
  POPIS                  VARCHAR(2000),
  EAN                    VARCHAR(30),
  OBJEKT                 VARCHAR(240),
  PRODEJCE               VARCHAR(40),
  ADRESA_NAKLADAT        NUMERIC(1)              DEFAULT 0,
  EX_ID                  VARCHAR(13),
  ZMENENO                DATE,
  ZMENIL                 VARCHAR(30),
  KORESPONDENCNI         NUMERIC(1)              DEFAULT 0,
  PERIODA_VYUCT_KOMISEO  NUMERIC(5),
  FINDHODNOTA            VARCHAR(240),
  KRAJ                   VARCHAR(2)
);
alter table PARTNERI_ADRESY add primary key (cislo);


CREATE TABLE PARTNERI_OSOBY
(
  PARTNER         VARCHAR(40),
  CISLO_ADRESY    NUMERIC(9),
  CISLO           SERIAL,
  PRIJMENI        VARCHAR(30),
  JMENO           VARCHAR(30),
  TITUL           VARCHAR(30),
  FUNKCE          VARCHAR(25),
  POZNAMKA        VARCHAR(240),
  VYCHOZI         NUMERIC(1)                     DEFAULT 0,
  FAKTURACE       NUMERIC(1)                     DEFAULT 0,
  TITUL2          VARCHAR(30),
  OSLOVENI        VARCHAR(60),
  POHLAVI         NUMERIC(1)                     DEFAULT 0                     NOT NULL,
  STAV            NUMERIC(1)                     DEFAULT 0                     NOT NULL,
  CRM_USER        VARCHAR(30),
  NAZEV_TISK      VARCHAR(240),
  OSOBA_NAKLADAT  NUMERIC(1)                     DEFAULT 0,
  EX_ID           VARCHAR(13),
  LOGIN_OSOBY     VARCHAR(240),
  ZMENENO         DATE,
  ZMENIL          VARCHAR(30),
  DAT_NAR         DATE,
  PASSWORD_OSOBY  VARCHAR(240),
  TEXT            VARCHAR(2000),
  RODNE_CISLO     VARCHAR(20),
  CISLO_OP        VARCHAR(30),
  PLATNOST_OP     DATE,
  VYDAL_OP        VARCHAR(240),
  OPRAVNENI       NUMERIC(2),
  OSOBA_PRO_WEB   NUMERIC(1)                     DEFAULT 0,
  FOTO            BYTEA,
  AKTIVNI         NUMERIC(1)                     DEFAULT 1,
  FINDHODNOTA     VARCHAR(240)
);
alter table PARTNERI_OSOBY add primary key (cislo);


CREATE TABLE PARTNERI_SPOJENI
(
  PARTNER             VARCHAR(40),
  CISLO               SERIAL,
  KOD                 VARCHAR(10)         NOT NULL,
  CISLO_ADRESY        NUMERIC(9),
  CISLO_OSOBY         NUMERIC(9),
  HODNOTA             VARCHAR(240)        NOT NULL,
  SORT                NUMERIC(3)                 DEFAULT 0,
  PROVAZAT_S_ADRESOU  NUMERIC(1)                 DEFAULT 1                     NOT NULL,
  EX_ID               VARCHAR(13),
  ZMENENO             DATE,
  ZMENIL              VARCHAR(30),
  FINDHODNOTA         VARCHAR(240)
);
alter table PARTNERI_SPOJENI add primary key (cislo);



CREATE TABLE PARTNERI_OSOBY_VZTAHY
(
  PARTNER      VARCHAR(40)                NOT NULL,
  CISLO_OSOBY  NUMERIC(9)                        NOT NULL,
  VZTAH        VARCHAR(25),
  PLATNOST_OD  DATE,
  PLATNOST_DO  DATE,
  PLATNY       NUMERIC(1),
  ID           NUMERIC(9),
  ZARAZENI     VARCHAR(25),
  VIZITKA      VARCHAR(240),
  ZMENIL       VARCHAR(30),
  ZMENENO      DATE
);



CREATE OR REPLACE VIEW adresar_pda2 AS
-- kommbinace partner-osoba
-- adresy k partnerovi nazavisle na osobe (libovolne 2) a naoupak
-- spojeni primarne od osoby a pak teprve od partnera (bez osoby, libovolne 2)
SELECT
P.NAZEV as Nazev_partnera,
Trim(O.JMENO||' '||O.PRIJMENI) as OSOBA,
trim(A.MESTO||' '||A.ULICE||' '||A.PSC) as ADRESA,
trim(A2.MESTO||' '||A2.ULICE||' '||A2.PSC) as ADRESA2,
ST1.HODNOTA as TEL,
ST2.HODNOTA as TEL2,
SM1.HODNOTA as MOBIL,
SM2.HODNOTA as MOBIL2,
SE1.HODNOTA as EMAIL,
SE2.HODNOTA as EMAIL2,
SW1.HODNOTA as TWITTER,
SS1.HODNOTA as SKYPE,
X.*,
GetPackString(X.PARTNER||'_*$'||decode(X.CISLO_OSOBY,-1,NULL,X.CISLO_OSOBY)||'_*$'||decode(X.CISLO_ADRESY,-1,NULL,X.CISLO_ADRESY)) as IDENT,
NVL(pa.ID,0)||'_'||decode(X.CISLO_OSOBY,-1,NULL,X.CISLO_OSOBY)||'_'||decode(X.CISLO_ADRESY,-1,NULL,X.CISLO_ADRESY) as IDENT2

from
(
SELECT
PDA.PARTNER,
PDA.CISLO_OSOBY,
PDA.CISLO_ADRESY,
decode(PDA.PARTNER,'0',NVL((SELECT min(CISLO) FROM PARTNERI_ADRESY WHERE CISLO_OSOBY=PDA.CISLO_OSOBY AND diffx(CISLO,PDA.CISLO_ADRESY)=1),-1),
                        NVL((SELECT min(CISLO) FROM PARTNERI_ADRESY WHERE PARTNER=PDA.PARTNER AND diffx(CISLO,PDA.CISLO_ADRESY)=1),-1)) as CISLO_ADRESY2, -- druha adresa
NVL(NVL(TO1,TP1),-1) as CISLO_TEL,
NVL(decode(NVL(NVL(decode(TO2,TO1,NULL,TO2),TP2),TP1),NVL(TO1,TP1), -1,NVL(NVL(decode(TO2,TO1,NULL,TO2),TP2),TP1)),-1) as CISLO_TEL2,
NVL(NVL(MO1,MP1),-1) as CISLO_MOBIL,
NVL(decode(NVL(NVL(decode(MO2,MO1,NULL,MO2),MP2),MP1),NVL(MO1,MP1), -1,NVL(NVL(decode(MO2,MO1,NULL,MO2),MP2),MP1)),-1) as CISLO_MOBIL2,
NVL(NVL(EO1,EP1),-1) as CISLO_EMAIL,
NVL(decode(NVL(NVL(decode(EO2,EO1,NULL,EO2),EP2),EP1),NVL(EO1,EP1), -1,NVL(NVL(decode(EO2,EO1,NULL,EO2),EP2),EP1)),-1) as CISLO_EMAIL2,
NVL(NVL(WO1,WP1),-1) as CISLO_TWITTER,
NVL(NVL(SO1,SP1),-1) as CISLO_SKYPE
from
(
SELECT PO.*,
  decode(PO.PARTNER,'0',NVL((SELECT min(CISLO) FROM PARTNERI_ADRESY WHERE CISLO_OSOBY=PO.CISLO_OSOBY),-1),
                         NVL((SELECT min(CISLO) FROM PARTNERI_ADRESY WHERE PARTNER=PO.PARTNER),-1)) as CISLO_ADRESY, -- prvni adresa
  (SELECT min(CISLO) FROM PARTNERI_SPOJENI WHERE CISLO_OSOBY=PO.CISLO_OSOBY AND KOD='TELEFON') as TO1, -- prvni tel osoby
  (SELECT min(CISLO) FROM PARTNERI_SPOJENI WHERE PARTNER=PO.PARTNER AND CISLO_OSOBY is null AND KOD='TELEFON') as TP1, -- prvni tel partnera
  (SELECT max(CISLO) FROM PARTNERI_SPOJENI WHERE CISLO_OSOBY=PO.CISLO_OSOBY AND KOD='TELEFON') as TO2, -- druhy tel osoby
  (SELECT max(CISLO) FROM PARTNERI_SPOJENI WHERE PARTNER=PO.PARTNER AND CISLO_OSOBY is null AND KOD='TELEFON') as TP2, -- druhy tel partnera
  (SELECT min(CISLO) FROM PARTNERI_SPOJENI WHERE CISLO_OSOBY=PO.CISLO_OSOBY AND KOD='MOBIL') as MO1,
  (SELECT min(CISLO) FROM PARTNERI_SPOJENI WHERE PARTNER=PO.PARTNER AND CISLO_OSOBY is null AND KOD='MOBIL') as MP1,
  (SELECT max(CISLO) FROM PARTNERI_SPOJENI WHERE CISLO_OSOBY=PO.CISLO_OSOBY AND KOD='MOBIL') as MO2,
  (SELECT max(CISLO) FROM PARTNERI_SPOJENI WHERE PARTNER=PO.PARTNER AND CISLO_OSOBY is null AND KOD='MOBIL') as MP2,
  (SELECT min(CISLO) FROM PARTNERI_SPOJENI WHERE CISLO_OSOBY=PO.CISLO_OSOBY AND KOD='E-MAIL') as EO1,
  (SELECT min(CISLO) FROM PARTNERI_SPOJENI WHERE PARTNER=PO.PARTNER AND CISLO_OSOBY is null AND KOD='E-MAIL') as EP1,
  (SELECT max(CISLO) FROM PARTNERI_SPOJENI WHERE CISLO_OSOBY=PO.CISLO_OSOBY AND KOD='E-MAIL') as EO2,
  (SELECT max(CISLO) FROM PARTNERI_SPOJENI WHERE PARTNER=PO.PARTNER AND CISLO_OSOBY is null AND KOD='E-MAIL') as EP2,
  (SELECT min(CISLO) FROM PARTNERI_SPOJENI WHERE CISLO_OSOBY=PO.CISLO_OSOBY AND KOD='TWITTER') as WO1,
  (SELECT min(CISLO) FROM PARTNERI_SPOJENI WHERE PARTNER=PO.PARTNER AND CISLO_OSOBY is null AND KOD='TWITTER') as WP1,
  (SELECT min(CISLO) FROM PARTNERI_SPOJENI WHERE CISLO_OSOBY=PO.CISLO_OSOBY AND KOD='SKYPE') as SO1,
  (SELECT min(CISLO) FROM PARTNERI_SPOJENI WHERE PARTNER=PO.PARTNER AND CISLO_OSOBY is null AND KOD='SKYPE') as SP1
FROM
(SELECT partner, cislo_osoby
  FROM partneri_osoby_vztahy pov
  UNION
 SELECT partner, 0
   FROM partneri p
  WHERE NOT EXISTS (SELECT 1 FROM partneri_osoby po
                     WHERE po.partner = p.partner)
    AND NOT EXISTS (SELECT 1 FROM partneri_osoby_vztahy pov
                     WHERE pov.partner = p.partner)
  UNION
 SELECT NVL (partner,'0'), cislo
   FROM partneri_osoby po
) PO
) PDA
) X,
(SELECT cislo, hodnota FROM partneri_spojeni) ss1,
(SELECT cislo, hodnota FROM partneri_spojeni) sw1,
(SELECT cislo, hodnota FROM partneri_spojeni) se2,
(SELECT cislo, hodnota FROM partneri_spojeni) se1,
(SELECT cislo, hodnota FROM partneri_spojeni) sm2,
(SELECT cislo, hodnota FROM partneri_spojeni) sm1,
(SELECT cislo, hodnota FROM partneri_spojeni) st2,
(SELECT cislo, hodnota FROM partneri_spojeni) st1,
(SELECT cislo, ulice, mesto, psc, stat FROM partneri_adresy) a2,
(SELECT cislo, ulice, mesto, psc, stat FROM partneri_adresy) a,
(SELECT cislo, prijmeni, jmeno FROM partneri_osoby) o,
(SELECT partner, nazev, ico, dic  FROM partneri) p,
(SELECT ID, PARTNER FROM PARTNERI) pa
WHERE x.partner = p.partner(+)
  AND x.Partner=pa.partner(+)
  AND x.cislo_osoby = o.cislo(+)
  AND x.cislo_adresy = a.cislo(+)
  AND x.cislo_adresy2 = a2.cislo(+)
  AND x.cislo_tel = st1.cislo(+)
  AND x.cislo_tel2 = st2.cislo(+)
  AND x.cislo_mobil = sm1.cislo(+)
  AND x.cislo_mobil2 = sm2.cislo(+)
  AND x.cislo_email = se1.cislo(+)
  AND x.cislo_email2 = se2.cislo(+)
  AND x.cislo_twitter = sw1.cislo(+)
  AND x.cislo_skype = ss1.cislo(+)
;

create table events(
id Serial,
name varchar(100),
description varchar(500),
room numeric,
date_from timestamp with time zone,
date_to timestamp with time zone,
owner numeric
);
alter table events add primary key (id);
alter table events alter column room type integer;
alter table events add column place varchar(200);
alter table events add column type integer;

create table contacts(
id Serial,
first_name varchar(100),
last_name varchar(100),
company varchar(100),
phone varchar(30),
email varchar(100)
);
alter table contacts add primary key (id);

alter table users add column email varchar(100);
alter table users add column level integer;

create table event_contacts(
  id_event numeric,
  id_contact numeric
);

alter table events alter column id type numeric(9); drop default;
alter table events alter column id drop default;
drop sequence events_id_seq cascade;
alter table users alter column id type numeric(9);
alter table users alter column id drop default;
drop sequence users_id_seq cascade;
alter table contacts alter column id type numeric(9);
alter table contacts alter column id drop default;
drop sequence contacts_id_seq cascade;

create sequence seq_events_id increment by 1 start with 1;
create sequence seq_contacts_id increment by 1 start with 1;

ALTER TABLE users ADD CONSTRAINT uq_users_login UNIQUE (login);
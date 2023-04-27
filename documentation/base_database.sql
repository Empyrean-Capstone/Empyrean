--
-- PostgreSQL database dump
--

-- Dumped from database version 12.12 (Ubuntu 12.12-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.12 (Ubuntu 12.12-0ubuntu0.20.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: koseward
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO koseward;

--
-- Name: instrument; Type: TABLE; Schema: public; Owner: koseward
--

CREATE TABLE public.instrument (
    "instrumentId" integer NOT NULL,
    "instrumentName" character varying
);


ALTER TABLE public.instrument OWNER TO koseward;

--
-- Name: instrument_instrumentId_seq; Type: SEQUENCE; Schema: public; Owner: koseward
--

CREATE SEQUENCE public."instrument_instrumentId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."instrument_instrumentId_seq" OWNER TO koseward;

--
-- Name: instrument_instrumentId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: koseward
--

ALTER SEQUENCE public."instrument_instrumentId_seq" OWNED BY public.instrument."instrumentId";


--
-- Name: observation; Type: TABLE; Schema: public; Owner: koseward
--

CREATE TABLE public.observation (
    id integer NOT NULL,
    owner_id integer,
    filename character varying,
    date_made_open_source timestamp without time zone,
    exp_time integer,
    ccd_temp double precision,
    image_typ character varying,
    gain double precision,
    "offset" double precision,
    gamma double precision,
    date_obs timestamp without time zone,
    instrume character varying,
    reworder character varying,
    object character varying,
    obs_type character varying,
    airm double precision,
    observer character varying,
    obs_id character varying,
    log_id character varying,
    mjdobs double precision,
    status character varying
);


ALTER TABLE public.observation OWNER TO koseward;

--
-- Name: observation_id_seq; Type: SEQUENCE; Schema: public; Owner: koseward
--

CREATE SEQUENCE public.observation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.observation_id_seq OWNER TO koseward;

--
-- Name: observation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: koseward
--

ALTER SEQUENCE public.observation_id_seq OWNED BY public.observation.id;


--
-- Name: status; Type: TABLE; Schema: public; Owner: koseward
--

CREATE TABLE public.status (
    id integer NOT NULL,
    "instrumentID" integer,
    "statusName" character varying,
    "statusValue" character varying,
    color character varying
);


ALTER TABLE public.status OWNER TO koseward;

--
-- Name: status_id_seq; Type: SEQUENCE; Schema: public; Owner: koseward
--

CREATE SEQUENCE public.status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.status_id_seq OWNER TO koseward;

--
-- Name: status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: koseward
--

ALTER SEQUENCE public.status_id_seq OWNED BY public.status.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: koseward
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    username character varying,
    password character varying,
    name character varying,
    isadmin boolean
);


ALTER TABLE public."user" OWNER TO koseward;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: koseward
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO koseward;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: koseward
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: instrument instrumentId; Type: DEFAULT; Schema: public; Owner: koseward
--

ALTER TABLE ONLY public.instrument ALTER COLUMN "instrumentId" SET DEFAULT nextval('public."instrument_instrumentId_seq"'::regclass);


--
-- Name: observation id; Type: DEFAULT; Schema: public; Owner: koseward
--

ALTER TABLE ONLY public.observation ALTER COLUMN id SET DEFAULT nextval('public.observation_id_seq'::regclass);


--
-- Name: status id; Type: DEFAULT; Schema: public; Owner: koseward
--

ALTER TABLE ONLY public.status ALTER COLUMN id SET DEFAULT nextval('public.status_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: koseward
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: koseward
--

COPY public.alembic_version (version_num) FROM stdin;
5ff6781b9017
\.


--
-- Data for Name: instrument; Type: TABLE DATA; Schema: public; Owner: koseward
--

COPY public.instrument ("instrumentId", "instrumentName") FROM stdin;
\.


--
-- Data for Name: observation; Type: TABLE DATA; Schema: public; Owner: koseward
--

COPY public.observation (id, owner_id, filename, date_made_open_source, exp_time, ccd_temp, image_typ, gain, "offset", gamma, date_obs, instrume, reworder, object, obs_type, airm, observer, obs_id, log_id, mjdobs, status) FROM stdin;
\.


--
-- Data for Name: status; Type: TABLE DATA; Schema: public; Owner: koseward
--

COPY public.status (id, "instrumentID", "statusName", "statusValue", color) FROM stdin;
9	-1	System	Ready	success
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: koseward
--

COPY public."user" (id, username, password, name, isadmin) FROM stdin;
1	root	$5$rounds=535000$idqWw0SftDxydwsp$652lRKq6sOxfkpUbNyZ8yIkgrkya70v22X/QClveQUB	root	t
\.


--
-- Name: instrument_instrumentId_seq; Type: SEQUENCE SET; Schema: public; Owner: koseward
--

SELECT pg_catalog.setval('public."instrument_instrumentId_seq"', 2, true);


--
-- Name: observation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: koseward
--

SELECT pg_catalog.setval('public.observation_id_seq', 14, true);


--
-- Name: status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: koseward
--

SELECT pg_catalog.setval('public.status_id_seq', 9, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: koseward
--

SELECT pg_catalog.setval('public.user_id_seq', 2, true);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: koseward
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: instrument instrument_pkey; Type: CONSTRAINT; Schema: public; Owner: koseward
--

ALTER TABLE ONLY public.instrument
    ADD CONSTRAINT instrument_pkey PRIMARY KEY ("instrumentId");


--
-- Name: observation observation_pkey; Type: CONSTRAINT; Schema: public; Owner: koseward
--

ALTER TABLE ONLY public.observation
    ADD CONSTRAINT observation_pkey PRIMARY KEY (id);


--
-- Name: status status_pkey; Type: CONSTRAINT; Schema: public; Owner: koseward
--

ALTER TABLE ONLY public.status
    ADD CONSTRAINT status_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: koseward
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--


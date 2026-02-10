-- Seed data for fallback dealership search (60 sample entries)
insert into public.dealerships_seed
  (id, name, brand, city, suburb, province, address, phone, lat, lng)
values
('d001','Chery Midrand','Chery','Midrand','Halfway House','Gauteng','124 Old Pretoria Rd, Midrand','+27 10 001 0001',-25.9984,28.1263),
('d002','Chery Fourways','Chery','Johannesburg','Fourways','Gauteng','52 Cedar Rd, Fourways','+27 10 001 0002',-26.0152,28.0097),
('d003','Chery Menlyn','Chery','Pretoria','Menlyn','Gauteng','280 Garsfontein Rd, Menlyn','+27 10 001 0003',-25.7844,28.2742),
('d004','Chery Centurion','Chery','Centurion','Centurion Central','Gauteng','61 Lenchen Ave, Centurion','+27 10 001 0004',-25.8589,28.1858),
('d005','Chery East Rand','Chery','Boksburg','East Rand','Gauteng','43 North Rand Rd, Boksburg','+27 10 001 0005',-26.2112,28.2596),
('d006','Chery Hatfield','Chery','Pretoria','Hatfield','Gauteng','112 Pretorius St, Hatfield','+27 10 001 0006',-25.7479,28.2366),
('d007','Chery Durban North','Chery','Durban','Durban North','KwaZulu-Natal','9 Umhlanga Rocks Dr, Durban North','+27 10 001 0007',-29.7866,31.0292),
('d008','Chery Umhlanga','Chery','Umhlanga','Umhlanga Ridge','KwaZulu-Natal','15 Meridian Dr, Umhlanga','+27 10 001 0008',-29.7262,31.0687),
('d009','Chery Pinetown','Chery','Pinetown','New Germany','KwaZulu-Natal','31 Josiah Gumede Rd, Pinetown','+27 10 001 0009',-29.8154,30.8547),
('d010','Chery Cape Town CBD','Chery','Cape Town','Foreshore','Western Cape','39 Buitengracht St, Cape Town','+27 10 001 0010',-33.9249,18.4241),
('d011','Chery Bellville','Chery','Cape Town','Bellville','Western Cape','17 Durban Rd, Bellville','+27 10 001 0011',-33.9046,18.6298),
('d012','Chery Somerset West','Chery','Somerset West','Helderberg','Western Cape','12 Main Rd, Somerset West','+27 10 001 0012',-34.079,18.8433),
('d013','Chery Gqeberha','Chery','Gqeberha','Walmer','Eastern Cape','84 Heugh Rd, Walmer','+27 10 001 0013',-33.9608,25.6022),
('d014','Chery East London','Chery','East London','Nahoon','Eastern Cape','46 Old Transkei Rd, East London','+27 10 001 0014',-32.986,27.8783),
('d015','Chery Bloemfontein','Chery','Bloemfontein','Westdene','Free State','102 Nelson Mandela Dr, Bloemfontein','+27 10 001 0015',-29.1183,26.2299),
('d016','Haval Midrand','Haval','Midrand','Waterfall','Gauteng','2 Waterfall Dr, Midrand','+27 10 001 0016',-26.0147,28.1071),
('d017','Haval Sandton','Haval','Johannesburg','Sandton','Gauteng','22 Rivonia Rd, Sandton','+27 10 001 0017',-26.1076,28.0567),
('d018','Haval Pretoria East','Haval','Pretoria','Faerie Glen','Gauteng','180 Atterbury Rd, Faerie Glen','+27 10 001 0018',-25.7994,28.3102),
('d019','Haval Polokwane','Haval','Polokwane','Bendor','Limpopo','48 Grobler St, Polokwane','+27 10 001 0019',-23.9011,29.4689),
('d020','Haval Nelspruit','Haval','Mbombela','Riverside','Mpumalanga','7 Riverside Rd, Mbombela','+27 10 001 0020',-25.4658,30.9853),
('d021','Haval Rustenburg','Haval','Rustenburg','Cashan','North West','88 Beyers Naude Dr, Rustenburg','+27 10 001 0021',-25.6676,27.2421),
('d022','Haval Klerksdorp','Haval','Klerksdorp','Flamwood','North West','73 Joe Slovo Rd, Klerksdorp','+27 10 001 0022',-26.8668,26.6667),
('d023','Haval Durban South','Haval','Durban','Amanzimtoti','KwaZulu-Natal','5 Kingsway Rd, Amanzimtoti','+27 10 001 0023',-30.0571,30.8835),
('d024','Haval Richards Bay','Haval','Richards Bay','Meer En See','KwaZulu-Natal','4 Anglers Rod, Richards Bay','+27 10 001 0024',-28.783,32.1013),
('d025','Haval Pietermaritzburg','Haval','Pietermaritzburg','Scottsville','KwaZulu-Natal','66 New England Rd, Pietermaritzburg','+27 10 001 0025',-29.6036,30.3794),
('d026','Haval Cape Town North','Haval','Cape Town','Montague Gardens','Western Cape','3 Koeberg Rd, Montague Gardens','+27 10 001 0026',-33.8703,18.5122),
('d027','Haval Paarl','Haval','Paarl','Central','Western Cape','29 Main Rd, Paarl','+27 10 001 0027',-33.7338,18.9628),
('d028','Haval George','Haval','George','Eden','Western Cape','11 York St, George','+27 10 001 0028',-33.964,22.4617),
('d029','Haval Kimberley','Haval','Kimberley','Civic Centre','Northern Cape','18 Du Toitspan Rd, Kimberley','+27 10 001 0029',-28.7282,24.7499),
('d030','Haval Upington','Haval','Upington','Keidebees','Northern Cape','42 Scott St, Upington','+27 10 001 0030',-28.4478,21.2561),
('d031','Omoda Menlyn','Omoda','Pretoria','Menlyn','Gauteng','12 Lois Ave, Menlyn','+27 10 001 0031',-25.7848,28.2749),
('d032','Omoda Centurion','Omoda','Centurion','Eldoraigne','Gauteng','190 Old Johannesburg Rd, Centurion','+27 10 001 0032',-25.8604,28.1635),
('d033','Omoda Bryanston','Omoda','Johannesburg','Bryanston','Gauteng','9 Main Rd, Bryanston','+27 10 001 0033',-26.0575,28.028),
('d034','Omoda Durban Central','Omoda','Durban','Morningside','KwaZulu-Natal','118 Innes Rd, Durban','+27 10 001 0034',-29.8349,31.0194),
('d035','Omoda Umhlanga','Omoda','Umhlanga','La Lucia','KwaZulu-Natal','6 Armstrong Ave, Umhlanga','+27 10 001 0035',-29.7553,31.0596),
('d036','Omoda Cape Town Foreshore','Omoda','Cape Town','Foreshore','Western Cape','17 Heerengracht St, Cape Town','+27 10 001 0036',-33.9179,18.4233),
('d037','Omoda Claremont','Omoda','Cape Town','Claremont','Western Cape','42 Main Rd, Claremont','+27 10 001 0037',-33.9817,18.4631),
('d038','Omoda Port Elizabeth','Omoda','Gqeberha','Newton Park','Eastern Cape','8 Cape Rd, Newton Park','+27 10 001 0038',-33.9397,25.5489),
('d039','Jaecoo Fourways','Jaecoo','Johannesburg','Fourways','Gauteng','16 Witkoppen Rd, Fourways','+27 10 001 0039',-26.018,28.005),
('d040','Jaecoo Midrand','Jaecoo','Midrand','Vorna Valley','Gauteng','24 Le Roux Ave, Midrand','+27 10 001 0040',-25.9681,28.1111),
('d041','Jaecoo Pretoria','Jaecoo','Pretoria','Lynnwood','Gauteng','85 Lynnwood Rd, Pretoria','+27 10 001 0041',-25.7522,28.2698),
('d042','Jaecoo Durban North','Jaecoo','Durban','Durban North','KwaZulu-Natal','22 Kenneth Kaunda Rd, Durban North','+27 10 001 0042',-29.7904,31.0309),
('d043','Jaecoo Ballito','Jaecoo','Ballito','Shaka''s Rock','KwaZulu-Natal','11 Compensation Beach Rd, Ballito','+27 10 001 0043',-29.539,31.2143),
('d044','Jaecoo Cape Town','Jaecoo','Cape Town','Century City','Western Cape','100 Century Blvd, Cape Town','+27 10 001 0044',-33.8912,18.5067),
('d045','Jaecoo Stellenbosch','Jaecoo','Stellenbosch','Techno Park','Western Cape','5 Techno Ave, Stellenbosch','+27 10 001 0045',-33.9368,18.8679),
('d046','BYD Sandton','BYD','Johannesburg','Sandton','Gauteng','33 Grayston Dr, Sandton','+27 10 001 0046',-26.1042,28.0637),
('d047','BYD Midrand','BYD','Midrand','Kyalami','Gauteng','55 Kyalami Blvd, Midrand','+27 10 001 0047',-25.9897,28.0845),
('d048','BYD Pretoria East','BYD','Pretoria','Hazeldean','Gauteng','16 Graham Rd, Hazeldean','+27 10 001 0048',-25.8041,28.351),
('d049','BYD Durban','BYD','Durban','Springfield','KwaZulu-Natal','24 Umgeni Rd, Durban','+27 10 001 0049',-29.8115,30.9947),
('d050','BYD Umhlanga','BYD','Umhlanga','Umhlanga Ridge','KwaZulu-Natal','20 Ncondo Pl, Umhlanga','+27 10 001 0050',-29.725,31.0661),
('d051','BYD Cape Town','BYD','Cape Town','Paarden Eiland','Western Cape','89 Marine Dr, Cape Town','+27 10 001 0051',-33.9023,18.4732),
('d052','BYD Bellville','BYD','Cape Town','Bellville','Western Cape','11 Voortrekker Rd, Bellville','+27 10 001 0052',-33.9,18.6291),
('d053','GWM Benoni','GWM','Benoni','Rynfield','Gauteng','18 Pretoria Rd, Benoni','+27 10 001 0053',-26.1884,28.3208),
('d054','GWM Boksburg','GWM','Boksburg','Parkrand','Gauteng','30 Atlas Rd, Boksburg','+27 10 001 0054',-26.2002,28.2593),
('d055','GWM Alberton','GWM','Alberton','New Redruth','Gauteng','40 Voortrekker Rd, Alberton','+27 10 001 0055',-26.2654,28.1226),
('d056','GWM Vereeniging','GWM','Vereeniging','Three Rivers','Gauteng','9 Ring Rd, Vereeniging','+27 10 001 0056',-26.6549,27.9977),
('d057','GWM Durban West','GWM','Durban','Westville','KwaZulu-Natal','28 Jan Hofmeyr Rd, Westville','+27 10 001 0057',-29.8394,30.9214),
('d058','GWM Pinetown','GWM','Pinetown','Pinetown Central','KwaZulu-Natal','77 Old Main Rd, Pinetown','+27 10 001 0058',-29.8167,30.8585),
('d059','GWM Cape Town South','GWM','Cape Town','Tokai','Western Cape','27 Main Rd, Tokai','+27 10 001 0059',-34.0599,18.4396),
('d060','GWM Worcester','GWM','Worcester','Hexpark','Western Cape','16 High St, Worcester','+27 10 001 0060',-33.6465,19.4485);
on conflict (id) do update
set
  name = excluded.name,
  brand = excluded.brand,
  city = excluded.city,
  suburb = excluded.suburb,
  province = excluded.province,
  address = excluded.address,
  phone = excluded.phone,
  lat = excluded.lat,
  lng = excluded.lng;

-- Seed beta contract tables from dealership dataset
insert into public.dealers
  (name, brands, country, city, timezone, business_hours, whatsapp_phone_number, plan, status, ai_config)
select distinct
  ds.name,
  array[ds.brand]::text[],
  'South Africa',
  ds.city,
  'Africa/Johannesburg',
  '{"mon":{"open":"08:00","close":"17:00"},"tue":{"open":"08:00","close":"17:00"},"wed":{"open":"08:00","close":"17:00"},"thu":{"open":"08:00","close":"17:00"},"fri":{"open":"08:00","close":"17:00"}}'::jsonb,
  ds.phone,
  'starter',
  'active',
  '{"faqs":[],"booking_rules":{},"escalation_rules":{},"handoff_contacts":[]}'::jsonb
from public.dealerships_seed ds
on conflict do nothing;

insert into public.subscriptions
  (dealer_id, plan, monthly_price, status, start_date)
select
  d.id,
  d.plan,
  case
    when d.plan = 'starter' then 8500
    when d.plan = 'growth' then 15000
    else 45000
  end,
  'trial',
  current_date
from public.dealers d
on conflict (dealer_id) do update
set
  plan = excluded.plan,
  monthly_price = excluded.monthly_price,
  status = excluded.status,
  start_date = excluded.start_date;

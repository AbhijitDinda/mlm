# Installation Guide

### 1. How to install

##### Setup Client Panel

- `cd client`
- `npm i --force`

##### Setup Admin Panel

- `cd admin`
- `npm i --force`

##### Setup Server Panel

- `cd server`
- `npm i`

### 2. Open in browser

##### Client Panel

- `cd client`
- `npm run dev`

##### Admin Panel

- `cd admin`
- `npm run dev`

##### Server Panel

- `cd server`
- `npm run dev`

#### Or Open All At One

- `npm run dev`

### 3. Setup Database

- Go to server/.env and change the MONGODB_URI

### 4. Change Port

- Client Panel -> client/src/config.ts
- Admin Panel -> admin/src/config.ts
- Server Panel -> server/.env

### 5. How to use your email for otp verification on localhost

1. Login to your Google account and go to the Security page.
   Scroll down to the Less secure app access section.
   ---------- OR ----------
   Go to [https://myaccount.google.com/u/0/lesssecureapps](https://myaccount.google.com/u/0/lesssecureapps)
2. Turn Off 2 Step Verification if enabled otherwise you can't see 'Turn on Less secure app' option
3. Turn on Less secure app access.

Last Modified: 19:03:2023 10:00:00 AM \
Created by [https://jamsrworld.com/](https://jamsrworld.com/) \
Contact us [https://jamsrworld.com/contact/](https://jamsrworld.com/contact/)

FROM mhart/alpine-node:8

RUN apk update \
  && apk add --no-cache curl bash make gcc g++ git python

WORKDIR /src

# Copy source code
COPY . .

RUN npm install
RUN npm rebuild bcrypt --build-from-source
RUN npm install -g pm2

RUN mkdir file

# Open 3000 Port
EXPOSE 3000

# Run pm2 when container start
CMD [ "pm2", "start", "app.js", "--no-daemon"]

FROM mhart/alpine-node:6

RUN apk update \
  && apk add --no-cache curl bash make gcc g++ git python
  
WORKDIR /src

# Copy source code
COPY . .

RUN npm install
RUN npm rebuild bcrypt --build-from-source

RUN touch list.txt

# Open 3000 Port
EXPOSE 3000

# Run npm start when container start
CMD [ "npm", "start" ]

FROM node:boron

WORKDIR /src

# Copy source code
COPY . .

RUN npm install

RUN touch list.txt

# Open 3000 Port
EXPOSE 3000

# Run npm start when container start
CMD [ "npm", "start" ]

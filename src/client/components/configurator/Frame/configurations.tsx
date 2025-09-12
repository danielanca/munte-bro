interface Config {
  applicationId: string;
  applicationSecret: string;
  APIKey?: string; // Optional if you don't always need it
  geolocationApi?: string; // Optional property for the geolocation API
}

const config: Config = {
  applicationId: "b25284ed-0a37-46c5-b226-a0aafc6035be",
  applicationSecret: "6ce5728cf84e82abc1d1a5943b2f09935521591d82d1bc5519afe13df45ba62ce996be9a4b84e64673372fe6806f3926ae0713b8ff2203479f7f4977200195e015fa5f281cf0b63f16df50bff9ad3d6d52a8928e2c1a0d37ef8be912e0f8cd99f40998cca32932e2546363f0dace22eb",
  APIKey: "ba3ab6cbe2mshae1e58dc7331e24p105b90jsn487db756eb1f",
  geolocationApi: 'AIzaSyBaFxPZczshN1xqhQluD4m3ZMskPZH9mik', 
};

export default config;
